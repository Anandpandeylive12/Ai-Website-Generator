import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PUT(request) {
  try {
    const { messages, frameId } = await request.json();

    if (!frameId) {
      return NextResponse.json({ error: "frameId is missing" }, { status: 400 });
    }

    const result = await db
      .update(chatTable)
      .set({ chatMessages: messages })
      .where(eq(chatTable.frameId, frameId))
      .returning({ updatedId: chatTable.frameId });

    return NextResponse.json({ result: "updated", data: result });
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
