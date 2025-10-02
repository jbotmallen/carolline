"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock function to simulate AI response - replace with actual API call
const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock responses based on keywords
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("handbook") || lowerMessage.includes("rules")) {
    return "I can help you find information from the student handbook. The handbook covers academic policies, conduct guidelines, campus resources, and student rights. What specific topic would you like to know more about?";
  } else if (lowerMessage.includes("policy") || lowerMessage.includes("policies")) {
    return "Our school has various policies including attendance policy, academic integrity policy, and code of conduct. Which policy would you like to learn about?";
  } else if (lowerMessage.includes("hours") || lowerMessage.includes("schedule")) {
    return "The campus is open Monday through Friday from 7:00 AM to 10:00 PM, and on weekends from 9:00 AM to 6:00 PM. The library has extended hours during exam periods.";
  } else if (lowerMessage.includes("help") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm Carolline, your student handbook assistant. I can help you find information about school policies, rules, resources, and procedures. What would you like to know?";
  }

  return "I'd be happy to help you find that information in the student handbook. Could you please be more specific about what you're looking for? You can ask about policies, rules, procedures, or campus resources.";
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi! I'm Carolline, your student handbook assistant. I'm here to help you find information about school policies, rules, and procedures. What would you like to know?",
    role: "assistant",
    timestamp: new Date(),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Replace this with actual API call
      const aiResponse = await generateAIResponse(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30"
      >
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif">Carolline</h1>
              <p className="text-xs text-muted-foreground">
                Student Handbook Assistant
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="max-w-4xl mx-auto py-6">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-4"
            >
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </motion.div>
              </div>
              <div className="flex items-center gap-1 px-4 py-3 bg-card rounded-lg">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
