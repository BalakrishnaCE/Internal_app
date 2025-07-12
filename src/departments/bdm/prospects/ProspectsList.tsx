import React from 'react';
import { useNavigate } from 'react-router-dom';
import { prospects } from './prospectsData';

const ProspectsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-2 sm:px-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">Prospects</h1>

      {/* Static Prospects */}
      <div className="space-y-4">
        {prospects.length === 0 ? (
          <div className="text-muted-foreground text-lg">No prospects found.</div>
        ) : (
          prospects.map((p) => (
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
                <div className="text-muted-foreground text-xs">Visited: {p.date}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border self-start
                  ${p.status === 'Completed' ? 'bg-primary/10 text-primary border-primary/20' :
                    p.status === 'In Progress' ? 'bg-warning/10 text-warning border-warning/20' :
                    'bg-muted text-muted-foreground border-border'}`}
              >
                {p.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProspectsList;
