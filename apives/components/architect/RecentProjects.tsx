import React from 'react';
import { FolderTree, Search, Info, CopyPlus, Trash2 } from 'lucide-react';
import { ArchitectProject } from '../../services/architectEngine';

interface RecentProjectsProps {
  recentProjects: ArchitectProject[];
  projectSearch: string;
  setProjectSearch: (val: string) => void;
  currentProject: ArchitectProject | null;
  onSelectProject: (project: ArchitectProject) => void;
  onDuplicateProject: (project: ArchitectProject, e: React.MouseEvent) => void;
  onOpenDeleteModal: (project: ArchitectProject, e: React.MouseEvent) => void;
  isAuthenticated?: boolean;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  recentProjects,
  projectSearch,
  setProjectSearch,
  currentProject,
  onSelectProject,
  onDuplicateProject,
  onOpenDeleteModal,
  isAuthenticated = false,
}) => {
  const filteredProjects = recentProjects.filter(p =>
    (p.name || '').toLowerCase().includes((projectSearch || '').toLowerCase()) ||
    (p.description || '').toLowerCase().includes((projectSearch || '').toLowerCase())
  );

  return (
    <div className="mb-14 bg-dark-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <FolderTree size={18} className="text-mora-500" /> Recent Architect Projects
          </h2>
          <p className="text-xs text-slate-400 font-light">Saved architecture definitions persisted in your local workspace session.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-mora-500 placeholder-slate-600"
          />
        </div>
      </div>

      {!isAuthenticated && recentProjects.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-black/40">
          <Info size={32} className="mx-auto text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-300 mb-1">Your next API starts here</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 font-light">
            Describe your idea above and let Apives Architect design the complete architecture. Logged in users get cloud synchronization!
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500">
          No matching projects found. Generate an architecture to see it saved here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className={`border rounded-xl p-3.5 cursor-pointer transition-all duration-300 relative group ${
                currentProject?.id === proj.id 
                  ? 'bg-black border-mora-500/70 shadow-[0_0_15px_rgba(34,197,94,0.12)]' 
                  : 'bg-black/80 border-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-mora-400 font-bold">{proj.createdAt}</span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => onDuplicateProject(proj, e)}
                    title="Duplicate"
                    className="p-1 hover:text-mora-400 text-slate-400 transition-colors"
                  >
                    <CopyPlus size={13} />
                  </button>
                  <button
                    onClick={(e) => onOpenDeleteModal(proj, e)}
                    title="Delete"
                    className="p-1 hover:text-red-400 text-slate-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="text-xs font-bold text-white mb-2 group-hover:text-mora-300 transition-colors">{proj.name}</h3>

              <div className="flex flex-wrap gap-1 mb-2.5">
                <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                  {proj.config.architecture}
                </span>
                <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                  {proj.config.auth}
                </span>
                <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                  {proj.config.database}
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{proj.endpoints.length} Endpoints</span>
                <span className="text-mora-400 font-bold">Score: {proj.stats.complexityScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
