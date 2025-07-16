import React, { useState } from 'react';
import { TaskList, Task } from './TaskList';
import { useNavigate, useLocation } from 'react-router-dom';
import { AIAssistant } from '../../../components/AIAssistant';
import { Lightbulb } from 'lucide-react';

// Example tasks data
const initialTodaysTasks: Task[] = [
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
  // Add 10 more sample items
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 3}`,
    title: `Follow up with Client ${i + 3}`,
    dueDate: `2024-06-${13 + i}`,
    status: (i % 2 === 0 ? 'pending' : 'completed') as 'pending' | 'completed' | 'missed',
    comments: [],
    primaryNumber: `+1 555-000-00${i + 3}`,
    email: `client${i + 3}@example.com`,
    leadId: `L-10${i + 3}`,
    companyName: `Company ${i + 3}`,
    planSummary: `Plan: Desk (${i + 1}). ${6 + i} months, $${2000 + i * 100}/mo.`
  })),
];
const initialMissedTasks: Task[] = [
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
  // Add 11 more sample items
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `m${i + 4}`,
    title: `Missed Followup Client ${i + 4}`,
    dueDate: `2024-06-${6 + i}`,
    status: (i % 2 === 0 ? 'missed' : 'completed') as 'pending' | 'completed' | 'missed',
    comments: [],
    primaryNumber: `+1 555-111-11${i + 4}`,
    email: `missed${i + 4}@example.com`,
    leadId: `L-20${i + 4}`,
    companyName: `Missed Co ${i + 4}`,
    planSummary: `Plan: Room (${i + 2}). ${3 + i} months, $${1500 + i * 50}/mo.`
  })),
];

// Rental Escalation Tasks Example
const initialRentalEscalations: Task[] = [
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
  // Add 10 more sample items
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `e${i + 3}`,
    title: `Rental Escalation: Client ${i + 3}`,
    dueDate: `2024-07-${2 + i}`,
    status: 'pending' as 'pending' | 'completed' | 'missed',
    primaryNumber: `+1 555-222-22${i + 3}`,
    email: `escalation${i + 3}@example.com`,
    leadId: `L-30${i + 3}`,
    companyName: `Escalation Co ${i + 3}`,
    planSummary: `Current Rent: $${4000 + i * 100}/mo → New Rent: $${4200 + i * 100}/mo (5% escalation).`
  })),
];

const prospectNameToId: Record<string, string> = {
  'Sarah Johnson': 'p1',
  'Michael Chen': 'p2',
  'David Rodriguez': 'p3',
  'Priya Patel': 'p4',
  'Aisha Khan': 'p5',
};

const TasksList: React.FC = () => {
  const [todaysTasks, setTodaysTasks] = useState(initialTodaysTasks);
  const [missedTasks, setMissedTasks] = useState(initialMissedTasks);
  const [rentalEscalations, setRentalEscalations] = useState(initialRentalEscalations);
  const navigate = useNavigate ? useNavigate() : (path: string) => window.location.assign(path);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = (params.get('tab') as 'today' | 'missed' | 'escalation') || 'today';
  const [activeTab, setActiveTab] = useState<'today' | 'missed' | 'escalation'>(initialTab);

  const handleComplete = (id: string) => {
    setTodaysTasks(tasks => tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    setMissedTasks(tasks => tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };
  const handleComment = (id: string, comment: string) => {
    setTodaysTasks(tasks => tasks.map(t => t.id === id ? { ...t, comments: [...(t.comments || []), comment] } : t));
    setMissedTasks(tasks => tasks.map(t => t.id === id ? { ...t, comments: [...(t.comments || []), comment] } : t));
  };
  const handleChangeDate = (id: string, newDate: string) => {
    setTodaysTasks(tasks => tasks.map(t => t.id === id ? { ...t, dueDate: newDate } : t));
    setMissedTasks(tasks => tasks.map(t => t.id === id ? { ...t, dueDate: newDate } : t));
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 sm:py-10 sm:px-4 bg-background text-foreground min-h-screen">
      <section className="mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Tab content */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'today' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 bg-gray-100 hover:text-black'}`}
                onClick={() => setActiveTab('today')}
              >
                Today's Followups
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'missed' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 bg-gray-100 hover:text-black'}`}
                onClick={() => setActiveTab('missed')}
              >
                Missed Followups
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'escalation' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 bg-gray-100 hover:text-black'}`}
                onClick={() => setActiveTab('escalation')}
              >
                Rental Escalation Tasks
              </button>
            </div>
            {activeTab === 'today' && (
              <TaskList
                tasks={todaysTasks}
                onComplete={handleComplete}
                onComment={handleComment}
                onChangeDate={handleChangeDate}
                onTaskClick={task => {
                  const nameMatch = task.title.match(/(Sarah Johnson|Michael Chen|David Rodriguez|Priya Patel|Aisha Khan)/);
                  if (nameMatch && prospectNameToId[nameMatch[1]]) {
                    navigate(`/bdm/prospects/${prospectNameToId[nameMatch[1]]}`);
                  } else {
                    navigate(`/bdm/tasks/${task.id}`);
                  }
                }}
                hidePlanSummary={true}
              />
            )}
            {activeTab === 'missed' && (
              <TaskList
                tasks={missedTasks}
                onComplete={handleComplete}
                onComment={handleComment}
                onChangeDate={handleChangeDate}
                onTaskClick={task => {
                  const nameMatch = task.title.match(/(Sarah Johnson|Michael Chen|David Rodriguez|Priya Patel|Aisha Khan)/);
                  if (nameMatch && prospectNameToId[nameMatch[1]]) {
                    navigate(`/bdm/prospects/${prospectNameToId[nameMatch[1]]}`);
                  } else {
                    navigate(`/bdm/tasks/${task.id}`);
                  }
                }}
                hidePlanSummary={true}
              />
            )}
            {activeTab === 'escalation' && (
              <TaskList
                tasks={rentalEscalations}
                onComplete={handleComplete}
                onComment={handleComment}
                onChangeDate={handleChangeDate}
                hidePlanSummary={true}
              />
            )}
          </div>
          {/* Right: AI Summary Box */}
          <aside className="w-full md:w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-md p-6 md:sticky md:top-8">
            <h2 className="text-xl font-bold text-black mb-1 flex items-center gap-2 border-b-2 border-blue-500 pb-1">
              <Lightbulb className="w-6 h-6 text-blue-500" aria-hidden="true" />
              AI Summary
            </h2>
            <p className="text-sm text-muted-foreground mb-3">Get a quick, actionable overview of your current business development tasks and priorities.</p>
            <div className="">
              <div className="font-semibold mb-2 text-base">Today's Insights</div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>3 follow-ups completed, 1 missed, 2 escalations pending</li>
                <li>Top priority: Follow up with Michael Chen (awaiting reply)</li>
                <li>Rental escalation for Acme Corp due in 2 days</li>
                <li>No urgent overdue tasks</li>
              </ul>
              <div className="mt-3 text-xs text-gray-500 italic">Tip: Review your pipeline for new opportunities and check for client responses by end of day.</div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TasksList;

