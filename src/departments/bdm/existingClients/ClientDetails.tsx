import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';
import { FileText, FileImage, File, Sparkles, Plus, ArrowDown, ArrowUp, ArrowRight, Building2, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
      { id: 'i1', type: 'Desk', option: 'Executive Desk', quantity: 10, note: 'Corner offices' },
      { id: 'i2', type: 'Meeting Room', option: '6 Seater', quantity: 2, note: '' },
      { id: 'i3', type: 'Pantry', option: '', quantity: 1, note: 'With coffee machine' },
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
      { id: 'i4', type: 'Cabin', option: 'Manager Cabin', quantity: 3, note: '' },
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
      { id: 'i5', type: 'Conference Room', option: '12 Seater', quantity: 1, note: 'Used for quarterly reviews' },
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
      { id: 'i6', type: 'Desk', option: 'Office Desk', quantity: 20, note: '' },
      { id: 'i7', type: 'Pantry', option: '', quantity: 1, note: '' },
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
      { id: 'i8', type: 'Desk', option: 'Premium Desk', quantity: 15, note: '' },
      { id: 'i9', type: 'Storage', option: '', quantity: 2, note: 'Climate controlled' },
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

// Mock data for client changes
const clientChanges = [
  {
    type: 'Downsize',
    date: '2024-05-10',
    details: 'Reduced 2 desks (from 10→8)',
    status: 'Completed',
  },
  {
    type: 'Expansion',
    date: '2024-04-01',
    details: 'Added 1 meeting room',
    status: 'Completed',
  },
  {
    type: 'Movement',
    date: '2024-03-15',
    details: 'Moved to Floor 5, Alpha Tower',
    status: 'Completed',
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

const typeIcon = (type: string) => {
  if (type === 'Downsize') return <span title="Downsize" className="text-blue-500">↓</span>;
  if (type === 'Expansion') return <span title="Expansion" className="text-green-500">↑</span>;
  if (type === 'Movement') return <span title="Movement" className="text-yellow-500">↔</span>;
  return null;
};
const statusBadge = (status: string) => {
  if (status === 'Completed') return <span className="bg-success/10 text-success px-2 py-0.5 rounded text-xs font-medium border border-success/20">Completed</span>;
  if (status === 'In Progress') return <span className="bg-warning/10 text-warning px-2 py-0.5 rounded text-xs font-medium border border-warning/20">In Progress</span>;
  if (status === 'Requested') return <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium border border-border">Requested</span>;
  return <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium border border-border">{status}</span>;
};

const CHANGE_TYPES = [
  { value: "downsize", label: "Downsize", icon: ArrowDown },
  { value: "expansion", label: "Expansion", icon: ArrowUp },
  { value: "movement", label: "Movement", icon: ArrowRight },
];

type SelectedItem =
  | { id: string; quantity: number; note?: string; isCustom: false }
  | { id: string; type: string; option: string; quantity: number; note?: string; isCustom: true };

// Add itemTypes array (from layouts/SpacePlanSheet)
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

  const [changes, setChanges] = useState<any[]>(clientChanges); // Replace mockChanges with your data source
  const [modalOpen, setModalOpen] = useState(false);
  const [newChange, setNewChange] = useState<{
    type: string;
    date: string;
    notes: string;
    selectedItems: SelectedItem[];
  }>({
    type: "downsize",
    date: "",
    notes: "",
    selectedItems: client?.billedItems?.length
      ? [{ id: client.billedItems[0].id, quantity: 1, isCustom: false }]
      : [],
  });
  const [showOtherItemForm, setShowOtherItemForm] = useState(false);
  const [otherItem, setOtherItem] = useState({ type: '', option: '', quantity: 1, note: '', customDetails: '' });

  return (
    <div className="py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen">
      {/* AI Summary Chat Bubble - Modern AI Overview Style */}
      <div className="flex items-start gap-2 mb-4">
        <div className="flex items-start gap-3 w-full">
          <div className="pt-1">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 w-7 h-7">
              <Sparkles className="w-5 h-5" aria-label="AI Overview" />
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">AI Overview</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-xl px-4 py-3 text-sm shadow-sm border border-blue-200 dark:border-blue-800">
              {client.aiSummary}
            </div>
          </div>
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
        {/* Client Changes Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Client Changes
            </h2>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Add Change
            </button>
          </div>
          {changes.length === 0 ? (
            <div className="text-xs text-muted-foreground italic">No changes recorded for this client.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="font-semibold text-left py-1 px-2">Type</th>
                    <th className="font-semibold text-left py-1 px-2">Item</th>
                    <th className="font-semibold text-left py-1 px-2">Date</th>
                    <th className="font-semibold text-left py-1 px-2">Notes</th>
                    <th className="font-semibold text-left py-1 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((change, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="py-1 px-2 flex items-center gap-1">{typeIcon(change.type)} <span>{change.type}</span></td>
                      <td className="py-1 px-2">
                        {change.items?.length
                          ? change.items.map((i: any) => `${i.type} - ${i.option} (x${i.quantity})`).join(', ')
                          : "—"}
                      </td>
                      <td className="py-1 px-2">{change.date}</td>
                      <td className="py-1 px-2">{change.notes}</td>
                      <td className="py-1 px-2">{statusBadge(change.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {/* Replace modalOpen && ( ... ) with Sheet */}
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent side="right" className="w-full max-w-lg md:max-w-xl lg:max-w-2xl p-0">
            <div className="bg-background p-6 h-full flex flex-col max-h-screen">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Client Change</h3>
                <button className="p-2 rounded hover:bg-muted" onClick={() => setModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {/* --- FORM CONTENT STARTS HERE --- */}
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Type</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={newChange.type}
                    onChange={e => setNewChange({ ...newChange, type: e.target.value })}
                  >
                    {CHANGE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Items</label>
                  <div className="space-y-3">
                    {/* Billed Items */}
                    {client?.billedItems?.map(item => {
                      const selected = newChange.selectedItems.find(i => i.id === item.id && !i.isCustom);
                      return (
                        <div key={item.id} className={`flex flex-col sm:flex-row items-stretch gap-2 rounded-lg border px-3 py-2 bg-card shadow-sm ${selected ? 'border-primary/60' : 'border-border'} transition-all`}>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={e => {
                                if (e.target.checked) {
                                  setNewChange({
                                    ...newChange,
                                    selectedItems: [...newChange.selectedItems, { id: item.id, quantity: 1, isCustom: false }],
                                  });
                                } else {
                                  setNewChange({
                                    ...newChange,
                                    selectedItems: newChange.selectedItems.filter(i => !(i.id === item.id && !i.isCustom)),
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{item.type} <span className="text-muted-foreground">- {item.option}</span></div>
                              <div className="text-xs text-muted-foreground">Available: {item.quantity}</div>
                            </div>
                            {selected && (
                              <>
                                <input
                                  type="number"
                                  min={1}
                                  max={item.quantity}
                                  value={selected.quantity}
                                  onChange={e => setNewChange({
                                    ...newChange,
                                    selectedItems: newChange.selectedItems.map(i =>
                                      i.id === item.id && !i.isCustom ? { ...i, quantity: Number(e.target.value) } : i
                                    ),
                                  })}
                                  className="w-20 border rounded px-2 py-1 text-sm"
                                  placeholder="Qty"
                                />
                                <input
                                  type="text"
                                  className="flex-1 border rounded px-2 py-1 text-sm"
                                  placeholder="Note (optional)"
                                  value={selected.note || ''}
                                  onChange={e => setNewChange({
                                    ...newChange,
                                    selectedItems: newChange.selectedItems.map(i =>
                                      i.id === item.id && !i.isCustom ? { ...i, note: e.target.value } : i
                                    ),
                                  })}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* Custom/Other Items */}
                    {newChange.selectedItems.filter(i => i.isCustom).map((custom, idx) => {
                      if ((custom as SelectedItem).isCustom) {
                        const c = custom as Extract<SelectedItem, { isCustom: true }>;
                        return (
                          <div key={c.id || idx} className="flex flex-col sm:flex-row items-stretch gap-2 rounded-lg border border-primary/40 px-3 py-2 bg-muted/40 shadow-sm">
                            <input
                              type="text"
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              placeholder="Type (e.g. Pantry, Storage)"
                              value={c.type}
                              onChange={e => setNewChange({
                                ...newChange,
                                selectedItems: newChange.selectedItems.map((i, j) =>
                                  i === c ? { ...i, type: e.target.value } : i
                                ),
                              })}
                            />
                            <input
                              type="text"
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              placeholder="Option (e.g. Custom size)"
                              value={c.option}
                              onChange={e => setNewChange({
                                ...newChange,
                                selectedItems: newChange.selectedItems.map((i, j) =>
                                  i === c ? { ...i, option: e.target.value } : i
                                ),
                              })}
                            />
                            <input
                              type="number"
                              min={1}
                              className="w-20 border rounded px-2 py-1 text-sm"
                              placeholder="Qty"
                              value={c.quantity}
                              onChange={e => setNewChange({
                                ...newChange,
                                selectedItems: newChange.selectedItems.map((i, j) =>
                                  i === c ? { ...i, quantity: Number(e.target.value) } : i
                                ),
                              })}
                            />
                            <input
                              type="text"
                              className="flex-1 border rounded px-2 py-1 text-sm"
                              placeholder="Note (optional)"
                              value={c.note || ''}
                              onChange={e => setNewChange({
                                ...newChange,
                                selectedItems: newChange.selectedItems.map((i, j) =>
                                  i === c ? { ...i, note: e.target.value } : i
                                ),
                              })}
                            />
                            <button
                              className="px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 self-center"
                              onClick={() => setNewChange({
                                ...newChange,
                                selectedItems: newChange.selectedItems.filter((_, j) => j !== newChange.selectedItems.findIndex(i => i === c)),
                              })}
                              title="Remove item"
                              type="button"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })}
                    {/* Add Other Item Button & Form */}
                    {showOtherItemForm ? (
                      <div className="flex flex-wrap gap-2 border border-dashed border-primary/40 rounded-lg p-3 bg-muted/30 mt-2">
                        <select
                          className="flex-1 border rounded px-2 py-1 text-sm min-w-[120px]"
                          value={otherItem.type}
                          onChange={e => {
                            setOtherItem({
                              ...otherItem,
                              type: e.target.value,
                              option: '', // reset option when type changes
                            });
                          }}
                        >
                          <option value="">Type</option>
                          {itemTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                        <select
                          className="flex-1 border rounded px-2 py-1 text-sm min-w-[120px]"
                          value={otherItem.option}
                          onChange={e => setOtherItem({ ...otherItem, option: e.target.value })}
                          disabled={!otherItem.type}
                        >
                          <option value="">Option</option>
                          {itemTypes.find(t => t.value === otherItem.type)?.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {/* Show custom input if option is a custom type */}
                        {otherItem.option && otherItem.option.toLowerCase().includes('custom') && (
                          <input
                            className="flex-1 border rounded px-2 py-1 text-sm min-w-[120px]"
                            placeholder="Custom details"
                            value={otherItem.customDetails || ''}
                            onChange={e => setOtherItem({ ...otherItem, customDetails: e.target.value })}
                          />
                        )}
                        <input
                          type="number"
                          min={1}
                          className="w-20 border rounded px-2 py-1 text-sm"
                          placeholder="Qty"
                          value={otherItem.quantity}
                          onChange={e => setOtherItem({ ...otherItem, quantity: Number(e.target.value) })}
                        />
                        <input
                          className="flex-1 border rounded px-2 py-1 text-sm min-w-[120px]"
                          placeholder="Note (optional)"
                          value={otherItem.note}
                          onChange={e => setOtherItem({ ...otherItem, note: e.target.value })}
                        />
                        <div className="flex gap-2 mt-1 sm:mt-0 sm:flex-col sm:justify-center">
                          <button
                            className="px-3 py-1 rounded bg-muted text-foreground border border-border"
                            type="button"
                            onClick={() => { setShowOtherItemForm(false); setOtherItem({ type: '', option: '', quantity: 1, note: '', customDetails: '' }); }}
                          >Cancel</button>
                          <button
                            className="px-3 py-1 rounded bg-primary text-primary-foreground"
                            type="button"
                            onClick={() => {
                              if (!otherItem.type || !otherItem.option || otherItem.quantity < 1) return;
                              setNewChange({
                                ...newChange,
                                selectedItems: [
                                  ...newChange.selectedItems,
                                  { ...otherItem, id: `custom-${Date.now()}`, isCustom: true },
                                ],
                              });
                              setShowOtherItemForm(false);
                              setOtherItem({ type: '', option: '', quantity: 1, note: '', customDetails: '' });
                            }}
                          >Add</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mt-2 px-3 py-1.5 rounded bg-muted text-foreground border border-dashed border-primary/40 hover:bg-primary/10 text-sm font-semibold w-full"
                        type="button"
                        onClick={() => setShowOtherItemForm(true)}
                      >+ Add Other Item</button>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={newChange.date}
                    onChange={e => setNewChange({ ...newChange, date: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Notes</label>
                  <textarea
                    className="w-full border rounded px-2 py-1"
                    rows={3}
                    value={newChange.notes}
                    onChange={e => setNewChange({ ...newChange, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 border-t border-border pt-4">
                <button
                  className="px-3 py-1 rounded bg-muted text-foreground"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded bg-primary text-primary-foreground"
                  onClick={() => {
                    const selectedItemsWithDetails = newChange.selectedItems.map(sel => {
                      if (sel.isCustom) return sel;
                      const item = client?.billedItems?.find(i => i.id === sel.id);
                      return item ? { ...item, quantity: sel.quantity, note: sel.note } : null;
                    }).filter(Boolean);
                    setChanges([
                      ...changes,
                      {
                        ...newChange,
                        id: Date.now().toString(),
                        status: "pending",
                        items: selectedItemsWithDetails,
                      },
                    ]);
                    setModalOpen(false);
                    setNewChange({
                      type: "downsize",
                      date: "",
                      notes: "",
                      selectedItems: client?.billedItems?.length
                        ? [{ id: client.billedItems[0].id, quantity: 1, isCustom: false }]
                        : [],
                    });
                    setShowOtherItemForm(false);
                    setOtherItem({ type: '', option: '', quantity: 1, note: '', customDetails: '' });
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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