import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, FilePlus, Upload, X, MessageCircle, Mic, Square, FileText, FilePlus2, Building2, MapPin, ListPlus, Loader2, Clock, Hourglass, Check, Send, ThumbsUp, Download, MoreVertical, Ban, AlertTriangle, Bookmark, Lock, Sparkles, Lightbulb } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import VisitStep from '../Visits/VisitStep';
import LayoutStep from '../Layouts/LayoutStep';
import VoiceNoteRecorderInline from '../shared/VoiceNoteRecorderInline';
import ProposalStep from '../Proposals/ProposalStep';
import MAFStep from '../MAF/MAFStep';
import OnboardingStep from '../Onboarding/OnboardingStep';
import { fetchProspectJourneyDetails } from '../../API/nagashree';

// Example prospects data (sync with Dashboard)
// const prospects = [
//   {
//     id: 'LEADID00332102',
//     name: 'Sarah Johnson',
//     company: 'Acme Corp',
//     date: '2024-06-01',
//     status: 'Completed',
//     initials: 'SJ',
//   },
//   {
//     id: 'LEADID00332377',
//     name: 'Michael Chen',
//     company: 'Globex Inc',
//     date: '2024-06-02',
//     status: 'In Progress',
//     initials: 'MC',
//   },
//   {
//     id: 'p3',
//     name: 'David Rodriguez',
//     company: 'Initech',
//     date: '2024-06-03',
//     status: 'To Do',
//     initials: 'DR',
//   },
//   {
//     id: 'p4',
//     name: 'Priya Patel',
//     company: 'Umbrella Corp',
//     date: '2024-06-04',
//     status: 'Completed',
//     initials: 'PP',
//   },
//   {
//     id: 'p5',
//     name: 'Aisha Khan',
//     company: 'Wayne Enterprises',
//     date: '2024-06-05',
//     status: 'In Progress',
//     initials: 'AK',
//   },
// ];

const steps = [
  { key: 'visit', label: 'Visit' },
  { key: 'layout', label: 'Layout' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'maf', label: 'MAF' },
  { key: 'onboarding', label: 'Onboarding' },
];

// Mock: last comment and files for summary
const mockLastComment = 'Discussed requirements and shared initial layout.';
const mockFiles = ['layout.pdf'];

// Status options for layout request
const layoutStatusOptions = [
  { value: 'requested', label: 'Requested', icon: <FilePlus2 className="w-4 h-4 text-primary" /> },
  { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4 text-muted-foreground" /> },
  { value: 'started', label: 'Started Working', icon: <Loader2 className="w-4 h-4 animate-spin text-warning" /> },
  { value: 'approval', label: 'Approval Pending', icon: <Send className="w-4 h-4 text-orange-500" /> },
  { value: 'approved', label: 'Approved', icon: <ThumbsUp className="w-4 h-4 text-success" /> },
];

// Mock buildings/floors
const mockBuildings = [
  { id: 'b1', name: 'Alpha Tower', floors: ['1', '2', '3', '4'] },
  { id: 'b2', name: 'Beta Plaza', floors: ['G', '1', '2'] },
];

// Item types and options
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

function ExistingFilesList({ files }: { files: { name: string, type: 'old' | 'new' }[] }) {
  if (!files.length) return <div className="text-sm text-muted-foreground">No layout files uploaded yet.</div>;
  return (
    <ul className="mb-2">
      {files.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm mb-1">
          <FileText className="w-4 h-4 text-primary" />
          <span>{f.name}</span>
          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${f.type === 'new' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{f.type === 'new' ? 'New' : 'Old'}</span>
        </li>
      ))}
    </ul>
  );
}

