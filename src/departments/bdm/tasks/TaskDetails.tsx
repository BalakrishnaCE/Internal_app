import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from './TaskList';
import { CheckCircle, Clock, AlertCircle, Calendar, Phone as PhoneIcon, Mail as MailIcon, IdCard as IdCardIcon } from 'lucide-react';

// Mock data (copy from TasksList)
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

const allTasks = [
  ...initialTodaysTasks,
  ...initialMissedTasks,
  ...initialRentalEscalations,
];

const statusIcon = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'missed':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
};

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = allTasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <button className="mb-4 text-primary underline" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="flex items-center gap-3 mb-4">
        {statusIcon(task.status)}
        <h2 className="text-2xl font-bold">{task.title}</h2>
      </div>
      <div className="mb-2 text-muted-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Due: {task.dueDate}
      </div>
      {task.companyName && <div className="mb-2">Company: <span className="font-medium">{task.companyName}</span></div>}
      {task.primaryNumber && <div className="mb-2 flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {task.primaryNumber}</div>}
      {task.secondaryNumber && <div className="mb-2 flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {task.secondaryNumber}</div>}
      {task.email && <div className="mb-2 flex items-center gap-2"><MailIcon className="w-4 h-4" /> {task.email}</div>}
      {task.leadId && <div className="mb-2 flex items-center gap-2"><IdCardIcon className="w-4 h-4" /> {task.leadId}</div>}
      {task.planSummary && <div className="mb-4 p-3 bg-blue-50 rounded text-blue-900 text-sm">{task.planSummary}</div>}
      {task.comments && task.comments.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold mb-1">Comments:</div>
          <ul className="list-disc pl-5 text-sm">
            {task.comments.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetails; 