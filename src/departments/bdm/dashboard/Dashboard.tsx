import React, { useState, useEffect } from 'react';
import { ClipboardList, Users, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchProspects } from '../prospects/prospectsData';
import { fetchLeadById } from '@/departments/bdm/API/api';
import ClaimLeads from '../ClaimLeads/claimLead';
import { AIAssistant } from '@/components/AIAssistant';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'prospects' | 'claimleads'>('prospects');
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProspectsPage, setCurrentProspectsPage] = useState(1);
  const prospectsPageSize = 10;
  const totalProspectsPages = Math.ceil(prospects.length / prospectsPageSize);
  const paginatedProspects = prospects.slice((currentProspectsPage - 1) * prospectsPageSize, currentProspectsPage * prospectsPageSize);
  const [aiHover, setAiHover] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    fetchProspects().then((data) => {
      setProspects(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (currentProspectsPage > totalProspectsPages) setCurrentProspectsPage(1);
  }, [prospects, totalProspectsPages]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-2 sm:py-12 sm:px-6 min-h-screen relative bg-gray-50 text-foreground">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center pb-2">
        <div className="flex-1" />
        <div className="flex gap-2 ml-auto justify-end mb-4">
          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
            onClick={() => navigate('/bdm/tasks')}
          >
            <ClipboardList className="w-4 h-4" />
            <span>View All Tasks</span>
          </button>
          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
            onClick={() => navigate('/bdm/clients')}
          >
            <Users className="w-4 h-4" />
            <span>View Clients</span>
          </button>

        </div>
      </header>

      {/* Buttons for mobile */}
      <div className="w-full sm:hidden flex flex-col gap-2 mb-6">
        <button
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
          onClick={() => navigate('/bdm/tasks')}
        >
          <ClipboardList className="w-4 h-4" />
          <span>View All Tasks</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-md shadow hover:scale-105 transition-transform font-semibold text-sm"
          onClick={() => navigate('/bdm/clients')}
        >
          <Users className="w-4 h-4" />
          <span>View Clients</span>
        </button>
      </div>

      {/* Tab bar for mobile */}
      <div className="block md:hidden mb-6">
        <div className="flex border-b border-border rounded-lg overflow-hidden bg-white/80 shadow-sm">
          <button
            className={`flex-1 py-2 px-1 text-center font-semibold text-base transition-all duration-200 ${activeTab === 'prospects' ? 'bg-primary/10 border-b-2 border-primary text-primary shadow' : 'text-muted-foreground hover:bg-muted/40'}`}
            onClick={() => setActiveTab('prospects')}
          >
            Visited Prospects
          </button>
          <button
            className={`flex-1 py-2 px-1 text-center font-semibold text-base transition-all duration-200 ${activeTab === 'claimleads' ? 'bg-primary/10 border-b-2 border-primary text-primary shadow' : 'text-muted-foreground hover:bg-muted/40'}`}
            onClick={() => setActiveTab('claimleads')}
          >
            Claim Leads
          </button>
        </div>
      </div>

      {/* Two-column grid for desktop, tabbed for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Visited Prospects Section */}
        <section className="md:col-span-1 md:px-6 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-5 text-center tracking-normal">Visited Prospects</h2>
          <div className={`overflow-y-auto space-y-4 pr-1 sm:pr-2 ${activeTab !== 'prospects' && 'hidden md:block'}`}> 
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10 gap-2">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto animate-spin text-primary/30"><circle cx="12" cy="12" r="10" strokeWidth="4" /></svg>
                <span className="font-medium">Loading prospects...</span>
              </div>
            ) : prospects.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10 gap-2">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-primary/20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
                <span className="font-medium">No prospects found.</span>
              </div>
            ) : (
              paginatedProspects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center bg-card text-card-foreground rounded-xl shadow-sm p-4 gap-4 border border-border cursor-pointer hover:bg-primary/5 hover:shadow-md focus:ring-2 focus:ring-primary/20 transition-all duration-150 text-base min-h-[96px] outline-none"
                  onClick={() => navigate(`/bdm/prospects/${p.id}`)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open prospect ${p.name}`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg border border-primary/10">
                    {p.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{p.name}</div>
                    <div className="text-muted-foreground text-xs truncate">{p.company}</div>
                  </div>
                  {/* Spacer to match buttons in Claim Leads */}
                  <div style={{ width: 220 }} />
                </div>
              ))
            )}
          </div>
          {/* Pagination Controls for Visited Prospects */}
          {totalProspectsPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-7">
              <button
                className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/20"
                onClick={() => setCurrentProspectsPage(currentProspectsPage - 1)}
                disabled={currentProspectsPage === 1}
              >
                Previous
              </button>
              {(() => {
                let start = 1;
                if (totalProspectsPages > 5) {
                  if (currentProspectsPage <= totalProspectsPages - 4) {
                    start = Math.max(1, currentProspectsPage);
                  } else {
                    start = totalProspectsPages - 4;
                  }
                }
                return Array.from({ length: Math.min(5, totalProspectsPages) }, (_, i) => {
                  const page = start + i;
                  if (page > totalProspectsPages) return null;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded text-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/20 ${currentProspectsPage === page ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-primary/10'}`}
                      onClick={() => setCurrentProspectsPage(page)}
                    >
                      {page}
                    </button>
                  );
                });
              })()}
              <button
                className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/20"
                onClick={() => setCurrentProspectsPage(currentProspectsPage + 1)}
                disabled={currentProspectsPage === totalProspectsPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
        {/* Claim Leads Section */}
        <section className="md:col-span-1 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-5 text-center hidden md:block tracking-normal">Claim Leads</h2>
          <div className={`${activeTab !== 'claimleads' && 'hidden md:block'}`}> 
            {/* TODO: Add pagination for ClaimLeads if data is available as an array */}
            <ClaimLeads />
          </div>
        </section>
      </div>

      {/* Remove all custom floating button/modal logic for AI Assistant */}
      {/* Only render the AIAssistant floating button/modal here */}
      <AIAssistant context="bdm-dashboard" placement="floating" />
    </div>
  );
};

export default Dashboard;
