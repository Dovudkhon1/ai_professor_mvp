"use client";

import React, { useMemo, useRef, useState } from "react";

type Agent = {
    id: string;
    name: string;
    imgUrl: string;
    isCustom?: boolean;
};

export default function ProfessorPage() {
    const [history, setHistory] = useState<string[]>([
        "Supply & Demand intro (draft)",
        "Elasticity lesson (draft)",
    ]);

    const [agents, setAgents] = useState<Agent[]>([
        {
            id: "professor-nelly",
            name: "Professor Nelly",
            imgUrl: "/avatars/Professor-Nelly.png", // 👈 local file
        },
        {
            id: "professor-john",
            name: "Professor John",
            imgUrl: "/avatars/Professor-John.png",
        },
        {
            id: "professor-katherine",
            name: "Professor Katherine",
            imgUrl: "/avatars/Professor-Katherine.png",
        },
        {
            id: "professor-qobiljon",
            name: "Professor Qobiljon",
            imgUrl: "/avatars/Professor-Qobiljon.png",
        },
    ]);


    const [selectedAgentId, setSelectedAgentId] = useState<string>("a1");
    const [text, setText] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const selectedAgent = useMemo(
        () => agents.find((a) => a.id === selectedAgentId),
        [agents, selectedAgentId]
    );

    function onPickFile() {
        fileInputRef.current?.click();
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        setFileName(f ? f.name : null);
    }

    function onCustomAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;

        const url = URL.createObjectURL(f);
        const newAgent: Agent = {
            id: `custom-${Date.now()}`,
            name: "My Avatar",
            imgUrl: url,
            isCustom: true,
        };
        setAgents((prev) => [newAgent, ...prev]);
        setSelectedAgentId(newAgent.id);
    }

    function onSubmit() {
        // MVP behavior: no real processing. Just UI feedback.
        setBanner("✅ Your video generation started.");
        setTimeout(() => setBanner(null), 2500);

        const title = text.trim() ? text.trim().slice(0, 40) : "Untitled topic";
        setHistory((prev) => [title, ...prev]);

        setText("");
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div className="min-h-screen bg-gray-50 text-neutral-900">
            <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-800">Professor's Page</div>
                    <nav className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        <a href="/student">
                            Student page →
                        </a>
                    </nav>
                </div>
            </header>

            <main className="grid grid-cols-12 gap-0">
                {/* Left: history */}
                <aside className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 pl-2">
                        History
                    </div>
                    <div className="space-y-1">
                        {history.map((h, idx) => (
                            <button
                                key={`${h}-${idx}`}
                                className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                onClick={() => setText(h)}
                            >
                                {h}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Center: input */}
                <section className="col-span-12 md:col-span-6 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create a lesson video
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Explain the topic, attach extra content, choose an avatar, and start generation.
                            </p>
                        </div>

                        {banner && (
                            <div className="mb-4 rounded-lg border border-emerald-800 bg-emerald-900/30 px-4 py-3 text-sm">
                                {banner}
                            </div>
                        )}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                Selected avatar:{" "}
                                <span className="text-indigo-600">
                                    {selectedAgent?.name ?? "None"}
                                </span>
                            </div>

                            {/* ChatGPT-like input area */}
                            <div className="relative">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Explain the topic for the lesson..."
                                    className="w-full min-h-[160px] resize-none rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
                                />

                                {/* Plus button (top-right corner of text area) */}
                                <button
                                    type="button"
                                    onClick={onPickFile}
                                    className="absolute right-3 top-3 h-8 w-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-500 flex items-center justify-center transition-colors"
                                    aria-label="Attach file"
                                    title="Attach file"
                                >
                                    +
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={onFileChange}
                                />
                            </div>

                            {fileName && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Attached: <span className="text-gray-900 font-medium">{fileName}</span>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setText("");
                                        setFileName(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    className="rounded-xl bg-indigo-600 text-white px-6 py-2 text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all"
                                >
                                    Generate video
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: agents */}
                <aside className="col-span-12 md:col-span-3 border-t md:border-t-0 md:border-l border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-2">
                            Available agents
                        </div>

                    </div>

                    <div className="space-y-2">
                        {agents.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => setSelectedAgentId(a.id)}
                                className={[
                                    "w-full flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all",
                                    a.id === selectedAgentId
                                        ? "border-indigo-500 bg-white shadow-md ring-1 ring-indigo-500"
                                        : "border-transparent hover:bg-gray-200",
                                ].join(" ")}
                            >
                                <img
                                    src={a.imgUrl}
                                    alt={a.name}
                                    className="h-10 w-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{a.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {a.isCustom ? "Custom" : "Default"}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
