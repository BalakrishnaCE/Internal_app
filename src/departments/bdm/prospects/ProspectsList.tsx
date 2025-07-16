import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProspects } from './prospectsData';

interface Prospect {
  id: string;
  name: string;
  company: string;
  initials: string;
  date: string;
  status: string;
}

const ProspectsList: React.FC = () => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(prospects.length / pageSize);
  const paginatedProspects = prospects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const loadProspects = async () => {
      try {
        const data = await fetchProspects();
        // Map backend data to Prospect interface
        const mapped = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          company: p.company,
          initials: p.name ? p.name.charAt(0).toUpperCase() : '-',
          date: p.dateandtime,
          status: p.status,
        }));
        setProspects(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load prospects.');
      } finally {
        setLoading(false);
      }
    };

    loadProspects();
  }, []);

  useEffect(() => {
    // Reset to first page if prospects change and current page is out of range
    if (currentPage > totalPages) setCurrentPage(1);
  }, [prospects, totalPages]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen">
      <div className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground text-lg">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : prospects.length === 0 ? (
          <div className="text-muted-foreground text-lg">No prospects found.</div>
        ) : (
          paginatedProspects.map((p) => (
            <div
              key={p.id}
              className="flex items-center bg-card text-card-foreground rounded-xl shadow p-4 gap-4 border border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate(`/bdm/prospects/${p.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`Open prospect ${p.name}`}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary">
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg sm:text-xl truncate">{p.name}</div>
                <div className="text-muted-foreground text-sm truncate">{p.company}</div>
                <div className="text-muted-foreground text-xs">Date & Time of Visit: {p.date}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border self-start
                  ${p.status === 'Completed'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : p.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : p.status === 'Todo'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-muted text-muted-foreground border-border'}`}
              >
                {p.status}
              </span>
            </div>
          ))
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 focus:outline-none active:bg-gray-200"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded text-sm cursor-pointer transition-colors focus:outline-none active:bg-gray-200 ${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
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
  );
};

export default ProspectsList;