import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MessageSquare, Send, Leaf, Sparkles } from "lucide-react";
import { useState } from "react";

const suggestions = [
  "What is the current NDVI index in North Kivu?",
  "Recommend crops for volcanic soil in Goma",
  "What are the drought risks for next season?",
  "Analyze soil health for my farmland",
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "Thank you for your question! The AI assistant will be connected soon. This is a preview of the Mazingira AI interface." },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 flex flex-col">
        <div className="container flex-1 flex flex-col max-w-3xl">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles size={32} className="text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Ask Mazingira AI</h1>
              <p className="mt-3 text-muted-foreground max-w-md">
                Your AI-powered environmental intelligence assistant. Ask about soil, crops, climate, and more.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="p-3 rounded-xl bg-card border border-border text-left text-sm text-foreground hover:border-primary/30 hover:shadow-soft transition-all"
                  >
                    <Leaf size={14} className="text-primary mb-1" />
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="py-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your land, crops, climate..."
                className="flex-1 px-4 py-3 rounded-xl bg-card border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleSend}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
