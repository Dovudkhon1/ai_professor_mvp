"use client";

import React, { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, RemoteTrack } from "livekit-client";

type CallInfo = {
    callId: string;
    livekitUrl: string;
    livekitToken: string;
};

export default function StudentPage() {
    const videoUrl =
        process.env.NEXT_PUBLIC_STUDENT_VIDEO_URL ||
        "/videos/supply-demand.mp4";

    const playerRef = useRef<HTMLVideoElement | null>(null);

    // LiveKit
    const roomRef = useRef<Room | null>(null);
    const avatarVideoRef = useRef<HTMLVideoElement | null>(null);
    const avatarAudioRef = useRef<HTMLAudioElement | null>(null);
    const videoStateRef = useRef({ time: 0, volume: 1, muted: false });

    const [mode, setMode] = useState<"video" | "call">("video");
    const [pausedAt, setPausedAt] = useState<number>(0);
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            stopCall().catch(() => { });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mode !== "video") return;

        const player = playerRef.current;
        if (!player) return;

        // Restore previous state
        const { time, volume, muted } = videoStateRef.current;

        player.currentTime = time;

        // Force sound ON (as you requested)
        player.muted = false;

        // Restore volume (or force volume=1 if you prefer)
        player.volume = volume ?? 1;

        // Resume playback
        const p = player.play();
        if (p && typeof p.catch === "function") {
            p.catch((err) => {
                console.warn("Video play blocked by browser policy:", err);
                // If this happens, it usually means the click wasn't considered a user gesture.
                // But in your case (button click), it should usually play.
            });
        }
    }, [mode]);

    async function createBeyondPresenceCall(): Promise<CallInfo> {
        const resp = await fetch("/api/bey/create-call", { method: "POST" });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || "Create call failed");
        return data as CallInfo;
    }

    async function startCall() {
        setStatus("Starting live conversation…");

        // Pause local video and remember time
        const player = playerRef.current;
        if (player) {
            videoStateRef.current = {
                time: player.currentTime,
                volume: player.volume,
                muted: player.muted,
            };
            player.pause();
        }


        let call: CallInfo;
        try {
            call = await createBeyondPresenceCall();
        } catch (e) {
            console.error(e);
            setStatus("Failed to start call (check server logs/env vars).");
            // Resume video if call fails
            if (player) player.play().catch(() => { });
            return;
        }

        // Switch UI to call mode (React will render avatar <video> in the same container)
        setMode("call");

        // Create / connect LiveKit room
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
            setStatus("Connected. Ask your question…");
        };


        room.on(RoomEvent.TrackSubscribed, onSubscribed);

        try {
            await room.connect(call.livekitUrl, call.livekitToken);
            setStatus("Connecting…");
            // 1) Ask for mic permission + publish mic audio to the room
            try {
                await room.localParticipant.setMicrophoneEnabled(true);
                setStatus("Mic on. Ask your question…");
            } catch (e) {
                console.error("Mic enable failed:", e);
                setStatus("Mic permission denied (enable mic to talk).");
            }

            // If the track already exists, attach immediately
            room.remoteParticipants.forEach((p) => {
                p.trackPublications.forEach((pub) => {
                    const t = pub.track;
                    if (t && t.kind === "video") {
                        t.attach(avatarVideoRef.current!);
                        setStatus("Connected to avatar. Ask your question…");
                    }
                });
            });
        } catch (e) {
            console.error(e);
            setStatus("LiveKit connect failed.");
            await stopCall();
        }
    }

    async function stopCall() {
        const room = roomRef.current;
        roomRef.current = null;

        try {
            if (room) {
                // Detach tracks cleanly
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

        // Resume local video
        const player = playerRef.current;
        if (player) {
            player.currentTime = pausedAt;
            player.play().catch(() => { });
        }
    }

    async function onMainButton() {
        if (mode === "video") await startCall();
        else await stopCall();
    }

    return (
        <div className="min-h-screen bg-gray-50 text-neutral-900">
            <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-800">Student's Page</div>
                    <nav className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        <a href="/professor">
                            ← Professor page
                        </a>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Supply &amp; Demand
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Economics 101
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={onMainButton}
                            className={[
                                "rounded-xl px-6 py-3 text-base font-semibold shadow-sm transition-all duration-200",
                                mode === "video"
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                            ].join(" ")}
                        >
                            {mode === "video" ? "Ask a question" : "Continue the lecture"}
                        </button>
                        {mode === "video" && (
                            <span className="text-xs text-indigo-600 font-medium animate-pulse">
                                Press when you want to ask something
                            </span>
                        )}
                    </div>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 font-medium">
                        {status}
                    </div>
                )}

                {/* Stage: React-controlled. No innerHTML manipulation. */}
                <div
                    className="rounded-2xl border border-gray-200 bg-black overflow-hidden shadow-lg"
                    style={{ aspectRatio: "16 / 9" }}
                >
                    {mode === "video" ? (
                        <video
                            ref={playerRef}
                            src={videoUrl}
                            controls
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <>
                            {/* Avatar video */}
                            <video
                                ref={avatarVideoRef}
                                autoPlay
                                playsInline
                                className="h-full w-full object-cover"
                            />

                            {/* Avatar audio (invisible, just for sound) */}
                            <audio ref={avatarAudioRef} autoPlay />
                        </>
                    )}
                </div>

            </main>
        </div>
    );
}
