"use client";

import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// 🧠 Keep your original systemPrompt intact
const systemPrompt = `
You are an expert AI web design assistant.

Follow these rules carefully:

1️⃣ If the user input explicitly asks to generate **code, design, or HTML/CSS/JS output** (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:
   - Generate complete <body> content using Tailwind CSS and Flowbite UI components.
   - Use a modern design with **blue as the primary color theme**.
   - Make it fully responsive for all screen sizes.
   - Include proper padding, margin, spacing, and visual hierarchy.
   - All components must match the theme color and look clean.
   - Use placeholders for all images:
       - Light: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       - Dark: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
   - Use FontAwesome icons (fa fa-), Flowbite components, Chart.js, Swiper.js, and Tippy.js as needed.
   - Include interactivity (modals, dropdowns, accordions).
   - Output **only HTML** (no explanations, no extra text before or after).

2️⃣ If the user input is **general or conversational** (e.g., "Hi", "Hello", "How are you?"), respond normally with a friendly short message instead of generating code.

Examples:
- User: "Hi" → Response: "Hello! How can I help you today?"
- User: "Build a landing page" → Response: [HTML code only]
`;

const PlayGround = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const [frameDetails, setFrameDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // Fetch frame details
  useEffect(() => {
    if (frameId) fetchFrameDetails();
  }, [frameId]);

  const fetchFrameDetails = async () => {
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      );
      setFrameDetails(result.data);
      setMessages(result.data.chatMessages || []);

      // Load last generated component into preview
      if (result.data?.designCode) {
        const codeArray = JSON.parse(result.data.designCode);
        if (codeArray.length > 0)
          setGeneratedCode(codeArray[codeArray.length - 1].code);
      }

      // Auto-run first user message if present
      if (
        result.data?.chatMessages?.length === 1 &&
        !result.data?.chatMessages[0].fromAI
      ) {
        SendMessage(result.data.chatMessages[0].content);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch frame details");
    }
  };

  // Handle sending new messages
  const SendMessage = async (input) => {
    setLoading(true);
    setGeneratedCode("");

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: systemPrompt }, ...updatedMessages],
        }),
      });

      if (!response.ok || !response.body) throw new Error("Streaming failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let isCode = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Detect start of HTML code
        if (!isCode && aiResponse.includes("```html")) {
          isCode = true;
          const index = aiResponse.indexOf("```html") + 7;
          const initialCode = aiResponse.slice(index);
          setGeneratedCode((prev) => prev + initialCode);
        } else if (isCode) {
          setGeneratedCode((prev) => prev + chunk);
        }
      }

      // Add AI chat message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: isCode ? "Your Code is Ready!" : aiResponse.trim() },
      ]);
    } catch (err) {
      console.error("Error in streaming:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
      toast.error("AI generation failed");
    }

    setLoading(false);
  };

  // Auto-save messages after update
  useEffect(() => {
    if (messages.length > 1 && !loading) SaveMessages();
  }, [messages]);

  const SaveMessages = async () => {
    try {
      await axios.put("/api/chats", { messages, frameId });
    } catch (err) {
      console.error("Failed to save messages:", err);
    }
  };

  // Auto-save generated code to frame design
  useEffect(() => {
    if (generatedCode?.trim()) saveGeneratedCode(generatedCode);
  }, [generatedCode]);

  // ✅ Corrected saveGeneratedCode function
  const saveGeneratedCode = async (code) => {
    if (!code) return;

    try {
      await axios.put("/api/frames", {
        newCode: code,          // send as newCode to match API
        frameId,
        projectId,
        title: `Component ${Date.now()}`, // optional
      });
      toast.success("Website is Ready!");
    } catch (err) {
      console.error("Failed to save generated code:", err);
      toast.error("Failed to save generated code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PlaygroundHeader />
      <div className="flex flex-1">
        <ChatSection
          messages={messages.filter((msg) => msg.role !== "system")}
          onsend={SendMessage}
          loading={loading}
        />
        <WebsiteDesign frameDetails={frameDetails} generatedCode={generatedCode} />
      </div>
    </div>
  );
};

export default PlayGround;
