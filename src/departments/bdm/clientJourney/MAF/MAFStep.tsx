import React, { useState, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { X, FileText, Upload } from 'lucide-react';
import VoiceNoteRecorderInline from '../shared/VoiceNoteRecorderInline';

interface MAFStepProps {
  open: boolean;
  onClose: () => void;
  prospectName: string;
}

const MAFStep: React.FC<MAFStepProps> = ({ open, onClose, prospectName }) => {
  const [files, setFiles] = useState<{ name: string, type: 'old' | 'new', selected?: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [desc, setDesc] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);

  // Handle file upload (mock, just adds to list)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = e.target.files ? Array.from(e.target.files) : [];
    setFiles(prev => [
      ...prev,
      ...filesArr.map(f => ({ name: f.name, type: 'new' as const, selected: false }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full md:w-[600px] lg:w-[800px] max-w-full">
        <div className="bg-background">
          <div className="flex items-center justify-between border-b border-border sticky top-0 bg-background z-10 px-2 sm:px-6 py-4">
            <h2 className="text-xl font-bold flex items-center gap-2">MAF for {prospectName}</h2>
            <button onClick={onClose} className="p-2 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
          <div className="py-4 border-b border-border flex-1 overflow-y-auto px-2 sm:px-6">
            <div className="mb-2 font-semibold">MAF Files</div>
            {files.length === 0 ? (
              <div className="text-sm text-muted-foreground mb-4">No MAF files uploaded yet.</div>
            ) : (
              <ul className="mb-4">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>{f.name}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${f.type === 'new' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{f.type === 'new' ? 'New' : 'Old'}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 mb-4">
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" id="maf-upload" />
              <button type="button" className="px-3 py-2 rounded bg-muted text-foreground hover:bg-muted/80 flex items-center gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Upload className="w-5 h-5" /> Upload MAF
              </button>
            </div>
            <div className="mb-4">
              <label className="font-medium mb-1 block">MAF Description</label>
              <textarea className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[80px] w-full mb-2" placeholder="Describe the MAF..." value={desc} onChange={e => setDesc(e.target.value)} />
              <VoiceNoteRecorderInline onAudio={setVoiceNoteUrl} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MAFStep; 