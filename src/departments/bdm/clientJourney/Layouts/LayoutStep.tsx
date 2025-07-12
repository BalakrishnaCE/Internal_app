import React, { useState, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { X, Check, FileText, Download, Upload } from 'lucide-react';
import VoiceNoteRecorderInline from '../shared/VoiceNoteRecorderInline';

// Mock buildings/floors and item types (move or import as needed)
const mockBuildings = [
  { id: 'b1', name: 'Alpha Tower', floors: ['1', '2', '3', '4'] },
  { id: 'b2', name: 'Beta Plaza', floors: ['G', '1', '2'] },
];
const itemTypes = [
  { value: 'workstation', label: 'Work Station', options: [
    'Office Desk', 'Professional Desk', 'Executive Desk', 'Premium Desk', 'Custom (add size)'
  ] },
  { value: 'cabin', label: 'Cabin', options: [
    'Manager Cabin', 'Custom Cabin (add details)'
  ] },
  { value: 'meeting', label: 'Meeting Room', options: [
    '2 Seater', '4 Seater'
  ] },
  { value: 'conference', label: 'Conference Room', options: [
    '6 Seater', '8 Seater', '10 Seater', '12 Seater', '14 Seater', '16 Seater', '18 Seater', '20 Seater'
  ] },
  { value: 'other', label: 'Other', options: [
    'Pantry', 'Reception', 'Lobby', 'Waiting Area', 'Lab', 'Storage', 'Server Room', 'Custom (require size)'
  ] },
];
const layoutStatusOptions = [
  { value: 'requested', label: 'Requested' },
  { value: 'pending', label: 'Pending' },
  { value: 'started', label: 'Started Working' },
  { value: 'approval', label: 'Approval Pending' },
  { value: 'approved', label: 'Approved' },
];

interface LayoutStepProps {
  open: boolean;
  onClose: () => void;
  prospectName: string;
}

const LayoutStep: React.FC<LayoutStepProps> = ({ open, onClose, prospectName }) => {
  const [files, setFiles] = useState<{ name: string, type: 'old' | 'new', selected?: boolean }[]>([
    { name: 'spaceplan_v1.pdf', type: 'old', selected: false },
    { name: 'spaceplan_v2.pdf', type: 'new', selected: true },
  ]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRequirement, setShowRequirement] = useState(false);
  const [desc, setDesc] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [nearby, setNearby] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('requested');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = e.target.files ? Array.from(e.target.files) : [];
    setFiles(prev => [
      ...prev,
      ...filesArr.map(f => ({ name: f.name, type: 'new' as const, selected: false }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const selectPlan = (idx: number) => {
    setFiles(files.map((f, i) => ({ ...f, selected: i === idx })));
  };
  const quickItems = [
    { type: 'workstation', label: 'Workstation' },
    { type: 'cabin', label: 'Cabin' },
    { type: 'meeting', label: 'Meeting Room' },
    { type: 'conference', label: 'Conference Room' },
    { type: 'other', label: 'Other' },
  ];
  const addQuickItem = (type: string) => {
    setItems([...items, { type, option: '', size: '', details: '', note: '' }]);
  };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const buildingObj = mockBuildings.find(b => b.id === building);
  const floorOptions = buildingObj ? buildingObj.floors : [];
  const statusObj = layoutStatusOptions.find(s => s.value === status);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className='w-full md:w-[600px] lg:w-[800px] max-w-full'>
        <div className="bg-background">
          <div className="flex items-center justify-between border-b border-border sticky top-0 bg-background z-10 px-2 sm:px-6 py-4">
            <h2 className="text-xl font-bold flex items-center gap-2">Space Plans for {prospectName}</h2>
            <button onClick={onClose} className="p-2 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
          <div className="py-4 border-b border-border flex-1 overflow-y-auto px-2 sm:px-6">
            <div className="mb-2 font-semibold">Available Space Plans</div>
            {files.length === 0 ? (
              <div className="text-sm text-muted-foreground mb-4">No space plans uploaded yet.</div>
            ) : (
              <ul className="mb-4">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm mb-2">
                    <button onClick={() => selectPlan(i)} className={`rounded-full border-2 w-5 h-5 flex items-center justify-center ${f.selected ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>{f.selected ? <Check className="w-4 h-4 text-primary" /> : null}</button>
                    <FileText className="w-4 h-4 text-primary" />
                    <span>{f.name}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${f.type === 'new' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{f.type === 'new' ? 'New' : 'Old'}</span>
                    <button className="ml-auto p-1 rounded hover:bg-muted" title="Download"><Download className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 mb-4">
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" id="layout-upload-sheet" />
              <button type="button" className="px-3 py-2 rounded bg-muted text-foreground hover:bg-muted/80 flex items-center gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Upload className="w-5 h-5" /> Upload New Plan
              </button>
            </div>
            <div className="mb-4">
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90" onClick={() => setShowRequirement(true)} disabled={showRequirement}>Add New Requirement</button>
            </div>
            {showRequirement && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="mb-2 font-semibold">New Layout Requirement</div>
                <textarea className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[80px] w-full mb-2" placeholder="Describe what's required for the new layout..." value={desc} onChange={e => setDesc(e.target.value)} />
                <VoiceNoteRecorderInline />
                <div className="flex flex-wrap gap-4 mt-2 mb-2">
                  <div>
                    <label className="font-medium">Building</label>
                    <select className="border rounded px-2 py-2 text-sm w-40" value={building} onChange={e => { setBuilding(e.target.value); setFloor(''); }}>
                      <option value="">Select Building</option>
                      {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-medium">Floor</label>
                    <select className="border rounded px-2 py-2 text-sm w-32" value={floor} onChange={e => setFloor(e.target.value)} disabled={!building}>
                      <option value="">Select Floor</option>
                      {floorOptions.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-medium">Nearby Place</label>
                    <input className="border rounded px-2 py-2 text-sm w-48" placeholder="e.g. next to server room" value={nearby} onChange={e => setNearby(e.target.value)} />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="font-medium mb-1">Quick Add Items</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {quickItems.map(q => (
                      <button key={q.type} type="button" className="px-3 py-1 rounded-full border border-primary text-primary bg-background hover:bg-primary/10 text-xs font-semibold" onClick={() => addQuickItem(q.type)}>{q.label}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {items.map((item, idx) => {
                      const typeObj = itemTypes.find(t => t.value === item.type);
                      return (
                        <div key={idx} className="flex flex-col gap-2 border border-border bg-muted rounded-lg p-3 mb-2 relative">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 flex-wrap">
                              {typeObj ? typeObj.label : item.type}
                              {typeObj && typeObj.options.length > 0 && (
                                <select className="ml-2 border rounded px-1 py-0.5 text-xs w-full sm:w-auto" value={item.option} onChange={e => updateItem(idx, 'option', e.target.value)}>
                                  <option value="">Select Option</option>
                                  {typeObj.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              )}
                              {item.type === 'workstation' && item.option === 'Custom (add size)' && (
                                <input className="border rounded px-1 py-0.5 text-xs ml-1 w-full sm:w-auto" placeholder="Custom size" value={item.size} onChange={e => updateItem(idx, 'size', e.target.value)} />
                              )}
                              {item.type === 'cabin' && item.option === 'Custom Cabin (add details)' && (
                                <input className="border rounded px-1 py-0.5 text-xs ml-1 w-full sm:w-auto" placeholder="Details" value={item.details} onChange={e => updateItem(idx, 'details', e.target.value)} />
                              )}
                              {item.type === 'other' && (item.option === 'Custom (require size)' || item.option) && (
                                <input className="border rounded px-1 py-0.5 text-xs ml-1 w-full sm:w-auto" placeholder="Size/details" value={item.size} onChange={e => updateItem(idx, 'size', e.target.value)} />
                              )}
                            </div>
                            <button type="button" className="px-1 py-0.5 rounded-full bg-destructive/10 text-destructive self-start" onClick={() => removeItem(idx)} title="Remove item"><X className="w-3 h-3" /></button>
                          </div>
                          <textarea className="border rounded px-1 py-1 text-xs w-full mt-1" placeholder="Add note for this item..." value={item.note || ''} onChange={e => updateItem(idx, 'note', e.target.value)} rows={2} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="font-medium">Status:</div>
                  {statusObj && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs font-semibold">{statusObj.label}</span>}
                </div>
                <button className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-4 w-full" onClick={() => { setShowRequirement(false); }}>Save Requirement</button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LayoutStep; 