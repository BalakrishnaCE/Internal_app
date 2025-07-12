import React, { useRef } from 'react';
import { X, FilePlus } from 'lucide-react';
import VoiceNoteRecorderInline from '../shared/VoiceNoteRecorderInline';
import { AIAssistant } from '@/components/AIAssistant';

interface VisitStepProps {
  open: boolean;
  onClose: () => void;
  prospectId: string;
  prospectName: string;
  visitComment: string;
  setVisitComment: (v: string) => void;
  visitFiles: File[];
  setVisitFiles: (files: File[]) => void;
}

const VisitStep: React.FC<VisitStepProps> = ({ open, onClose, prospectId, prospectName, visitComment, setVisitComment, visitFiles, setVisitFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVisitFiles([...visitFiles, ...Array.from(files)]);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setVisitFiles([...visitFiles, ...Array.from(files)]);
    }
  };
  const handleRemoveFile = (index: number) => {
    setVisitFiles(visitFiles.filter((_, i) => i !== index));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-4 relative">
        <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-2 text-primary">Visit Step</h2>
        <label className="font-medium mb-1">Descriptive Comments</label>
        <textarea
          className="border border-border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[80px] bg-background text-foreground"
          placeholder="Add comments about the visit..."
          value={visitComment}
          onChange={e => setVisitComment(e.target.value)}
        />
        <VoiceNoteRecorderInline />
        <label className="font-medium mb-1">Upload Files</label>
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${dragActive ? 'border-primary bg-primary/10' : 'border-muted'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Upload files by clicking or dragging"
        >
          <svg className="w-8 h-8 text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          <span className="text-sm text-muted-foreground mb-1">Drag & drop files here, or <span className="underline text-primary">click to choose</span></span>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
          />
        </div>
        {visitFiles.length > 0 && (
          <ul className="text-xs text-muted-foreground mb-2">
            {visitFiles.map((file, i) => (
              <li key={i} className="flex items-center gap-2 justify-between border-b border-border last:border-b-0 py-1">
                <span className="flex items-center gap-1"><FilePlus className="w-4 h-4 text-primary" /> {file.name}</span>
                <button
                  className="text-destructive hover:text-destructive/80 px-2 py-1 rounded"
                  onClick={() => handleRemoveFile(i)}
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 mt-2">
          <AIAssistant context={`lead:${prospectId}|step:prospect visited`} />
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-1"
            onClick={onClose}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitStep; 