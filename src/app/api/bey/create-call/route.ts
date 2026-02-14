import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const apiKey = process.env.BEY_API_KEY;

    // Default agent
    let agentId = process.env.BEY_AGENT_ID;

    try {
        const body = await req.json();
        const { topicId } = body;

        // Map topic to agent ID
        if (topicId === "supply-demand" && process.env.SUPPLY_DEMAND_AGENT_ID) {
            agentId = process.env.SUPPLY_DEMAND_AGENT_ID;
        } else if (topicId === "stock-market" && process.env.STOCK_MARKET_AGENT_ID) {
            agentId = process.env.STOCK_MARKET_AGENT_ID;
        } else if (topicId === "inflation" && process.env.INFLATION_AGENT_ID) {
            agentId = process.env.INFLATION_AGENT_ID;
        }
    } catch {
        // Ignore json parse details, use default agent
    }

    if (!apiKey || !agentId) {
        return NextResponse.json(
            { error: "Missing API configuration in .env.local" },
            { status: 500 }
        );
    }

    // Beyond Presence: Create Call -> returns livekit_url + livekit_token
    const resp = await fetch("https://api.bey.dev/v1/calls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
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
        agentIdUsed: agentId
    });
}
