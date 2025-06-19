import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Paperclip, Eye } from "lucide-react";
import { useChatAssetProcessor } from "@/hooks/useChatAssetProcessor";

const FloatingChatBar = () => {
  const [message, setMessage] = useState("");
  const { processMessage } = useChatAssetProcessor();

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      
      // Try to process as asset message first
      const wasProcessed = processMessage(message);
      
      if (wasProcessed) {
        console.log("Message processed as asset entry");
      } else {
        console.log("Message sent as regular chat");
        // Here you would handle regular chat functionality
      }
      
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-background border border-border rounded-xl shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 flex-1">
            <MessageSquare className="h-5 w-5 text-primary" />
            <Input
              placeholder="Ask FriedmannAI anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              size="sm" 
              className="h-8 w-8 p-0"
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Connect with a professional or view{" "}
            <span className="underline cursor-pointer">TOS</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingChatBar;
