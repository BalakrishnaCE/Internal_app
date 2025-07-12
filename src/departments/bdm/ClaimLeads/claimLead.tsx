import React, { useState, useRef, useEffect } from 'react';
import { fetchLeadsData } from '../API/api';
import { Button } from '@/components/ui/button';

const enrichProspects = (prospects: any[]) =>
  prospects.map((p) => ({
    ...p,
    visitLocation: p.visitLocation || 'Office',
    dateTime: p.dateTime || `${p.date || ''} 10:00 AM`,
    mobile: p.mobile || p.phone || '9876543210',
    email: p.email || p.email_id || `${(p.name || p.lead_name || '').split(' ').join('.').toLowerCase()}@example.com`,
    leadType: p.leadType || 'Walk-in',
    name: p.name || p.lead_name || '',
    company: p.company || p.company_name || '',
    id: p.id || p.name || p.lead_name || '',
  }));

const ClaimLeads: React.FC = () => {
  const [activeLeads, setActiveLeads] = useState<any[]>([]);
  const [claimedLeads, setClaimedLeads] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | undefined }>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Swipe state for mobile
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState<{ [id: string]: number }>({});

  // Fetch leads from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const leads = await fetchLeadsData();
        console.log(leads)
        setActiveLeads(enrichProspects(leads));
      } catch (err: any) {
        setError("Failed to fetch leads.");
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!expandedId) return;
    const ref = cardRefs.current[expandedId];
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && !ref.contains(event.target as Node)) {
        setExpandedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedId]);

  const handleAnimationEnd = (lead: any) => {
    handleDelete(lead);
    setDeletingId(null);
  };

  const handleClaim = (lead: any) => {
    if (claimedLeads.some((c) => c.id === lead.id)) return;
    setClaimedLeads((prev) => [...prev, { ...lead, claimedBy: 'You', claimedOn: new Date().toLocaleString() }]);
    setActiveLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setExpandedId(null);
  };

  const handleUnclaim = (lead: any) => {
    setClaimedLeads((leads) => leads.filter((l) => l.id !== lead.id));
    setActiveLeads((leads) => [lead, ...leads]);
    setExpandedId(null);
  };

  const handleDelete = (lead: any) => {
    setActiveLeads((leads) => leads.filter((l) => l.id !== lead.id));
    setExpandedId(null);
  };

  if (loading) {
    return <div className="text-muted-foreground text-center py-8">Loading leads...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center py-8">{error}</div>;
  }

  if (activeLeads.length === 0 && claimedLeads.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No leads found.</div>;
  }

  const feedLeads = [
    ...activeLeads.map((lead) => ({ ...lead, isClaimed: false })),
    ...claimedLeads.map((lead) => ({ ...lead, isClaimed: true })),
  ];

  return (
    <div className="w-full flex flex-col gap-4" aria-live="polite">
      {feedLeads.map((lead) => {
        const expanded = expandedId === lead.id;
        const isDeleting = deletingId === lead.id;

        const handleTouchStart = (e: React.TouchEvent) => {
          if (!isMobile) return;
          setSwipeStartX(e.touches[0].clientX);
        };

        const handleTouchMove = (e: React.TouchEvent) => {
          if (!isMobile || swipeStartX === null) return;
          const deltaX = e.touches[0].clientX - swipeStartX;
          setSwipeDeltaX((prev) => ({ ...prev, [lead.id]: deltaX }));
        };

        const handleTouchEnd = () => {
          if (!isMobile || swipeStartX === null) return;
          if (swipeDeltaX[lead.id] < -80) {
            setDeletingId(lead.id);
            setTimeout(() => handleAnimationEnd(lead), 600);
          } else if (swipeDeltaX[lead.id] > 80) {
            handleClaim(lead);
          }
          setSwipeStartX(null);
          setSwipeDeltaX((prev) => ({ ...prev, [lead.id]: 0 }));
        };

        return (
          <div
            key={lead.id}
            ref={(el) => { if (lead.id) cardRefs.current[lead.id] = el || undefined; }}
            className={`flex flex-col bg-card text-card-foreground rounded-xl shadow p-4 gap-2 border border-border cursor-pointer hover:bg-muted transition-colors min-h-[96px] relative
              ${isDeleting && (isMobile ? 'animate-slide-out-left' : 'animate-thanos-snap')}`}
            onClick={() => setExpandedId(expanded ? null : lead.id)}
            tabIndex={0}
            role="button"
            aria-label={`Expand lead ${lead.name}`}
            aria-expanded={expanded}
            style={isMobile && swipeDeltaX[lead.id] ? { transform: `translateX(${swipeDeltaX[lead.id]}px)` } : {}}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onAnimationEnd={() => isDeleting && handleAnimationEnd(lead)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                {lead.name?.charAt(0) || ''}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{lead.name}</div>
                <div className="text-muted-foreground text-xs truncate">{lead.company}</div>
              </div>
              {!isMobile && !lead.isClaimed && (
                <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">Unclaimed</span>
              )}
              {!lead.isClaimed && !(isMobile && swipeDeltaX[lead.id] < -40) && (
                <Button
                  variant="default"
                  className="rounded-full px-4 h-8 text-xs font-medium ml-2"
                  onClick={(e) => { e.stopPropagation(); handleClaim(lead); }}
                >
                  Claim
                </Button>
              )}
            </div>

            {isMobile && swipeDeltaX[lead.id] < -40 && !isDeleting && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-destructive text-white px-4 py-2 rounded shadow z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingId(lead.id);
                  setTimeout(() => handleAnimationEnd(lead), 600);
                }}
              >
                Delete
              </button>
            )}

            {expanded && (
              <div className="px-2 pt-2 text-sm animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                  <div><span className="font-semibold">Visit Location:</span> {lead.visitLocation}</div>
                  <div><span className="font-semibold">Date & Time:</span> {lead.dateTime}</div>
                  <div><span className="font-semibold">Mobile:</span> {lead.mobile}</div>
                  <div><span className="font-semibold">Email ID:</span> {lead.email}</div>
                  <div><span className="font-semibold">Lead Type:</span> {lead.leadType}</div>
                </div>
                {!isMobile && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="destructive"
                      className="w-32 h-9"
                      onClick={(e) => { e.stopPropagation(); handleDelete(lead); }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClaimLeads;
