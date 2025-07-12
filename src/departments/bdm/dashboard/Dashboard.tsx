import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';
import { prospects } from '../prospects/prospectsData';
import { fetchLeadsData } from '@/departments/bdm/API/api';
import ClaimLeads from '../ClaimLeads/claimLead';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'prospects' | 'claimleads'>('prospects');
  // const leads = fetchLeadsData();
  // console.log(leads);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-2 sm:py-10 sm:px-4 bg-background text-foreground min-h-screen relative">
      {/* Header */}
      <header className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">BDM Dashboard</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Overview of your tasks, client journeys, and visits
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
            onClick={() => navigate('/bdm/tasks')}
          >
            <ClipboardList className="w-4 h-4" />
            <span>View All Tasks</span>
          </button>
          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
            onClick={() => navigate('/bdm/clients')}
          >
            <span>View Clients</span>
          </button>
        </div>
      </header>

      {/* Buttons for mobile */}
      <div className="w-full sm:hidden flex flex-col gap-2 mb-4">
        <button
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
          onClick={() => navigate('/bdm/tasks')}
        >
          <ClipboardList className="w-4 h-4" />
          <span>View All Tasks</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
          onClick={() => navigate('/bdm/clients')}
        >
          <span>View Clients</span>
        </button>
      </div>

      {/* Tab bar for mobile */}
      <div className="block md:hidden mb-4">
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-2 px-1 text-center font-semibold text-base transition-colors ${activeTab === 'prospects' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('prospects')}
          >
            Visited Prospects
          </button>
          <button
            className={`flex-1 py-2 px-1 text-center font-semibold text-base transition-colors ${activeTab === 'claimleads' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('claimleads')}
          >
            Claim Leads
          </button>
        </div>
      </div>

      {/* Two-column grid for desktop, tabbed for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visited Prospects Section */}
        <section className="md:col-span-1 md:border-r md:border-gray-200 md:px-4">
          <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4">Visited Prospects</h2>
          <div className={`overflow-y-auto space-y-4 pr-1 sm:pr-2 ${activeTab !== 'prospects' && 'hidden md:block'}`}>
            {prospects.map((p) => (
              <div
                key={p.id}
                className="flex items-center bg-card text-card-foreground rounded-xl shadow p-4 gap-4 border border-border cursor-pointer hover:bg-muted transition-colors text-base min-h-[96px]"
                onClick={() => navigate(`/bdm/prospects/${p.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`Open prospect ${p.name}`}
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-muted-foreground text-xs truncate">{p.company}</div>
                </div>
                {/* Spacer to match buttons in Claim Leads */}
                <div style={{ width: 220 }} />
              </div>
            ))}
          </div>
        </section>
        {/* Claim Leads Section */}
        <section className="md:col-span-1">
          <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4 hidden md:block">Claim Leads</h2>
          <div className={`${activeTab !== 'claimleads' && 'hidden md:block'}`}>
            <ClaimLeads />
          </div>
        </section>
      </div>
      {/* AI Assistant Floating Button */}
      <AIAssistant context="bdm-dashboard" />
    </div>
  );
};

export default Dashboard;
