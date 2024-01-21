import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { XCircle } from "lucide-react";
import { Input } from "postcss";
import { Button } from "./ui/button";
import { Message } from "ai";

interface AIchatProps {
  open: boolean;
  onClose: () => void;
}

export default function AIchatbox({ open, onClose }: AIchatProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px]  flex-col rounded border bg-background shadow-xl">
        <div className="no-scrollbar h-full overflow-y-auto">
          {messages.map((message) => (
            <ChatboxMessage message={message} key={message.id} />
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="m-3 flex justify-between gap-1"
        >
          <input
            value={input}
            className="w-full space-x-2 px-3"
            onChange={handleInputChange}
            placeholder="What's up?"
          />
          <Button type="submit">SEND</Button>
        </form>
      </div>
    </div>
  );
}

function ChatboxMessage({ message: { role, content } }: { message: Message }) {
  const isAssistant = role === "assistant";
  const messageClass = isAssistant ? "text-right" : "text-left";
  const roleClass = isAssistant ? "border-red-200 " : "border-teal-200";
  return (
    <div className={`mb-3 p-4 ${messageClass} `}>
      <div className="mb-2 font-bold">{role}</div>
      <div className={`${roleClass} rounded-md border-2  p-2`}>{content}</div>
    </div>
  );
}
