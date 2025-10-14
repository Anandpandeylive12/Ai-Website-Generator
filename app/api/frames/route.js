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

    // Wrap the new code inside the hero section layout
    const wrappedCode = `
<main>
    <!-- Hero Section -->
    <section class="bg-white dark:bg-gray-900">
        <div class="max-w-screen-xl mx-auto px-4 py-8 lg:py-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <!-- Content -->
            <div class="col-span-12 lg:col-span-7">
                ${newCode}
            </div>
            <!-- Image/Mockup -->
            <div class="col-span-12 lg:col-span-5 lg:flex hidden justify-center">
                <div class="relative w-full max-w-lg">
                    <img src="https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg" 
                        alt="Mockup" 
                        class="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    </section>
</main>
    `;

    // Add new code as structured object
    const newEntry = {
      id: Date.now(),           // unique id
      title: title || `Component ${codeArray.length + 1}`,
      code: wrappedCode,
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
