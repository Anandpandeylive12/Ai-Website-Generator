export const dynamic = "force-dynamic";

import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ---------- GET ----------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get("frameId");

  if (!frameId) {
    return NextResponse.json({ error: "frameId is required" }, { status: 400 });
  }

  try {
    const frames = await db
      .select()
      .from(frameTable)
      .where(eq(frameTable.frameId, frameId));

    if (!frames || frames.length === 0) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    const frame = frames[0];

    // Fetch chats for this frame
    const chats = await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.frameId, frameId));

    const chatMessages = chats.flatMap((c) => c.chatMessages || []);

    return NextResponse.json({
      ...frame,
      chatMessages,
    });
  } catch (err) {
    console.error("❌ Error fetching frame:", err);
    return NextResponse.json({ error: "Failed to fetch frame" }, { status: 500 });
  }
}

// ---------- PUT (Save raw HTML only) ----------
export async function PUT(req) {
  try {
    const { newCode, frameId, projectId } = await req.json();

    if (!frameId || !projectId || !newCode) {
      return NextResponse.json({ error: "frameId, projectId and newCode are required" }, { status: 400 });
    }

    const cleanCode = newCode.trim(); // keep formatting intact

    // ✅ Save plain HTML code only
    const result = await db
      .update(frameTable)
      .set({ designCode: cleanCode })  // ← store raw HTML only
      .where(and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId)));

    return NextResponse.json({ result: "updated!", designCode: cleanCode });
  } catch (err) {
    console.error("❌ Error saving code:", err);
    return NextResponse.json({ error: "Failed to save code" }, { status: 500 });
  }
}
