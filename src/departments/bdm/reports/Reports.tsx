import React from 'react';
import { Task } from '../tasks/TaskList';
import { CheckCircle, AlertCircle, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data (copy from TasksList)
const todaysTasks: Task[] = [
  {
    id: '1',
    title: "Call Sarah Johnson",
    dueDate: "2024-06-12",
    status: "completed",
    comments: [],
    primaryNumber: "+1 555-123-4567",
    secondaryNumber: "+1 555-987-6543",
    email: "sarah.johnson@acme.com",
    leadId: "L-1001",
    companyName: "Acme Corp",
    planSummary: "Plan: Executive Desk (10), Meeting Room (2), Pantry (1). 12 months, $5,000/mo. All payments on time."
  },
  {
    id: '2',
    title: "Email Michael Chen",
    dueDate: "2024-06-07",
    status: "completed",
    comments: ["Waiting for reply"],
    primaryNumber: "+1 555-222-3333",
    email: "michael.chen@globex.com",
    leadId: "L-1002",
    companyName: "Globex Inc",
    planSummary: "Plan: Manager Cabin (3). 6 months, $2,500/mo. Awaiting agreement signature."
  },
];
const missedTasks: Task[] = [
  {
    id: '3',
    title: "Follow up with David Rodriguez",
    dueDate: "2024-06-05",
    status: "completed",
    comments: ["sds"],
    primaryNumber: "+1 555-444-5555",
    email: "david.rodriguez@initech.com",
    leadId: "L-1003",
    companyName: "Initech",
    planSummary: "Plan: Conference Room (1). Agreement ended last quarter."
  },
];
const rentalEscalations: Task[] = [
  {
    id: 'e1',
    title: "Rental Escalation: Acme Corp",
    dueDate: "2024-07-01",
    status: "pending",
    primaryNumber: "+1 555-123-4567",
    email: "sarah.johnson@acme.com",
    leadId: "L-1001",
    companyName: "Acme Corp",
    planSummary: "Current Rent: $5,000/mo → New Rent: $5,250/mo (5% escalation). Notify client and update agreement."
  },
  {
    id: 'e2',
    title: "Rental Escalation: Wayne Enterprises",
    dueDate: "2024-08-15",
    status: "pending",
    primaryNumber: "+1 555-666-7777",
    email: "aisha.khan@wayne.com",
    leadId: "L-1005",
    companyName: "Wayne Enterprises",
    planSummary: "Current Rent: $6,000/mo → New Rent: $6,300/mo (5% escalation). Prepare escalation notice."
  },
];

// Mock previous period counts
const yesterdaysFollowupCount = 3;
const yesterdaysMissedCount = 2;
const lastMonthEscalationCount = 1;

const getComparison = (current: number, previous: number) => {
  if (current > previous) {
    return (
      <span className="flex items-center text-green-600 text-sm font-medium gap-1">
        <ArrowUpRight className="w-4 h-4" />
        +{current - previous}
      </span>
    );
  } else if (current < previous) {
    return (
      <span className="flex items-center text-red-600 text-sm font-medium gap-1">
        <ArrowDownRight className="w-4 h-4" />
        -{previous - current}
      </span>
    );
  } else {
    return (
      <span className="text-gray-500 text-sm font-medium">No change</span>
    );
  }
};

const Reports: React.FC = () => {
  const [showOverview, setShowOverview] = React.useState(false);
  const aiSummary = `\n**AI Overview**\n\n- All followups for today are completed.\n- One missed followup (David Rodriguez) was completed late.\n- Rental escalations are pending for Acme Corp and Wayne Enterprises.\n\n**Actionable Insights:**\n- Monitor pending rental escalations and notify clients.\n- Await reply from Michael Chen (Globex Inc).\n- No urgent missed followups remain.\n`;

  const navigate = useNavigate ? useNavigate() : (path: string) => window.location.assign(path);

  // Calculate counts
  const todaysFollowupCount = todaysTasks.length;
  const todaysMissedCount = missedTasks.length;
  const currentMonthEscalationCount = rentalEscalations.length;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-end mb-2">
          <button
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg shadow transition font-semibold text-base focus:outline-none hover:bg-[#222] hover:text-white active:bg-[#111]"
            style={{ minWidth: 150 }}
            onClick={() => setShowOverview(true)}
          >
            <Sparkles className="w-5 h-5" />
            AI Overview
          </button>
        </div>
        <h1
          className="text-4xl sm:text-5xl font-extrabold mb-2 text-black drop-shadow tracking-tight"
        >
          Reports Overview
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          A quick summary of today’s followups, missed followups, and rental escalations with daily and monthly comparisons.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Today's Followup Card */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border border-border flex flex-col items-center cursor-pointer hover:bg-muted/30 transition"
          onClick={() => navigate('/bdm/tasks')}
        >
          <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
          <h2 className="text-lg font-bold mb-1 text-center">Today's Followups</h2>
          <div className="text-4xl font-extrabold text-gray-900 mb-1">{todaysFollowupCount}</div>
          <div className="mb-2">{getComparison(todaysFollowupCount, yesterdaysFollowupCount)}</div>
          <div className="text-xs text-gray-500 text-center">Compared to yesterday</div>
        </div>
        {/* Missed Followup Card */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border border-border flex flex-col items-center cursor-pointer hover:bg-muted/30 transition"
          onClick={() => navigate('/bdm/tasks')}
        >
          <AlertCircle className="w-10 h-10 text-yellow-600 mb-2" />
          <h2 className="text-lg font-bold mb-1 text-center">Missed Followups</h2>
          <div className="text-4xl font-extrabold text-gray-900 mb-1">{todaysMissedCount}</div>
          <div className="mb-2">{getComparison(todaysMissedCount, yesterdaysMissedCount)}</div>
          <div className="text-xs text-gray-500 text-center">Compared to yesterday</div>
        </div>
        {/* Rental Escalation Card */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border border-border flex flex-col items-center cursor-pointer hover:bg-muted/30 transition"
          onClick={() => navigate('/bdm/tasks')}
        >
          <TrendingUp className="w-10 h-10 text-purple-700 mb-2" />
          <h2 className="text-lg font-bold mb-1 text-center">Rental Escalations</h2>
          <div className="text-4xl font-extrabold text-gray-900 mb-1">{currentMonthEscalationCount}</div>
          <div className="mb-2">{getComparison(currentMonthEscalationCount, lastMonthEscalationCount)}</div>
          <div className="text-xs text-gray-500 text-center">Compared to last month</div>
        </div>
      </div>
      {showOverview && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 transition-opacity" />
            {/* Modal card */}
            <div className="relative w-full max-w-lg mx-2 rounded-xl bg-white border border-black shadow-xl p-0 overflow-hidden animate-fade-in">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-10 text-black text-3xl font-bold hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                onClick={() => setShowOverview(false)}
                aria-label="Close AI Overview"
                style={{ background: 'none', border: 'none' }}
              >
                ×
              </button>
              {/* Content with scroll */}
              <div className="px-8 pt-8 pb-7">
                <h3 className="text-2xl font-bold text-black mb-4 text-center">AI Overview</h3>
                <div className="text-black text-base max-h-[60vh] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
                  <pre className="whitespace-pre-line font-sans bg-transparent border-0 p-0 m-0 text-black text-base leading-relaxed">{aiSummary}</pre>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.18s ease; }
            .scrollbar-thin { scrollbar-width: thin; }
            .scrollbar-thumb-black::-webkit-scrollbar-thumb { background: #000; border-radius: 6px; }
            .scrollbar-track-gray-200::-webkit-scrollbar-track { background: #e5e7eb; }
            .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Reports; 