import React, { useState } from 'react';
import { TaskList, Task } from './TaskList';
import { useNavigate } from 'react-router-dom';

// Example tasks data
const initialTodaysTasks: Task[] = [
  { id: '1', title: "Call Sarah Johnson", dueDate: "2024-06-12", status: "completed", comments: [] },
  { id: '2', title: "Email Michael Chen", dueDate: "2024-06-07", status: "completed", comments: ["Waiting for reply"] },
];
const initialMissedTasks: Task[] = [
  { id: '3', title: "Follow up with David Rodriguez", dueDate: "2024-06-05", status: "completed", comments: ["sds"] },
];

const TasksList: React.FC = () => {
  const [todaysTasks, setTodaysTasks] = useState(initialTodaysTasks);
  const [missedTasks, setMissedTasks] = useState(initialMissedTasks);
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
      <button
        className="w-full sm:w-auto mb-4 sm:mb-6 px-4 py-3 bg-primary text-primary-foreground rounded shadow hover:scale-105 transition-transform font-semibold min-h-[44px]"
        onClick={() => navigate('/bdm/dashboard')}
      >
        ← Back to Dashboard
      </button>
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
      </section>
    </div>
  );
};

export default TasksList;

