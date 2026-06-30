"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/shared";
import { Send, Bot, User, Paperclip, MessageSquare, Code, FileText, Briefcase, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "doubt", label: "Doubt Solver", icon: MessageSquare, desc: "Ask anything about your coursework." },
  { id: "resume", label: "Resume Analyzer", icon: FileText, desc: "Upload resume for instant feedback." },
  { id: "interview", label: "Mock Interview", icon: Briefcase, desc: "Practice behavioral & technical questions." },
  { id: "code", label: "Code Reviewer", icon: Code, desc: "Paste code for optimization & bug fixes." },
];

export default function AIAssistantPage() {
  const [activeTool, setActiveTool] = useState("doubt");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm InterNexa Labs AI. I'm here to help you with your learning journey. What can I assist you with today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "This is a simulated AI response. In a production environment, this would be connected to an LLM endpoint (e.g., OpenAI, Gemini, or Claude) to provide real assistance based on the selected tool context." }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <PageHeader 
        title="AI Assistant" 
        description="Your personal 24/7 learning companion."
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Tools Sidebar */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">AI Tools</h3>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all",
                activeTool === tool.id
                  ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10"
                  : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
              )}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={cn("p-2 rounded-lg", activeTool === tool.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <span className={cn("font-bold", activeTool === tool.id ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                  {tool.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-12">
                {tool.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">InterNexa Labs AI</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
                  <Zap className="w-3 h-3" /> Using {TOOLS.find(t => t.id === activeTool)?.label} Mode
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex max-w-[85%]", msg.role === "user" ? "ml-auto justify-end" : "")}>
                <div className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn("w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1", 
                    msg.role === "ai" ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  )}>
                    {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn("p-4 rounded-2xl", 
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-sm" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700"
                  )}>
                    <p className="leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <button className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3 outline-none text-slate-900 dark:text-white"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              AI can make mistakes. Verify important information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