function SpacePlanSheet({ open, onClose, prospectName }: { open: boolean, onClose: () => void, prospectName: string }) {
  // Local state for all fields
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

  // Handle file upload (mock, just adds to list)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArr = e.target.files ? Array.from(e.target.files) : [];
    setFiles(prev => [
      ...prev,
      ...filesArr.map(f => ({ name: f.name, type: 'new' as const, selected: false }))
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Select active plan
  const selectPlan = (idx: number) => {
    setFiles(files.map((f, i) => ({ ...f, selected: i === idx })));
  };

  // Quick add items
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
  // Building/floor options
  const buildingObj = mockBuildings.find(b => b.id === building);
  const floorOptions = buildingObj ? buildingObj.floors : [];
  // Status icon
  const statusObj = layoutStatusOptions.find(s => s.value === status);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className='w-full md:w-[600px] lg:w-[800px] max-w-full'>
        <div className="bg-background">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border sticky top-0 bg-background z-10 px-2 sm:px-6 py-4">
            <h2 className="text-xl font-bold flex items-center gap-2">Space Plans for {prospectName}</h2>
            <button onClick={onClose} className="p-2 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
          {/* Space Plan Files Section */}
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
            {/* Requirement Form */}
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
                              {/* Custom fields for certain types/options */}
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
                  {statusObj && <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs font-semibold">{statusObj.icon} {statusObj.label}</span>}
                </div>
                <button className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-4 w-full" onClick={() => { setShowRequirement(false); }}>Save Requirement</button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const ProspectDetails: React.FC = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitComment, setVisitComment] = useState('');
  const [visitFiles, setVisitFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showLayoutSheet, setShowLayoutSheet] = useState(false);
  const [blockAction, setBlockAction] = useState<string | null>(null); // 'soft-block' or 'fully-blocked'
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [showProposalSheet, setShowProposalSheet] = useState(false);
  const [showMAFSheet, setShowMAFSheet] = useState(false);
  const [showOnboardingSheet, setShowOnboardingSheet] = useState(false);
  // State: which steps are completed for this prospect
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // State for prospect data from API
  const [prospect, setProspect] = useState<any | null>(null);
  // Available layouts (from mockFiles, or from API if available)
  const availableLayouts = mockFiles;

  // Handler for file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVisitFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Drag and drop handlers
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
      setVisitFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setVisitFiles(files => files.filter((_, i) => i !== index));
  };

  // Action handler: open modal to select layout
  const handleAction = (action: string) => {
    setBlockAction(action);
    setShowBlockModal(true);
    setSelectedLayout(availableLayouts[0] || '');
  };

  // Confirm block action
  const handleConfirmBlock = () => {
    alert(`${blockAction === 'soft-block' ? 'Soft Block' : 'Fully Blocked'}: ${selectedLayout}`);
    setShowBlockModal(false);
    setBlockAction(null);
    setSelectedLayout('');
  };

  React.useEffect(() => {
    if (prospectId) {
      fetchProspectJourneyDetails(prospectId).then((result) => {
        // result is expected to be an array, take the first item
        const journey = Array.isArray(result) && result.length > 0 ? result[0] : null;
        console.log('API journey:', journey);
        setProspect(journey);
        const steps: string[] = [];
        if (journey && journey.leasing_status === 'Visited Prospect') {
          steps.push('visit');
        }
        // Only mark 'visit' as completed based on leasing_status
        setCompletedSteps(steps);
      });
    }
  }, [prospectId]);

  if (!prospect) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Prospect Journey</h1>
        <div className="text-xl font-bold text-destructive">Prospect not found</div>
      </div>
    );
  }

  console.log('Lead ID:', prospectId);
  // Compose a summary string for the AI assistant
  const aiContext = `lead:${prospectId}|summary:${prospect.name},${prospect.company},${prospect.status}|steps:${completedSteps.join(',')}|lastComment:${mockLastComment}|files:${mockFiles.join(',')}`;
  // Compose AI summary (mocked for now)
  const aiSummary = `Here's a quick summary of your journey with ${prospect.name} so far: Steps completed: ${completedSteps.join(', ')}. Last comment: "${mockLastComment}". Files shared: ${mockFiles.join(', ')}.`;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 py-8 px-2 sm:px-6 flex-1 w-full">
        {/* Main Journey Area */}
        <div className="flex-1 min-w-0 overflow-y-auto pb-4">
          {/* Header with Action Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Prospect Journey</h1>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 focus:outline-none focus:ring-0 focus:border-0"
                  aria-label="Actions"
                >
                  <MoreVertical className="w-6 h-6 text-primary" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-50 min-w-[180px] rounded-lg border border-border bg-background py-1 shadow-xl">
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-primary/10 rounded text-primary"
                    onSelect={() => handleAction('soft-block')}
                  >
                    <Bookmark className="w-4 h-4 text-primary" />
                    Soft Block
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-muted/20 rounded text-foreground"
                    onSelect={() => handleAction('fully-blocked')}
                  >
                    <Lock className="w-4 h-4 text-foreground" />
                    Fully Blocked
                  </DropdownMenu.Item>
                  {/* Add more actions here as needed */}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {steps.map((step, idx) => {
                const completed = completedSteps.includes(step.key);
                const isVisit = step.key === 'visit';
                const isLayout = step.key === 'layout';
                const isProposal = step.key === 'proposal';
                const isMAF = step.key === 'maf';
                const isOnboarding = step.key === 'onboarding';
                return (
                  <button
                    key={step.key}
                    className={`flex items-center w-full px-4 py-3 rounded-lg border transition-colors shadow-sm text-left gap-3
                      bg-card border-border
                      ${!completed ? 'hover:bg-muted' : ''} ${isVisit || isLayout || isProposal || isMAF || isOnboarding ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                    onClick={() => {
                      if (isVisit) setShowVisitModal(true);
                      if (isLayout) setShowLayoutSheet(true);
                      if (isProposal) setShowProposalSheet(true);
                      if (isMAF) setShowMAFSheet(true);
                      if (isOnboarding) setShowOnboardingSheet(true);
                    }}
                    disabled={!(isVisit || isLayout || isProposal || isMAF || isOnboarding)}
                  >
                    <span>
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </span>
                    <span className="font-semibold text-lg flex-1">{step.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {completed ? 'Completed' : 'To Do'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
          {/* Visit Step Modal */}
          <VisitStep
            open={showVisitModal}
            onClose={() => setShowVisitModal(false)}
            prospectId={prospectId || ''}
            prospectName={prospect.name || ''}
            visitComment={visitComment}
            setVisitComment={setVisitComment}
            visitFiles={visitFiles}
            setVisitFiles={setVisitFiles}
          />
          {/* Layout Step Sheet */}
          <LayoutStep
            open={showLayoutSheet}
            onClose={() => setShowLayoutSheet(false)}
            prospectName={prospect.name || ''}
          />
          {/* Proposal Step Sheet */}
          <ProposalStep
            open={showProposalSheet}
            onClose={() => setShowProposalSheet(false)}
            prospectName={prospect.name || ''}
          />
          {/* MAF Step Sheet */}
          <MAFStep
            open={showMAFSheet}
            onClose={() => setShowMAFSheet(false)}
            prospectName={prospect.name || ''}
          />
          {/* Onboarding Step Sheet */}
          <OnboardingStep
            open={showOnboardingSheet}
            onClose={() => setShowOnboardingSheet(false)}
            prospectName={prospect.name || ''}
          />
          {/* Block Layout Modal */}
          {showBlockModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
              <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-4 relative border border-border">
                <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted" onClick={() => setShowBlockModal(false)}>
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-2 text-primary">{blockAction === 'soft-block' ? 'Soft Block' : 'Fully Blocked'} Space</h2>
                <div>
                  <label className="font-medium mb-1 block">Select Layout to Block</label>
                  <select
                    className="border rounded px-2 py-2 text-sm w-full mt-1"
                    value={selectedLayout}
                    onChange={e => setSelectedLayout(e.target.value)}
                  >
                    {availableLayouts.map((layout, idx) => (
                      <option key={layout} value={layout}>{layout}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2 w-full"
                  onClick={handleConfirmBlock}
                  disabled={!selectedLayout}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar/Bottom Prospect Summary & AI Assistant */}
        <div className="w-full md:w-96 md:sticky md:top-8 md:self-start static z-auto bg-transparent flex flex-col gap-4 mt-6 md:mt-0 overflow-y-auto flex-shrink-0">
          {/* AI Summary Container (styled like tasks tab) */}
          <aside className="w-full bg-white border border-gray-200 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-black mb-1 flex items-center gap-2 border-b-2 border-blue-500 pb-1">
              <Lightbulb className="w-6 h-6 text-blue-500" aria-hidden="true" />
              AI Summary
            </h2>
            <p className="text-sm text-muted-foreground mb-3">Get a quick, actionable overview of this prospect's journey and status.</p>
            <div className="">
              <div className="font-semibold mb-2 text-base">AI Insights</div>
              <div className="text-sm whitespace-pre-line">{aiSummary}</div>
            </div>
          </aside>
          {/* Client Info Container */}
          <div className="bg-background rounded-xl shadow border border-border p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary">
                {prospect.initials ? String(prospect.initials).charAt(0).toUpperCase() : ''}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg sm:text-xl truncate">{prospect.name}</div>
                <div className="text-muted-foreground text-sm truncate">{prospect.company}</div>
                <div className="text-muted-foreground text-xs">Visited: {prospect.visit_date}</div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border self-start
                ${prospect.leasing_status === 'Visited Prospect' ? 'bg-primary/10 text-primary border-primary/20' :
                  prospect.leasing_status === 'Active Prospect' ? 'bg-warning/10 text-warning border-warning/20' :
                  'bg-muted text-muted-foreground border-border'}`}
            >
              {prospect.leasing_status}
            </span>
            <div className="text-xs text-muted-foreground mt-2">
              <div><span className="font-semibold">Steps completed:</span> {completedSteps.join(', ') || 'None'}</div>
              <div><span className="font-semibold">Last comment:</span> {mockLastComment || 'No comments yet.'}</div>
              <div><span className="font-semibold">Files:</span> {mockFiles.length > 0 ? mockFiles.join(', ') : 'No files uploaded.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetails; 