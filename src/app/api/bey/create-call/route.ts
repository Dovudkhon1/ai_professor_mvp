import { NextResponse } from "next/server";

export async function POST() {
    const apiKey = process.env.BEY_API_KEY;
    const agentId = process.env.BEY_AGENT_ID;

    if (!apiKey || !agentId) {
        return NextResponse.json(
            { error: "Missing BEY_API_KEY or BEY_AGENT_ID in .env.local" },
            { status: 500 }
        );
    }

    // Beyond Presence: Create Call -> returns livekit_url + livekit_token :contentReference[oaicite:3]{index=3}
    const resp = await fetch("https://api.bey.dev/v1/calls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey, // auth header :contentReference[oaicite:4]{index=4}
        },
        body: JSON.stringify({
            agent_id: agentId,
            livekit_username: "Student",
            tags: { app: "ai-avatar-professor-mvp" },
        }),
    });

    const data = await resp.json();

    if (!resp.ok) {
        return NextResponse.json(
            { error: "Beyond Presence create call failed", details: data },
            { status: 500 }
        );
    }

    return NextResponse.json({
        callId: data.id,
        livekitUrl: data.livekit_url,
        livekitToken: data.livekit_token,
    });
}
