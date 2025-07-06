import React, { useState } from 'react';
import { Bot } from 'lucide-react';

const getAIGreeting = (context: string) => {
  switch (context) {
    case 'bdm-dashboard':
      return "Hi! I'm your AI Assistant. I can summarize your tasks, provide insights on your prospects, and help you plan your next actions.";
    case 'hr-dashboard':
      return "Hi! I'm your AI Assistant. I can help with employee management, onboarding, and HR analytics.";
    // Add more cases as needed
    default:
      return "How can I assist you today?";
  }
};

export const AIAssistant = ({ context }: { context: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 min-h-[48px] min-w-[48px]"
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">AI Assistant</span>
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-card text-card-foreground rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md p-4 flex flex-col min-h-[40vh] sm:min-h-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">AI Assistant</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto mb-2 p-2 bg-muted rounded">
              <div className="text-muted-foreground text-sm">{getAIGreeting(context)}</div>
            </div>
            <input
              className="border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Type your message..."
              disabled
            />
          </div>
        </div>
      )}
    </>
  );
}; 