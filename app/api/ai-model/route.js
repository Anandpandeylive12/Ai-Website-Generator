export const dynamic = "force-dynamic";

import axios from "axios";

export const runtime = "nodejs"; // ✅ ensures Node stream support

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // 🧠 Send request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash-preview-09-2025",
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // ✅ use your real domain in production
          "X-Title": "My Next.js App",
        },
        responseType: "stream",
      }
    );

    const upstream = response.data; // Node.js readable stream
    const encoder = new TextEncoder();

    // Convert Node stream to Web ReadableStream for Next.js
    const readable = new ReadableStream({
      start(controller) {
        let buffer = "";
        let accumulated = "";
        let lastSentLength = 0;
        let closed = false;

        const safeClose = () => {
          if (!closed) {
            closed = true;
            if (accumulated.length > lastSentLength) {
              controller.enqueue(
                encoder.encode(accumulated.slice(lastSentLength))
              );
              lastSentLength = accumulated.length;
            }
            controller.close();
          }
        };

        upstream.on("data", (chunk) => {
          buffer += chunk.toString();
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const line = part.trim();
            if (!line) continue;

            // Detect stream completion
            if (line.includes("[DONE]")) {
              safeClose();
              return;
            }

            // Handle each data line
            const dataLines = line.split("\n").map((l) => l.trim());
            for (const dataLine of dataLines) {
              if (!dataLine.startsWith("data:")) continue;
              const jsonText = dataLine.replace(/^data:\s*/, "").trim();
              if (!jsonText) continue;

              try {
                const parsed = JSON.parse(jsonText);
                const choices = parsed?.choices ?? [];
                for (const choice of choices) {
                  const delta = choice?.delta?.content ?? "";
                  if (delta) accumulated += delta;
                }
              } catch (err) {
                console.warn("Parse error:", err.message);
              }
            }
          }

          // Push only new text since last chunk
          if (accumulated.length > lastSentLength && !closed) {
            const newText = accumulated.slice(lastSentLength);
            controller.enqueue(encoder.encode(newText));
            lastSentLength = accumulated.length;
          }
        });

        upstream.on("end", safeClose);
        upstream.on("close", safeClose);
        upstream.on("error", (err) => {
          console.error("Stream error:", err);
          if (!closed) controller.error(err);
        });
      },

      cancel() {
        try {
          upstream.destroy();
        } catch {}
      },
    });

    // ✅ Use `Response`, not `NextResponse`, for streaming
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
