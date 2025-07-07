import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIAssistant } from '@/components/AIAssistant';

// Example clients data (with detailed billed items and AI summary)
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
  },
];

const statusStyles = {
  'Active': 'bg-success/10 text-success border-success/20',
  'Pending': 'bg-warning/10 text-warning border-warning/20',
  'Inactive': 'bg-muted text-muted-foreground border-border',
};

const statusOptions = ['All', 'Active', 'Pending', 'Inactive'];

const ExistingClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto py-6 px-2 sm:py-10 sm:px-4 bg-background text-foreground min-h-screen relative">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">Clients</h1>
          <p className="text-muted-foreground text-base sm:text-lg">List of all clients managed by BDM</p>
        </div>
      </header>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-stretch sm:items-end">
        <div className="flex gap-2">
          {statusOptions.map(opt => (
            <button
              key={opt}
              className={`px-3 py-1 rounded-full border text-xs font-semibold transition-colors ${statusFilter === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-primary/10'}`}
              onClick={() => setStatusFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="border border-border rounded px-3 py-2 text-sm w-full sm:w-64 bg-background"
          placeholder="Search by name or contact..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <section className="mb-8">
        <div className="overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
          {filteredClients.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row items-start sm:items-center bg-card text-card-foreground rounded-xl shadow p-3 sm:p-4 gap-2 sm:gap-4 border border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate(`/bdm/clients/${c.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`Open client ${c.name}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-lg sm:text-xl font-bold text-primary">
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate">{c.name}</div>
                  <div className="text-muted-foreground text-xs sm:text-sm truncate">Contact: {c.contact}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                    <span className="font-semibold">Lead ID:</span> {c.leadId}
                    <span className="font-semibold ml-2">Agreement:</span> {c.agreement}
                  </div>
                  {/* Billed Items Summary */}
                  <div className="mt-1 flex flex-col gap-1">
                    <span className="font-semibold text-xs">Billed Items:</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {c.billedItems.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.type}{item.option ? ` (${item.option})` : ''}{item.note ? ` - ${item.note}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* AI Summary Chat Bubble */}
                  <div className="flex items-start gap-2 mt-2">
                    <div className="bg-primary/10 text-primary rounded-xl px-3 py-2 text-xs shadow-sm flex-1">
                      {c.aiSummary}
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold border ${statusStyles[c.status as keyof typeof statusStyles]}`}
              >
                {c.status}
              </span>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No clients found.</div>
          )}
        </div>
      </section>
      <AIAssistant context="bdm-clients-list" />
    </div>
  );
};

export default ExistingClientsList;

