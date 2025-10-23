"use client";

import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import ElementSettingSection from "../_components/ElementSettingSection";

// System prompt
const systemPrompt =`
You are an expert AI web design assistant.

Follow these rules carefully:

1️⃣ If the user input explicitly asks to generate **code, design, or HTML/CSS/JS output**, then:
   - Generate complete <body> content using Tailwind CSS and Flowbite UI components.
   - Use a modern design with **blue as the primary color theme**.
   - Make it fully responsive.
   - Include proper padding, margin, spacing, visual hierarchy.
   - All components must match the theme color and look clean.
   - Use placeholders for images:
       - Light: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
       - Dark: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
   - Use FontAwesome icons, Flowbite, Chart.js, Swiper.js, Tippy.js as needed.
   - Include interactivity (modals, dropdowns, accordions).
   - Output **only HTML**.

2️⃣ If the user input is general or conversational, respond normally with a friendly short message.
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
      const result = await axios.get(`/api/frames?frameId=${frameId}&projectId=${projectId}`);
      setFrameDetails(result.data);
      setMessages(result.data.chatMessages || []);

      // Load last generated code if exists
      if (result.data?.designCode) {
        setGeneratedCode(result.data.designCode);
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

  // Send message to AI
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
      let finalCode = "";
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
          finalCode += initialCode;
          setGeneratedCode(finalCode);
        } else if (isCode) {
          finalCode += chunk;
          setGeneratedCode(finalCode);
        }
      }

      // Save **raw HTML string only**
      if (isCode) await saveGeneratedCode(finalCode);

      // Add AI chat message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: isCode ? "Your Code is Ready!" : aiResponse.trim() },
      ]);
    } catch (err) {
      console.error("Error in streaming:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong." }]);
      toast.error("AI generation failed");
    }

    setLoading(false);
  };

  // Auto-save messages
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

  // Save raw HTML to frame design
  const saveGeneratedCode = async (code) => {
    if (!code) return;

    try {
      await axios.put("/api/frames", {
        newCode: code, // raw HTML string only
        frameId,
        projectId,
        title: "AI Generated Website",
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
