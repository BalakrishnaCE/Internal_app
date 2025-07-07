import React from 'react';
import { ClipboardList } from 'lucide-react';
import { AIAssistant } from '@/components/AIAssistant';
import { useNavigate } from 'react-router-dom';

// Example prospects data
const prospects = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    company: 'Acme Corp',
    date: '2024-06-01',
    status: 'Completed',
    initials: 'SJ',
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    company: 'Globex Inc',
    date: '2024-06-02',
    status: 'In Progress',
    initials: 'MC',
  },
  {
    id: 'p3',
    name: 'David Rodriguez',
    company: 'Initech',
    date: '2024-06-03',
    status: 'To Do',
    initials: 'DR',
  },
  {
    id: 'p4',
    name: 'Priya Patel',
    company: 'Umbrella Corp',
    date: '2024-06-04',
    status: 'Completed',
    initials: 'PP',
  },
  {
    id: 'p5',
    name: 'Aisha Khan',
    company: 'Wayne Enterprises',
    date: '2024-06-05',
    status: 'In Progress',
    initials: 'AK',
  },
  // Add more as needed
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 sm:py-10 sm:px-4 bg-background text-foreground min-h-screen relative">
      {/* Header */}
      <header className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">BDM Dashboard</h1>
          <p className="text-muted-foreground text-base sm:text-lg">Overview of your tasks, client journeys, and visits</p>
        </div>
        <div className="flex gap-2">
          {/* Hide the button in the header on mobile */}
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
      {/* Show the buttons below the header on mobile */}
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

      {/* Visited Prospects Section */}
      <section className="mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">Visited Prospects</h2>
        <div className="overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
          {prospects.map((p) => (
            <div
              key={p.id}
              className="flex items-center bg-card text-card-foreground rounded-xl shadow p-3 sm:p-4 gap-3 sm:gap-4 border border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate(`/bdm/prospects/${p.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`Open prospect ${p.name}`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-lg sm:text-xl font-bold text-primary">
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base sm:text-lg truncate">{p.name}</div>
                <div className="text-muted-foreground text-xs sm:text-sm truncate">{p.company}</div>
                <div className="text-muted-foreground text-xs">Visited: {p.date}</div>
              </div>
              <span
                className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold border
                  ${p.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    p.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'}`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Floating Button & Modal */}
      <AIAssistant context="bdm-dashboard" />
    </div>
  );
};

export default Dashboard;
