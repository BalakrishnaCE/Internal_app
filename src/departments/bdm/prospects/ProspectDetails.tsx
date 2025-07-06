import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, FilePlus, Upload, X, MessageCircle } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';

// Example prospects data (sync with Dashboard)
const prospects = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    company: 'Acme Corp',
    date: '2024-06-01',
    status: 'Completed',
    initials: 'SJ',
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    company: 'Globex Inc',
    date: '2024-06-02',
    status: 'In Progress',
    initials: 'MC',
  },
  {
    id: 'p3',
    name: 'David Rodriguez',
    company: 'Initech',
    date: '2024-06-03',
    status: 'To Do',
    initials: 'DR',
  },
  {
    id: 'p4',
    name: 'Priya Patel',
    company: 'Umbrella Corp',
    date: '2024-06-04',
    status: 'Completed',
    initials: 'PP',
  },
  {
    id: 'p5',
    name: 'Aisha Khan',
    company: 'Wayne Enterprises',
    date: '2024-06-05',
    status: 'In Progress',
    initials: 'AK',
  },
];

const steps = [
  { key: 'visit', label: 'Visit' },
  { key: 'layout', label: 'Layout' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'maf', label: 'MAF' },
  { key: 'onboarding', label: 'Onboarding' },
];

// Mock: which steps are completed for this prospect
const mockCompleted = ['visit', 'layout'];
// Mock: last comment and files for summary
const mockLastComment = 'Discussed requirements and shared initial layout.';
const mockFiles = ['layout.pdf'];

const ProspectDetails: React.FC = () => {
  const { prospectId } = useParams<{ prospectId: string }>();
  const navigate = useNavigate();
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitComment, setVisitComment] = useState('');
  const [visitFiles, setVisitFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Find the prospect by ID
  const prospect = prospects.find(p => p.id === prospectId);

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

  if (!prospect) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
        <button
          className="mb-6 px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 font-semibold self-start"
          onClick={() => navigate('/bdm/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <div className="text-xl font-bold text-red-600">Prospect not found</div>
      </div>
    );
  }

  // Compose a summary string for the AI assistant
  const aiContext = `lead:${prospectId}|summary:${prospect.name},${prospect.company},${prospect.status}|steps:${mockCompleted.join(',')}|lastComment:${mockLastComment}|files:${mockFiles.join(',')}`;
  // Compose AI summary (mocked for now)
  const aiSummary = `Here's a quick summary of your journey with ${prospect.name} so far: Steps completed: ${mockCompleted.join(', ')}. Last comment: "${mockLastComment}". Files shared: ${mockFiles.join(', ')}.`;

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 py-8 px-2 sm:px-6">
        {/* Main Journey Area */}
        <div className="flex-1 min-w-0">
          <button
            className="mb-6 px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 font-semibold"
            onClick={() => navigate('/bdm/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Prospect Journey</h1>
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {steps.map((step, idx) => {
                const completed = mockCompleted.includes(step.key);
                const isVisit = step.key === 'visit';
                return (
                  <button
                    key={step.key}
                    className={`flex items-center w-full px-4 py-3 rounded-lg border transition-colors shadow-sm text-left gap-3
                      ${completed ? 'bg-green-50 border-green-200' : 'bg-card border-border'}
                      hover:bg-muted ${isVisit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                    onClick={() => isVisit && setShowVisitModal(true)}
                    disabled={!isVisit}
                  >
                    <span>
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
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
          {showVisitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-4 relative">
                <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted" onClick={() => setShowVisitModal(false)}>
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-2 text-primary">Visit Step</h2>
                <label className="font-medium mb-1">Descriptive Comments</label>
                <textarea
                  className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary min-h-[80px]"
                  placeholder="Add comments about the visit..."
                  value={visitComment}
                  onChange={e => setVisitComment(e.target.value)}
                />
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
                  <Upload className="w-8 h-8 text-primary mb-2" />
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
                      <li key={i} className="flex items-center gap-2 justify-between border-b last:border-b-0 py-1">
                        <span className="flex items-center gap-1"><FilePlus className="w-4 h-4" /> {file.name}</span>
                        <button
                          className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
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
                    onClick={() => setShowVisitModal(false)}
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar/Bottom Prospect Summary & AI Assistant */}
        <div className="md:w-96 w-full md:sticky md:top-8 md:self-start fixed bottom-0 left-0 right-0 z-40 md:z-auto bg-transparent md:bg-transparent flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow border border-border p-4 flex flex-col gap-4">
            {/* AI Summary Chat Bubble */}
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-shrink-0 mt-1">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="bg-blue-50 text-blue-900 rounded-xl px-4 py-3 text-sm shadow-sm flex-1">
                {aiSummary}
              </div>
            </div>
            {/* Client Factual Summary */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary">
                {prospect.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg sm:text-xl truncate">{prospect.name}</div>
                <div className="text-muted-foreground text-sm truncate">{prospect.company}</div>
                <div className="text-muted-foreground text-xs">Visited: {prospect.date}</div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border self-start
                ${prospect.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                  prospect.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  'bg-gray-100 text-gray-700 border-gray-200'}`}
            >
              {prospect.status}
            </span>
            <div className="text-xs text-muted-foreground mt-2">
              <div><span className="font-semibold">Steps completed:</span> {mockCompleted.join(', ') || 'None'}</div>
              <div><span className="font-semibold">Last comment:</span> {mockLastComment || 'No comments yet.'}</div>
              <div><span className="font-semibold">Files:</span> {mockFiles.length > 0 ? mockFiles.join(', ') : 'No files uploaded.'}</div>
            </div>
            {/* AI Assistant Input */}
            <div className="bg-muted rounded-lg p-3 flex flex-col gap-2 mt-2">
              <div className="font-semibold text-base mb-1">AI Assistant</div>
              <AIAssistant context={aiContext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetails; 