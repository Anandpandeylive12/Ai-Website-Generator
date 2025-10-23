export const dynamic = "force-dynamic";

import { db } from "@/config/db";
import { chatTable, frameTable, projectTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { projectId, frameId, messages } = await request.json();
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 🟢 1. Create Project
    await db.insert(projectTable).values({
      projectId,
      createdBy: user.primaryEmailAddress.emailAddress,
    });

    // 🟢 2. Create Frame
    await db.insert(frameTable).values({
      frameId,
      projectId,
    });

    // 🟢 3. Save chat messages as JSON (array of messages)
    await db.insert(chatTable).values({
      chatMessages: messages, // must be a valid JSON array
      frameId,
      createdBy: user.primaryEmailAddress.emailAddress,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
