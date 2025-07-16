import React, { useState, useRef, useEffect } from 'react';
import { fetchLeadsData, claimLeadAPI, removeLeadAPI } from '../API/api';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/animate-ui/radix/collapsible";
import { Bot } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const enrichProspects = (prospects: any[]) =>
  prospects.map((p) => ({
    ...p,
    visitLocation: p.visitLocation || p.visit_location1 || 'Office',
    // Prefer explicit dateTime, then date_and_time_of_visit, then fallback
    dateTime: p.dateTime || p.date_and_time_of_visit || `${p.date || ''} 10:00 AM`,
    mobile: p.mobile || p.phone || p.mobile_number || '9876543210',
    email: p.email || p.email_id || `${(p.name || '').split(' ').join('.').toLowerCase()}@example.com`,
    leadType: p.leadType || p.lead_type || 'Walk-in',
    id: p.id || p.lead_id,
    name: p.name || p.name1 || 'NA',
    company: p.company,
  }));

const ClaimLeads: React.FC = () => {
  const [activeLeads, setActiveLeads] = useState<any[]>([]);
  const [claimedLeads, setClaimedLeads] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | undefined }>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Add claimingId state for claim animation
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Add filter state
  const [showThisMonthOnly, setShowThisMonthOnly] = useState(false);
  // Add this state to trigger animation
  const [filtering, setFiltering] = useState(false);
  // Store logged-in user email
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Swipe state for mobile
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState<{ [id: string]: number }>({});

  // Fetch leads and login on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Login and get user email
        const login_response = await fetch('http://10.80.4.51/api/method/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            usr: 'bala@noveloffice.com',
            pwd: 'sreeja.s@2002',
          })
        });
        const login_data = await login_response.json();
        // Try to get user email from login response
        if (login_data && login_data.full_name) {
          setUserEmail('bala@noveloffice.com'); // fallback to login user
        } else if (login_data && login_data.message && login_data.message.user) {
          setUserEmail(login_data.message.user);
        } else {
          setUserEmail('bala@noveloffice.com'); // fallback
        }
        // Fetch leads
        const leads = await fetchLeadsData();
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

  // Reset to page 1 if feedLeads changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeLeads, claimedLeads]);

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

  // handleClaimAnimationEnd: remove from UI first, then call API and show toast
  const handleClaimAnimationEnd = async (lead: any) => {
    // Remove from UI immediately
    setActiveLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setClaimedLeads((prev) => [...prev, { ...lead, claimedOn: new Date().toLocaleString(), claimedBy: userEmail || 'bala@noveloffice.com' }]);
    setClaimingId(null);
    setExpandedId(null);

    // Then perform the async operation and show toast
    try {
      const claimed_by = userEmail || 'bala@noveloffice.com';
      const response = await claimLeadAPI({
        leadId: lead.id,
        visit_location1: lead.visitLocation || lead.visit_location1 || '',
        pre_sales_assigned: lead.pre_sales_assigned || lead.preSalesAssigned || '',
        officeType: lead.officeType || lead.leadType || '',
        date_and_time_of_visit: lead.dateTime || lead.date_and_time_of_visit || '',
        claimed_by,
      });
      toast(response?.message || 'Lead claimed successfully!');
      if (response?.debug) {
        console.log('Backend debug info:', response.debug);
      }
      // Optionally refresh from backend
      const leads = await fetchLeadsData();
      setActiveLeads(enrichProspects(leads));
    } catch (err: any) {
      toast(err.message || 'Failed to claim lead.');
      if (err?.debug) {
        console.log('Backend debug info:', err.debug);
      }
      // Optionally: re-add the card to activeLeads if you want to handle errors visually
    }
  };

  // handleAnimationEnd: remove from UI first, then call API and show toast for delete
  const handleAnimationEnd = (lead: any) => {
    // Remove from UI immediately
    setActiveLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setDeletingId(null);
    setExpandedId(null);

    // Then perform the async operation and show toast
    handleDeleteAfterAnimation(lead);
  };

  // New: handleDeleteAfterAnimation to show toast after UI update
  const handleDeleteAfterAnimation = async (lead: any) => {
    try {
      const response = await removeLeadAPI(lead.id, '1');
      const msg = typeof response?.message === 'string' && response.message.trim() ? response.message : 'Lead marked as removed.';
      toast(msg);
      // Optionally refresh from backend
      const leads = await fetchLeadsData();
      setActiveLeads(enrichProspects(leads));
    } catch (err: any) {
      const errMsg = (typeof err?.message === 'string' && err.message.trim()) ? err.message : 'Failed to remove lead.';
      toast(errMsg);
      if (err && typeof err === 'object') {
        console.error('Remove lead error:', err);
      }
      // Optionally: re-add the card to activeLeads if you want to handle errors visually
    }
  };

  // const handleUnclaim = (lead: any) => {
  //   setClaimedLeads((leads) => leads.filter((l) => l.id !== lead.id));
  //   setActiveLeads((leads) => [lead, ...leads]);
  //   setExpandedId(null);
  // };

  // Helper to check if a lead is within this month
  const isThisMonth = (lead: any) => {
    let dateStr = lead.date || lead.dateTime || lead.date_and_time_of_visit;
    if (!dateStr) return false;
    let dateObj: Date | null = null;
    // Try ISO or YYYY-MM-DD
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      // If format is 'YYYY-MM-DD HH:mm:ss', extract date part
      const match = dateStr.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        dateObj = new Date(match[1]);
      } else {
        dateObj = new Date(dateStr);
      }
    } else if (/\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
      // e.g., 31/12/2024
      const [d, m, y] = dateStr.match(/\d+/g) || [];
      if (d && m && y) dateObj = new Date(`${y}-${m}-${d}`);
    } else {
      // Try to parse as Date
      dateObj = new Date(dateStr);
    }
    if (!dateObj || isNaN(dateObj.getTime())) return false;
    const now = new Date();
    return dateObj.getFullYear() === now.getFullYear() && dateObj.getMonth() === now.getMonth();
  };

  // Filter activeLeads if filter is enabled
  const filteredActiveLeads = showThisMonthOnly
    ? activeLeads.filter(isThisMonth)
    : activeLeads;

  const feedLeads = [
    ...filteredActiveLeads.map((lead) => ({ ...lead, isClaimed: false })),
    ...claimedLeads.map((lead) => ({ ...lead, isClaimed: true })),
  ];

  // Pagination logic
  const totalPages = Math.ceil(feedLeads.length / itemsPerPage);
  const paginatedLeads = feedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Update filtering state when toggling the filter
  const handleToggleThisMonth = () => {
    if (!showThisMonthOnly) {
      // Animate when turning ON the filter - collapse current list, then show filtered
      setFiltering(true);
      setShowThisMonthOnly(true);
      setTimeout(() => setFiltering(false), 400);
    } else {
      // Instantly show all when turning OFF
      setShowThisMonthOnly(false);
      setFiltering(false);
    }
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

  return (
    <>
      <Toaster position="top-center" />
      {/* Add fade-in/fade-out CSS */}
      <style>{`
        .fade-out {
          opacity: 0;
          transition: opacity 0.4s;
        }
        .fade-in {
          opacity: 1;
          transition: opacity 0.4s;
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-50">
      <button className="w-12 aspect-square rounded-full bg-black flex items-center justify-center shadow p-0 leading-none">
          <Bot className="w-6 h-6 text-white m-0 p-0 leading-none -translate-y-[0.5px] translate-x-[1px]" />
        </button>
      </div>
      <div className="w-full flex flex-col gap-4" aria-live="polite">
        {/* Heading and Pill Filter Button */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Claim Leads
            <button
              className={`ml-2 px-5 py-1.5 rounded-full text-sm font-semibold border transition-colors focus:outline-none ${showThisMonthOnly ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-primary/10'}`}
              onClick={handleToggleThisMonth}
              aria-pressed={showThisMonthOnly}
              type="button"
            >
              This Month
            </button>
          </h2>
        </div>
        {/* Animated list container */}
        <div
          className={`transition-all duration-400 ease-in-out overflow-hidden ${filtering ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`}
          style={{ maxHeight: filtering ? 0 : 2000 }}
        >
          {paginatedLeads.map((lead) => {
            const expanded = expandedId === lead.id;
            const isDeleting = deletingId === lead.id;
            const isClaiming = claimingId === lead.id;

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
                setClaimingId(lead.id);
                setTimeout(() => handleClaimAnimationEnd(lead), 600);
              }
              setSwipeStartX(null);
              setSwipeDeltaX((prev) => ({ ...prev, [lead.id]: 0 }));
            };

            return (
              <Collapsible key={lead.id}>
                <CollapsibleTrigger asChild>
                  <div
                    key={lead.id}
                    ref={(el) => { if (lead.id) cardRefs.current[lead.id] = el || undefined; }}
                    className={`flex flex-col bg-card text-card-foreground rounded-xl shadow p-4 gap-2 border border-border cursor-pointer transition-colors min-h-[96px] relative
                      ${expanded ? 'min-h-[200px] md:min-h-[220px] p-6 shadow-lg' : ''}
                      ${isDeleting ? 'fade-out' : ''}
                      ${isClaiming ? 'fade-out' : ''}
                      ${isMobile && isDeleting ? 'animate-slide-out-left' : ''}`}
                    onClick={() => setExpandedId(expanded ? null : lead.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Expand lead ${lead.name}`}
                    aria-expanded={expanded}
                    style={isMobile && swipeDeltaX[lead.id] ? { transform: `translateX(${swipeDeltaX[lead.id]}px)` } : {}}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onAnimationEnd={() => {
                      if (isDeleting) handleAnimationEnd(lead);
                      if (isClaiming) handleClaimAnimationEnd(lead);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                        {(lead.name ? lead.name.charAt(0) : 'N')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg sm:text-xl truncate">{lead.name || 'NA'}</div>
                        <div className="text-muted-foreground text-sm truncate">{lead.dateTime}</div>
                      </div>
                      {!isMobile && (
                        <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">{lead.id}</span>
                      )}
                      {!lead.isClaimed && !(isMobile && swipeDeltaX[lead.id] < -40) && (
                        <Button
                          variant="default"
                          className="rounded-full px-4 h-8 text-xs font-medium ml-2"
                          onClick={(e) => { e.stopPropagation(); setClaimingId(lead.id); }}
                          disabled={isClaiming || isDeleting}
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                    {/* Details and delete button only visible when expanded, inside the card */}
                    <CollapsibleContent>
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
                              onClick={(e) => { e.stopPropagation(); handleDeleteAfterAnimation(lead); }}
                              disabled={isDeleting || isClaiming}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
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
                  </div>
                </CollapsibleTrigger>
              </Collapsible>
            );
          })}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 select-none">
            <button
              className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 focus:outline-none active:bg-gray-200"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {(() => {
              let start = 1;
              if (totalPages > 5) {
                if (currentPage <= totalPages - 4) {
                  start = Math.max(1, currentPage);
                } else {
                  start = totalPages - 4;
                }
              }
              return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = start + i;
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded text-sm cursor-pointer transition-colors focus:outline-none active:bg-gray-200 ${currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            <button
              className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 focus:outline-none active:bg-gray-200"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ClaimLeads;
