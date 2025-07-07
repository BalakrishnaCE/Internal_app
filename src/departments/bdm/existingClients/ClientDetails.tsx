import React from 'react';
import { useParams } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';
import { FileText, FileImage, File } from 'lucide-react';

// Example clients data (should match ExistingClientsList)
const clients = [
  {
    id: 'c1',
    leadId: 'L-1001',
    name: 'Acme Corp',
    contact: 'Sarah Johnson',
    status: 'Active',
    initials: 'AC',
    billedItems: [
      { type: 'Desk', option: 'Executive Desk', quantity: 10, note: 'Corner offices' },
      { type: 'Meeting Room', option: '6 Seater', quantity: 2, note: '' },
      { type: 'Pantry', option: '', quantity: 1, note: 'With coffee machine' },
    ],
    agreement: '12 months, $5,000/mo',
    aiSummary: 'Acme Corp is billed for 10 executive desks, 2 meeting rooms, and a pantry. Agreement is for 12 months at $5,000/month. All payments on time.',
    attachments: [
      { name: 'Agreement.pdf', type: 'pdf', uploadedBy: 'Sarah Johnson', date: '2024-05-01', url: '#' },
      { name: 'FloorPlan.png', type: 'image', uploadedBy: 'Admin', date: '2024-05-02', url: '#' },
      { name: 'Invoice_May.txt', type: 'text', uploadedBy: 'Finance', date: '2024-05-31', url: '#' },
    ],
    building: 'Alpha Tower',
    floor: '3',
    nearby: 'Next to server room',
  },
  {
    id: 'c2',
    leadId: 'L-1002',
    name: 'Globex Inc',
    contact: 'Michael Chen',
    status: 'Pending',
    initials: 'GI',
    billedItems: [
      { type: 'Cabin', option: 'Manager Cabin', quantity: 3, note: '' },
    ],
    agreement: '6 months, $2,500/mo',
    aiSummary: 'Globex Inc has 3 manager cabins pending activation. Awaiting agreement signature.',
    attachments: [],
    building: 'Beta Plaza',
    floor: 'G',
    nearby: 'Near reception',
  },
  {
    id: 'c3',
    leadId: 'L-1003',
    name: 'Initech',
    contact: 'David Rodriguez',
    status: 'Inactive',
    initials: 'IN',
    billedItems: [
      { type: 'Conference Room', option: '12 Seater', quantity: 1, note: 'Used for quarterly reviews' },
    ],
    agreement: 'Ended',
    aiSummary: 'Initech previously used a 12-seater conference room. Agreement ended last quarter.',
    attachments: [
      { name: 'Old_Agreement.pdf', type: 'pdf', uploadedBy: 'David Rodriguez', date: '2023-01-10', url: '#' },
    ],
    building: 'Alpha Tower',
    floor: '2',
    nearby: 'Opposite pantry',
  },
  {
    id: 'c4',
    leadId: 'L-1004',
    name: 'Umbrella Corp',
    contact: 'Priya Patel',
    status: 'Active',
    initials: 'UC',
    billedItems: [
      { type: 'Desk', option: 'Office Desk', quantity: 20, note: '' },
      { type: 'Pantry', option: '', quantity: 1, note: '' },
    ],
    agreement: '24 months, $7,000/mo',
    aiSummary: 'Umbrella Corp is billed for 20 office desks and a pantry. Long-term agreement, all dues clear.',
    attachments: [
      { name: 'Umbrella_Agreement.pdf', type: 'pdf', uploadedBy: 'Priya Patel', date: '2024-02-15', url: '#' },
    ],
    building: 'Beta Plaza',
    floor: '1',
    nearby: 'Next to main entrance',
  },
  {
    id: 'c5',
    leadId: 'L-1005',
    name: 'Wayne Enterprises',
    contact: 'Aisha Khan',
    status: 'Active',
    initials: 'WE',
    billedItems: [
      { type: 'Desk', option: 'Premium Desk', quantity: 15, note: '' },
      { type: 'Storage', option: '', quantity: 2, note: 'Climate controlled' },
    ],
    agreement: '18 months, $6,000/mo',
    aiSummary: 'Wayne Enterprises has 15 premium desks and 2 storage units. Agreement is for 18 months.',
    attachments: [
      { name: 'Storage_Layout.pdf', type: 'pdf', uploadedBy: 'Aisha Khan', date: '2024-03-10', url: '#' },
      { name: 'DeskList.txt', type: 'text', uploadedBy: 'Admin', date: '2024-03-12', url: '#' },
    ],
    building: 'Alpha Tower',
    floor: '4',
    nearby: 'Next to server room',
  },
];

const statusStyles = {
  'Active': 'bg-success/10 text-success border-success/20',
  'Pending': 'bg-warning/10 text-warning border-warning/20',
  'Inactive': 'bg-muted text-muted-foreground border-border',
};

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf':
    case 'text':
      return <FileText className="w-5 h-5 text-primary" />;
    case 'image':
      return <FileImage className="w-5 h-5 text-primary" />;
    default:
      return <File className="w-5 h-5 text-primary" />;
  }
}

const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Client Details</h1>
        <div className="text-xl font-bold text-destructive">Client not found</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen">
      {/* AI Summary Chat Bubble */}
      <div className="flex items-start gap-2 mb-4">
        <div className="bg-primary/10 text-primary rounded-xl px-4 py-3 text-sm shadow-sm flex-1">
          {client.aiSummary}
        </div>
      </div>
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">{client.name}</h1>
          <p className="text-muted-foreground text-base sm:text-lg">Contact: {client.contact}</p>
          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
            <span className="font-semibold">Lead ID:</span> {client.leadId}
            <span className="font-semibold ml-2">Agreement:</span> {client.agreement}
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-xs">
            <div><span className="font-semibold">Building:</span> {client.building}</div>
            <div><span className="font-semibold">Floor:</span> {client.floor}</div>
            <div><span className="font-semibold">Nearby:</span> {client.nearby}</div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border self-start mt-2 sm:mt-0 ${statusStyles[client.status as keyof typeof statusStyles]}`}>
          {client.status}
        </span>
      </header>
      {/* Billed Items Card */}
      <section className="mb-8">
        <div className="bg-card rounded-xl shadow border border-border p-4 mb-4">
          <div className="font-semibold text-base mb-2 text-primary">Billed Items</div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {client.billedItems.map((item, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-foreground">{item.quantity}x {item.type}{item.option ? ` (${item.option})` : ''}</span>
                {item.note && <span className="text-xs text-muted-foreground italic">- {item.note}</span>}
              </li>
            ))}
          </ul>
        </div>
        {/* Attachments Section */}
        <div className="bg-card rounded-xl shadow border border-border p-4">
          <div className="font-semibold text-base mb-2 text-primary">Attachments</div>
          {client.attachments.length === 0 ? (
            <div className="text-xs text-muted-foreground italic">No attachments uploaded for this client.</div>
          ) : (
            <ul className="divide-y divide-border">
              {client.attachments.map((file, idx) => (
                <li key={idx} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <span>{getFileIcon(file.type)}</span>
                  <a href={file.url} className="text-sm font-medium text-primary hover:underline truncate" target="_blank" rel="noopener noreferrer">{file.name}</a>
                  <span className="text-xs text-muted-foreground ml-auto">{file.uploadedBy} • {file.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <AIAssistant context={`client:${client.id}|name:${client.name}|contact:${client.contact}|status:${client.status}`} />
    </div>
  );
};

export default ClientDetails; 