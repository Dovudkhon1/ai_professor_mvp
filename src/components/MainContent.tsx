"use client";

import React, { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, RemoteTrack } from "livekit-client";
import { Mic, Plus, Download, Save, Send, Loader2 } from "lucide-react";
import { Topic } from "@/app/page";

type CallInfo = {
    callId: string;
    livekitUrl: string;
    livekitUrlToken?: string;
    livekitToken: string;
};

type MainContentProps = {
    topic: Topic;
};

export default function MainContent({ topic }: MainContentProps) {
    const playerRef = useRef<HTMLVideoElement | null>(null);

    // LiveKit
    const roomRef = useRef<Room | null>(null);
    const avatarVideoRef = useRef<HTMLVideoElement | null>(null);
    const avatarAudioRef = useRef<HTMLAudioElement | null>(null);
    const videoStateRef = useRef({ time: 0, volume: 1, muted: false });

    const [mode, setMode] = useState<"video" | "call">("video");
    const [pausedAt, setPausedAt] = useState<number>(0);
    const [status, setStatus] = useState<string>("");
    const [inputValue, setInputValue] = useState("");

    // When topic changes, reset state and load new video
    useEffect(() => {
        // If in call, stop it
        if (mode === "call") {
            stopCall().catch(() => { });
        }
        setMode("video");
        setPausedAt(0);
        setStatus("");
        // Video ref source update happens automatically via render prop, but we may need to reload if not auto-detected
        if (playerRef.current) {
            playerRef.current.load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topic.id]);

    useEffect(() => {
        return () => {
            stopCall().catch(() => { });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mode !== "video") return;

        const player = playerRef.current;
        if (!player) return;

        // Only restore state if we are returning to the SAME video we paused. 
        // Since topic change resets mode to video, this logic runs. 
        // However, we reset pausedAt to 0 on topic change, so it starts from beginning which is correct for new topic.
        // If just toggling mode within same topic, it restores time.

        const { time, volume, muted } = videoStateRef.current;
        // If we just switched topics, time might be irrelevant, but useEffect dependency on mode handles toggle.
        // We need to be careful not to seek to old time if topic changed.

        // Simple fix: rely on standard behavior. If we just mounted or switched mode back:
        if (pausedAt > 0) {
            player.currentTime = pausedAt;
        }

        player.muted = false;
        player.volume = volume ?? 1;

        const p = player.play();
        if (p && typeof p.catch === "function") {
            p.catch((err) => {
                console.warn("Video play blocked by browser policy:", err);
            });
        }
    }, [mode, pausedAt]);

    async function createBeyondPresenceCall(): Promise<CallInfo> {
        const resp = await fetch("/api/bey/create-call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Pass topic ID to backend to select correct agent
            body: JSON.stringify({ topicId: topic.id })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || "Create call failed");
        return data as CallInfo;
    }

    async function startCall() {
        setStatus("Jonli suhbat boshlanmoqda…");

        const player = playerRef.current;
        if (player) {
            videoStateRef.current = {
                time: player.currentTime,
                volume: player.volume,
                muted: player.muted,
            };
            player.pause();
            setPausedAt(player.currentTime);
        }

        let call: CallInfo;
        try {
            call = await createBeyondPresenceCall();
        } catch (e) {
            console.error(e);
            setStatus("Qo'ng'iroqni boshlashda xatolik.");
            if (player) player.play().catch(() => { });
            return;
        }

        setMode("call");

        const room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        const onSubscribed = (track: RemoteTrack) => {
            if (track.kind === "video") {
                const el = avatarVideoRef.current;
                if (el) track.attach(el);
            }
            if (track.kind === "audio") {
                const el = avatarAudioRef.current;
                if (el) track.attach(el);
            }
            setStatus("Ulandi. Savolingizni bering…");
        };

        room.on(RoomEvent.TrackSubscribed, onSubscribed);

        try {
            await room.connect(call.livekitUrl, call.livekitToken);
            setStatus("Ulanmoqda…");
            try {
                await room.localParticipant.setMicrophoneEnabled(true);
                setStatus("Mikrofon yondi. Savolingizni bering…");
            } catch (e) {
                console.error("Mic enable failed:", e);
                setStatus("Mikrofonga ruxsat berilmadi.");
            }

            room.remoteParticipants.forEach((p) => {
                p.trackPublications.forEach((pub) => {
                    if (pub.track) {
                        const t = pub.track;
                        if (t.kind === "video") {
                            t.attach(avatarVideoRef.current!);
                            setStatus("Avatarga ulandi. Savolingizni bering…");
                        }
                    }
                });
            });
        } catch (e) {
            console.error(e);
            setStatus("LiveKit ulanishi muvaffaqiyatsiz bo'ldi.");
            await stopCall();
        }
    }

    async function stopCall() {
        const room = roomRef.current;
        roomRef.current = null;

        try {
            if (room) {
                room.remoteParticipants.forEach((p) => {
                    p.trackPublications.forEach((pub) => {
                        const t = pub.track;
                        if (t) t.detach();
                    });
                });
                try {
                    await room.localParticipant.setMicrophoneEnabled(false);
                } catch { }
                await room.disconnect();
            }
        } catch (e) {
            console.error(e);
        }

        setMode("video");
        setStatus("");

        // Only restore playback if on same topic (which is true unless user clicked sidebar mid-call)
        const player = playerRef.current;
        if (player) {
            if (pausedAt > 0) player.currentTime = pausedAt;
            player.play().catch(() => { });
        }
    }

    async function onAskQuestionClick() {
        if (mode === "video") await startCall();
        else await stopCall();
    }

    return (
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 p-4 gap-4">
            {/* Top Bar: Input & Controls */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex-shrink-0">
                <button className="p-2.5 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">
                    <Mic className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">
                    <Plus className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ma'ruza bo'yicha istalgan savol bering..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={onAskQuestionClick}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex-shrink-0 ${mode === "video"
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }`}
                >
                    {mode === "video" ? (
                        "Savol berish"
                    ) : (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Suhbatni tugatish</span>
                        </>
                    )}
                </button>
            </div>

            {/* Video Area (Flex Grow) */}
            <div className="flex-1 w-full flex items-center justify-center bg-black/5 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-900/10 mb-6">
                <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    {mode === "video" ? (
                        <video
                            ref={playerRef}
                            src={topic.videoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <>
                            <video
                                ref={avatarVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <audio ref={avatarAudioRef} autoPlay />
                            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                                <span className="inline-block px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                                    {status}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Bar: Save/Download */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
                    <p className="text-sm text-gray-500">{topic.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <Save className="w-4 h-4" />
                        Saqlash
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        Yuklab olish
                    </button>
                </div>
            </div>
        </main>
    );
}
