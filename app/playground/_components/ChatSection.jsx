import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import "../../types/frame.jsx";
import { se } from "date-fns/locale/se";

/**
 * @typedef {import('@/app/types/frame').Messages} Messages
 */

/**
 * @param {{ messages: Messages[] | undefined }} props
 */
const ChatSection = ({ messages, onsend,loading }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    console.log("Send message:", input);
    if (input?.trim() === "") return;
    onsend(input);
    setInput("");
  }
  return (
    <div className="w-96 flex flex-col shadow-lg h-[91vh] rounded-2xl bg-white border">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {(!messages || messages.length === 0) ? (
          <p className="text-center text-gray-400">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      {loading && (
  <div className="flex flex-col items-center justify-center p-4 space-y-3">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    <span className="text-sm text-zinc-600 font-medium">
      🤔 Thinking..... Working in Your Request
    </span>
  </div>
)}

      </div>

      {/* Footer input section */}
      <div className="border-t p-3 flex items-center gap-2 bg-gray-50">
        <input
          value={input}
          type="text"
          placeholder="Explain your website design requirement..."
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          onChange={(event) => setInput(event.target.value)}
        />
        <Button
          onClick={handleSend} // ✅ Add this
          disabled={!input.trim()} // ✅ Disable if empty
          className={`rounded-full h-10 w-10 flex items-center justify-center transition ${input.trim()
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};

export default ChatSection;
