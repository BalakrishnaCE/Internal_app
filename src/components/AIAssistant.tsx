import React, { useState } from 'react';
import { Bot, Mic, Square } from 'lucide-react';

const getAIGreeting = (context: string) => {
  switch (context) {
    case 'bdm-dashboard':
      return "Hi! I'm your AI Assistant. I can summarize your tasks, provide insights on your prospects, and help you plan your next actions.";
    case 'hr-dashboard':
      return "Hi! I'm your AI Assistant. I can help with employee management, onboarding, and HR analytics.";
    default:
      return "How can I assist you today?";
  }
};

interface AIAssistantProps {
  context: string;
  summary?: string;
  placement?: 'floating' | 'header';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ context, summary, placement = 'floating' }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && !!(navigator.mediaDevices && window.MediaRecorder);

  const startRecording = async () => {
    setError(null);
    if (!isSupported) {
      setError('Audio recording is not supported in this browser or connection.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setRecording(true);
    } catch (err) {
      setError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  if (placement === 'floating') {
    return (
      <>
        {!open && (
          <button
            className={`fixed bottom-6 right-6 z-50 bg-black text-white shadow-lg focus:outline-none transition-all duration-200
              ${hover ? 'w-48 rounded-full px-2 flex items-center h-14' : 'w-14 h-14 rounded-full flex items-center justify-center'}`}
            aria-label="Open AI Assistant"
            onClick={() => setOpen(true)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ overflow: 'hidden' }}
          >
            <span className="flex items-center justify-center w-14 h-14">
              <Bot className="w-7 h-7 m-0 p-0" />
            </span>
            {hover && (
              <span className="ml-1.5 text-base whitespace-nowrap">AI Assistant</span>
            )}
          </button>
        )}
        {open && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
            <div
              className="bg-card text-card-foreground rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md flex flex-col min-h-[60vh] max-h-[90vh] sm:min-h-[40vh] sm:max-h-[80vh]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            >
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-card rounded-t-2xl sm:rounded-2xl px-4 py-3 flex items-center justify-between border-b border-border">
                <h2 className="text-lg font-bold">AI Assistant</h2>
                <button onClick={() => { setOpen(false); setHover(false); }} className="text-muted-foreground hover:text-primary text-2xl">×</button>
              </div>
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-muted/40" style={{ minHeight: '180px', maxHeight: '50vh' }}>
                {summary && (
                  <div className="flex items-start gap-2">
                    <span className="mt-1"><Bot className="w-6 h-6 text-primary bg-white rounded-full border border-border p-1" /></span>
                    <div className="bg-primary/10 text-primary rounded-2xl px-4 py-3 text-sm whitespace-pre-line shadow-sm max-w-[80%]">
                      {summary}
                    </div>
                  </div>
                )}
                {/* Voice message playback */}
                {audioURL && (
                  <div className="flex items-start gap-2">
                    <span className="mt-1"><Mic className="w-6 h-6 text-primary bg-white rounded-full border border-border p-1" /></span>
                    <audio controls src={audioURL} className="ml-2 max-w-[80%]" />
                  </div>
                )}
                {error && (
                  <div className="text-xs text-destructive mb-1">{error}</div>
                )}
                {/* Future: map chat messages here */}
              </div>
              {/* Sticky Input Bar */}
              <div className="sticky bottom-0 z-10 bg-card rounded-b-2xl px-4 py-3 border-t border-border flex items-center gap-2">
                <input
                  className="flex-1 border border-input rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm shadow-sm"
                  placeholder="Type your message... (coming soon)"
                  disabled
                />
                {/* Voice record button */}
                {!recording ? (
                  <button
                    className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 disabled:opacity-50"
                    onClick={startRecording}
                    aria-label="Start voice recording"
                    disabled={!isSupported}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    className="bg-destructive text-destructive-foreground rounded-full p-2 animate-pulse"
                    onClick={stopRecording}
                    aria-label="Stop voice recording"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                )}
                <button className="bg-primary text-primary-foreground rounded-full px-4 py-2 font-semibold opacity-60 cursor-not-allowed" disabled>Send</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header or inline placement fallback
  return (
    <button
      className="bg-primary text-primary-foreground rounded-md px-3 py-2 shadow hover:scale-105 transition-transform flex items-center gap-2 font-semibold text-sm"
      onClick={() => setOpen(true)}
      aria-label="Open AI Assistant"
    >
      <Bot className="w-5 h-5" />
      <span className="font-semibold">AI Assistant</span>
    </button>
  );
}; 