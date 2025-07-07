import React, { useState } from 'react';
import { TaskList, Task } from './TaskList';
import { useNavigate } from 'react-router-dom';
import { AIAssistant } from '../../../components/AIAssistant';

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
];

const TasksList: React.FC = () => {
  const [todaysTasks, setTodaysTasks] = useState(initialTodaysTasks);
  const [missedTasks, setMissedTasks] = useState(initialMissedTasks);
  const [rentalEscalations, setRentalEscalations] = useState(initialRentalEscalations);
  const navigate = useNavigate ? useNavigate() : (path: string) => window.location.assign(path);

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
        <TaskList
          title="Today's Followups"
          tasks={todaysTasks}
          onComplete={handleComplete}
          onComment={handleComment}
          onChangeDate={handleChangeDate}
        />
        <div className="my-4 sm:my-6" />
        <TaskList
          title="Missed Followups"
          tasks={missedTasks}
          onComplete={handleComplete}
          onComment={handleComment}
          onChangeDate={handleChangeDate}
        />
        <div className="my-4 sm:my-6" />
        <TaskList
          title="Rental Escalation Tasks"
          tasks={rentalEscalations}
          onComplete={handleComplete}
          onComment={handleComment}
          onChangeDate={handleChangeDate}
        />
      </section>
      <AIAssistant
        context="bdm-tasks"
        summary={`**BDM Task Summary**\n\n- Call Sarah Johnson: Completed\n- Email Michael Chen: Completed, awaiting reply\n- Follow up with David Rodriguez: Completed, with status noted in SDS comment\n\n**Current Status:**\nAll listed tasks are marked as completed. One task (email to Michael Chen) is pending a reply, which means further action may be required once a response is received.\n\n---\n\n**Actionable Priorities for Today**\n1. Review for New or Urgent Tasks: Check your inbox and messages for any new client communications, urgent requests, or updates—especially a reply from Michael Chen. Scan your calendar for scheduled meetings or calls that require preparation.\n2. Align with Strategic Goals: Identify if there are any high-impact business development opportunities or follow-ups that align with your current objectives. Use a prioritization method to categorize any new or outstanding tasks by urgency and importance.\n3. Prepare for Next Steps: For the pending reply from Michael Chen, set a reminder to follow up if no response is received within a reasonable timeframe. Document the outcomes of completed tasks and update your CRM or task management system.\n4. Proactive Outreach or Pipeline Review: If no urgent tasks are pending, review your pipeline for prospects or clients who may need attention or could benefit from a check-in. Consider scheduling outreach or planning for upcoming business development initiatives.\n\n---\n\n**What to Prioritize Today**\n- Monitor for Michael Chen's reply and be ready to respond promptly when it arrives.\n- Check for new tasks or urgent communications that may have come in since your last review.\n- Plan your next set of high-impact activities—such as identifying new leads, preparing proposals, or scheduling meetings—to keep momentum in your business development pipeline.\n\n**Tip:**\nKeep your objectives specific and actionable (e.g., "Schedule two new client meetings by end of day" rather than a vague "do follow-ups"). Use your task management tools to track progress and adjust priorities as new information comes in.`}
      />
    </div>
  );
};

export default TasksList;

