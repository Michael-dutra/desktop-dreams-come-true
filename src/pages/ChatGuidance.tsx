import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Paperclip, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ChatGuidance = () => {
  const [message, setMessage] = useState("");

  const quickQuestions = [
    {
      question: "What steps can I take to improve my credit score?",
      isPopular: false,
    },
    {
      question: "What are the key differences between a TFSA and an RRSP?",
      isPopular: false,
    },
    {
      question: "Will I owe capital gains tax on my cottage?",
      isPopular: false,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleQuestionClick = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">FriedmannAI Chat</h1>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          {/* Welcome Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome, Michael
            </h1>
            <p className="text-xl text-muted-foreground">
              AI financial guidance, ready when you are
            </p>
          </div>

          {/* Quick Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickQuestions.map((item, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                onClick={() => handleQuestionClick(item.question)}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-foreground font-medium leading-relaxed text-left">
                      {item.question}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Help Text */}
          <div className="space-y-6">
            <p className="text-muted-foreground text-lg">
              Or ask anything else — I'm here to help with all your financial questions
            </p>

            {/* Chat Input */}
            <div className="w-full max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-4">
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
                  <div className="mt-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Connect with a professional or view{" "}
                      <span className="underline cursor-pointer">TOS</span> and{" "}
                      <span className="underline cursor-pointer">Privacy Policy</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatGuidance;
