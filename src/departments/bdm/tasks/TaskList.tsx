import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar, MessageCircle, ClipboardList, MoreVertical, Edit, Phone as PhoneIcon, Mail as MailIcon, IdCard as IdCardIcon } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'missed';
  comments?: string[];
  primaryNumber?: string;
  secondaryNumber?: string;
  email?: string;
  leadId?: string;
  companyName?: string;
  planSummary?: string;
}

interface TaskListProps {
  title?: string;
  tasks: Task[];
  onComplete: (id: string) => void;
  onComment: (id: string, comment: string) => void;
  onChangeDate: (id: string, newDate: string) => void;
  onTaskClick?: (task: Task) => void;
  hidePlanSummary?: boolean;
}

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

export const TaskList: React.FC<TaskListProps> = ({
  title,
  tasks,
  onComplete,
  onComment,
  onChangeDate,
  onTaskClick,
  hidePlanSummary = false,
}) => {
  const [commentInput, setCommentInput] = useState<{ [id: string]: string }>({});
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<{ [id: string]: string }>({});

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(tasks.length / pageSize);
  const paginatedTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  React.useEffect(() => {
    // Reset to first page if tasks change and current page is out of range
    if (currentPage > totalPages) setCurrentPage(1);
  }, [tasks, totalPages]);

  return (
    <section className="bg-card/80 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
      {title && (
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        </div>
      )}
      <ul className="space-y-3 sm:space-y-4">
        {paginatedTasks.map(task => (
          <li
            key={task.id}
            className={`flex flex-col gap-3 sm:flex-row sm:items-center bg-background rounded-lg shadow p-3 sm:p-4 hover:shadow-md transition-shadow border border-border ${onTaskClick ? 'cursor-pointer hover:bg-muted/30' : ''}`}
            onClick={onTaskClick ? (e) => {
              if (
                (e.target as HTMLElement).closest('button, [role="menu"], [role="dialog"]')
              ) return;
              onTaskClick(task);
            } : undefined}
            {...(onTaskClick ? {
              tabIndex: 0,
              role: 'button',
              'aria-label': `Open task ${task.title}`,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTaskClick(task);
                }
              }
            } : {})}
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span>{statusIcon(task.status)}</span>
              <div className="min-w-0">
                <div className="font-semibold text-base sm:text-lg truncate">{task.title}</div>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                  {task.primaryNumber && (
                    <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{task.primaryNumber}</span>
                  )}
                  {task.secondaryNumber && (
                    <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{task.secondaryNumber}</span>
                  )}
                  {task.email && (
                    <span className="flex items-center gap-1"><MailIcon className="w-3 h-3" />{task.email}</span>
                  )}
                  {task.leadId && (
                    <span className="flex items-center gap-1"><IdCardIcon className="w-3 h-3" />{task.leadId}</span>
                  )}
                </div>
                {task.companyName && (
                  <div className="text-xs text-muted-foreground mt-1">{task.companyName}</div>
                )}
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground gap-1 mt-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Due: {task.dueDate}
                </div>
                {task.planSummary && !hidePlanSummary && (
                  <div className="bg-blue-50 dark:bg-blue-900/40 rounded p-2 mt-2 text-xs italic text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                    {task.planSummary}
                  </div>
                )}
                {task.comments && task.comments.length > 0 && (
                  <div className="flex items-center text-xs mt-1 text-muted-foreground gap-1">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Comments: {task.comments.join(', ')}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end w-full sm:w-auto">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Task actions"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="z-50 min-w-[180px] rounded-lg border border-border bg-white py-1 shadow-xl">
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-muted rounded"
                      onSelect={() => task.status !== 'completed' && onComplete(task.id)}
                      disabled={task.status === 'completed'}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Mark as Completed
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-muted rounded"
                      onSelect={() => setShowReschedule(task.id)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                      Reschedule
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-muted rounded"
                      onSelect={() => setShowCommentModal(task.id)}
                    >
                      <MessageCircle className="w-4 h-4 text-primary" />
                      Add/View Comments
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
            {/* Reschedule Date Picker Modal */}
            {showReschedule === task.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
                  <h4 className="font-semibold text-lg mb-2">Reschedule Follow-up</h4>
                  <input
                    type="date"
                    value={rescheduleDate[task.id] || task.dueDate}
                    onChange={e => setRescheduleDate({ ...rescheduleDate, [task.id]: e.target.value })}
                    className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      className="px-3 py-1 rounded bg-muted text-foreground hover:bg-muted/80"
                      onClick={() => setShowReschedule(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        onChangeDate(task.id, rescheduleDate[task.id] || task.dueDate);
                        setShowReschedule(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Comment Modal */}
            {showCommentModal === task.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
                  <h4 className="font-semibold text-lg mb-2">Add/View Comments</h4>
                  <div className="mb-2">
                    {task.comments && task.comments.length > 0 ? (
                      <ul className="mb-2 max-h-24 overflow-y-auto text-sm text-muted-foreground space-y-1">
                        {task.comments.map((c, i) => (
                          <li key={i} className="border-b last:border-b-0 pb-1">{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground mb-2">No comments yet.</div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={commentInput[task.id] || ''}
                    onChange={e => setCommentInput({ ...commentInput, [task.id]: e.target.value })}
                    className="border rounded px-2 py-2 text-sm focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      className="px-3 py-1 rounded bg-muted text-foreground hover:bg-muted/80"
                      onClick={() => setShowCommentModal(null)}
                    >
                      Close
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => {
                        onComment(task.id, commentInput[task.id] || '');
                        setCommentInput({ ...commentInput, [task.id]: '' });
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 focus:outline-none active:bg-gray-200"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ border: 'none' }}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded text-sm cursor-pointer transition-colors focus:outline-none active:bg-gray-200 hover:bg-gray-100 ${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => handlePageChange(i + 1)}
              style={{ border: 'none' }}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 focus:outline-none active:bg-gray-200"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ border: 'none' }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}; 