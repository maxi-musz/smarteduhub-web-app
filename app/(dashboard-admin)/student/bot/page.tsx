"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

const StudentAIChatPage = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    // Handle sending message
    setMessage("");
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6">AI Study Assistant</h1>

        <Card className="flex-grow mb-4 overflow-hidden">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-4 p-2">
              {/* AI Message */}
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-grow">
                  <div className="bg-muted p-3 rounded-lg inline-block">
                    <p className="text-sm">
                      Hello! I&apos;m your AI study assistant. How can I help
                      you today?
                    </p>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start justify-end space-x-2">
                <div className="flex-grow flex justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg inline-block">
                    <p className="text-sm">
                      Can you help me understand calculus derivatives?
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-grow">
                  <div className="bg-muted p-3 rounded-lg inline-block">
                    <p className="text-sm">
                      Of course! A derivative measures the rate of change of a
                      function at a particular point. Think of it as the slope
                      of the tangent line at that point. Would you like me to
                      explain this further with some examples?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAIChatPage;
