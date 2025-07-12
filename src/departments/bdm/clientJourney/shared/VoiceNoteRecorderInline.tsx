import React, { useState, useRef } from 'react';

const VoiceNoteRecorderInline: React.FC<{ onAudio?: (url: string) => void }> = ({ onAudio }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isSupported = typeof window !== 'undefined' && !!(navigator.mediaDevices && window.MediaRecorder);
  const [error, setError] = useState<string | null>(null);
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
        if (onAudio) onAudio(url);
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
  return (
    <div className="flex flex-col gap-2 mt-2">
      <label className="font-medium">Voice Note</label>
      {error && <div className="text-xs text-destructive mb-1">{error}</div>}
      <div className="flex items-center gap-3">
        {isSupported ? (
          !recording ? (
            <button type="button" className="px-3 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center gap-2" onClick={startRecording} aria-label="Start recording">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1v14m0 0a5 5 0 0 0 5-5V6a5 5 0 0 0-10 0v4a5 5 0 0 0 5 5z" /></svg> Record
            </button>
          ) : (
            <button type="button" className="px-3 py-2 rounded bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 animate-pulse flex items-center gap-2" onClick={stopRecording} aria-label="Stop recording">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg> Stop
            </button>
          )
        ) : (
          <span className="text-xs text-muted-foreground">Audio recording is not supported in this browser or connection.</span>
        )}
        {audioURL && (
          <audio controls src={audioURL} className="ml-2" />
        )}
      </div>
      <span className="text-xs text-muted-foreground">You can record a short voice note to attach (not uploaded, just for demo).</span>
    </div>
  );
};

export default VoiceNoteRecorderInline; 