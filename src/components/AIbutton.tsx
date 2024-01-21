"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import AIchatbox from "./chatbox";

export default function AIbutton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <AIchatbox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
      <Button
        onClick={() => setChatBoxOpen(true)}
        className="flex h-24 w-24 flex-col rounded-full bg-teal-500"
      >
        <Bot size={25} />
        <span className="text-sm">AI Chat</span>
      </Button>
    </>
  );
}
