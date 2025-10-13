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

// ---------- PUT ----------
export async function PUT(req) {
  try {
    const { newCode, frameId, projectId, title } = await req.json();

    if (!frameId || !projectId || !newCode) {
      return NextResponse.json({ error: "frameId, projectId and newCode are required" }, { status: 400 });
    }

    // Fetch current designCode (structured JSON array)
    const frames = await db
      .select({ designCode: frameTable.designCode })
      .from(frameTable)
      .where(and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId)));

    const existingCode = frames?.[0]?.designCode || "[]";
    let codeArray;

    try {
      codeArray = JSON.parse(existingCode);
      if (!Array.isArray(codeArray)) codeArray = [];
    } catch {
      codeArray = [];
    }

    // Add new code as structured object
    const newEntry = {
      id: Date.now(),           // simple unique id
      title: title || `Component ${codeArray.length + 1}`,
      code: newCode,
      timestamp: new Date().toISOString(),
    };

    codeArray.push(newEntry);

    // Save updated array back as JSON
    const result = await db
      .update(frameTable)
      .set({ designCode: JSON.stringify(codeArray) })
      .where(and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId)));

    return NextResponse.json({ result: "updated!", updatedRows: result.count, designCode: codeArray });
  } catch (err) {
    console.error("❌ Error updating frame:", err);
    return NextResponse.json({ error: "Failed to update frame" }, { status: 500 });
  }
}
