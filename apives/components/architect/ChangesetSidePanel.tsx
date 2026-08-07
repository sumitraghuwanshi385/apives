import React, { useState } from 'react';
import { GitCompare, Plus, Minus, RefreshCw, X, Database, Zap, Layers, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ArchitectProject } from '../../services/architectEngine';

interface ChangesetSidePanelProps {
  currentProject: ArchitectProject;
  previousProject: ArchitectProject | null;
  isOpen?: boolean;
  onClose?: () => void;
  isSidePanelMode?: boolean;
}

export interface DiffResult {
  additionsCount: number;
  deletionsCount: number;
  modificationsCount: number;
  endpoints: {
    type: 'added' | 'deleted' | 'modified' | 'unchanged';
    current?: any;
    previous?: any;
    changes?: string[];
  }[];
  tables: {
    type: 'added' | 'deleted' | 'modified' | 'unchanged';
    name: string;
    fieldChanges?: { name: string; type: 'added' | 'deleted' | 'modified'; dataType: string }[];
  }[];
  configChanges: { key: string; from: string; to: string }[];
}

export function analyzeArchitectureDiff(
  previous: ArchitectProject | null,
  current: ArchitectProject
): DiffResult {
  if (!previous) {
    // Initial generation - everything in current is an addition
    const endpointDiffs = current.endpoints.map(ep => ({
      type: 'added' as const,
      current: ep,
      changes: ['New endpoint synthesized']
    }));

    const tableDiffs = current.databaseSchema.tables.map(tbl => ({
      type: 'added' as const,
      name: tbl.name,
      fieldChanges: tbl.fields.map(f => ({ name: f.name, type: 'added' as const, dataType: f.type }))
    }));

    return {
      additionsCount: current.endpoints.length + current.databaseSchema.tables.length,
      deletionsCount: 0,
      modificationsCount: 0,
      endpoints: endpointDiffs,
      tables: tableDiffs,
      configChanges: [
        { key: 'Architecture', from: 'None', to: current.config.architecture },
        { key: 'Database Engine', from: 'None', to: current.config.database },
        { key: 'Authentication', from: 'None', to: current.config.auth },
        { key: 'API Style', from: 'None', to: current.config.apiStyle }
      ]
    };
  }

  // Calculate endpoint diffs
  const endpointMapPrev = new Map(previous.endpoints.map(e => [`${e.method}:${e.path}`, e]));
  const endpointMapCurr = new Map(current.endpoints.map(e => [`${e.method}:${e.path}`, e]));

  const endpointDiffs: DiffResult['endpoints'] = [];
  let additions = 0;
  let deletions = 0;
  let modifications = 0;

  // Process current endpoints
  current.endpoints.forEach(currEp => {
    const key = `${currEp.method}:${currEp.path}`;
    const prevEp = endpointMapPrev.get(key);

    if (!prevEp) {
      additions++;
      endpointDiffs.push({
        type: 'added',
        current: currEp,
        changes: ['Endpoint path & controller route added']
      });
    } else {
      const changes: string[] = [];
      if (currEp.description !== prevEp.description) changes.push(`Description updated`);
      if (currEp.authRequired !== prevEp.authRequired) changes.push(`Auth requirement changed to ${currEp.authRequired}`);
      if (JSON.stringify(currEp.requestBody) !== JSON.stringify(prevEp.requestBody)) changes.push('Request payload body updated');
      if (JSON.stringify(currEp.responseBody) !== JSON.stringify(prevEp.responseBody)) changes.push('Response body fields updated');

      if (changes.length > 0) {
        modifications++;
        endpointDiffs.push({
          type: 'modified',
          current: currEp,
          previous: prevEp,
          changes
        });
      } else {
        endpointDiffs.push({
          type: 'unchanged',
          current: currEp,
          previous: prevEp
        });
      }
    }
  });

  // Process deleted endpoints
  previous.endpoints.forEach(prevEp => {
    const key = `${prevEp.method}:${prevEp.path}`;
    if (!endpointMapCurr.has(key)) {
      deletions++;
      endpointDiffs.push({
        type: 'deleted',
        previous: prevEp,
        changes: ['Endpoint route removed from architecture']
      });
    }
  });

  // Calculate database table diffs
  const prevTables = new Map(previous.databaseSchema.tables.map(t => [t.name, t]));
  const currTables = new Map(current.databaseSchema.tables.map(t => [t.name, t]));

  const tableDiffs: DiffResult['tables'] = [];

  current.databaseSchema.tables.forEach(currTbl => {
    const prevTbl = prevTables.get(currTbl.name);
    if (!prevTbl) {
      additions++;
      tableDiffs.push({
        type: 'added',
        name: currTbl.name,
        fieldChanges: currTbl.fields.map(f => ({ name: f.name, type: 'added', dataType: f.type }))
      });
    } else {
      const fieldChanges: { name: string; type: 'added' | 'deleted' | 'modified'; dataType: string }[] = [];
      const prevFieldNames = new Set(prevTbl.fields.map(f => f.name));
      const currFieldNames = new Set(currTbl.fields.map(f => f.name));

      currTbl.fields.forEach(f => {
        if (!prevFieldNames.has(f.name)) {
          fieldChanges.push({ name: f.name, type: 'added', dataType: f.type });
          additions++;
        }
      });

      prevTbl.fields.forEach(f => {
        if (!currFieldNames.has(f.name)) {
          fieldChanges.push({ name: f.name, type: 'deleted', dataType: f.type });
          deletions++;
        }
      });

      if (fieldChanges.length > 0) {
        modifications++;
        tableDiffs.push({
          type: 'modified',
          name: currTbl.name,
          fieldChanges
        });
      } else {
        tableDiffs.push({
          type: 'unchanged',
          name: currTbl.name
        });
      }
    }
  });

  previous.databaseSchema.tables.forEach(prevTbl => {
    if (!currTables.has(prevTbl.name)) {
      deletions++;
      tableDiffs.push({
        type: 'deleted',
        name: prevTbl.name,
        fieldChanges: prevTbl.fields.map(f => ({ name: f.name, type: 'deleted', dataType: f.type }))
      });
    }
  });

  // Calculate config changes
  const configChanges: { key: string; from: string; to: string }[] = [];
  if (previous.config.database !== current.config.database) {
    configChanges.push({ key: 'Database Engine', from: previous.config.database, to: current.config.database });
  }
  if (previous.config.auth !== current.config.auth) {
    configChanges.push({ key: 'Authentication Method', from: previous.config.auth, to: current.config.auth });
  }
  if (previous.config.architecture !== current.config.architecture) {
    configChanges.push({ key: 'Architecture Style', from: previous.config.architecture, to: current.config.architecture });
  }
  if (previous.config.apiStyle !== current.config.apiStyle) {
    configChanges.push({ key: 'API Style', from: previous.config.apiStyle, to: current.config.apiStyle });
  }
  const prevVer = `v${previous.config.version.major}.${previous.config.version.minor}.${previous.config.version.patch}`;
  const currVer = `v${current.config.version.major}.${current.config.version.minor}.${current.config.version.patch}`;
  if (prevVer !== currVer) {
    configChanges.push({ key: 'Version', from: prevVer, to: currVer });
  }

  return {
    additionsCount: additions,
    deletionsCount: deletions,
    modificationsCount: modifications,
    endpoints: endpointDiffs,
    tables: tableDiffs,
    configChanges
  };
}

export const ChangesetSidePanel: React.FC<ChangesetSidePanelProps> = ({
  currentProject,
  previousProject,
  isOpen = true,
  onClose,
  isSidePanelMode = false
}) => {
  const [filterType, setFilterType] = useState<'all' | 'added' | 'deleted' | 'modified'>('all');

  const diff = analyzeArchitectureDiff(previousProject, currentProject);

  const filteredEndpoints = diff.endpoints.filter(e => {
    if (filterType === 'all') return e.type !== 'unchanged';
    return e.type === filterType;
  });

  const filteredTables = diff.tables.filter(t => {
    if (filterType === 'all') return t.type !== 'unchanged';
    return t.type === filterType;
  });

  const content = (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER & SUMMARY METRICS */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mora-500/10 border border-mora-500/30 text-mora-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <GitCompare size={12} /> Architectural Changeset Analyzer
          </div>
          <h3 className="text-lg md:text-xl font-display font-extrabold text-white flex items-center gap-2">
            Architecture Diff &amp; Revision Changeset
          </h3>
          <p className="text-xs text-slate-400 font-sans font-light mt-1 max-w-xl">
            Real-time, synchronized diff analysis displaying color-coded additions (+), deletions (-), and structural modifications (~) for endpoints and database DDL schemas.
          </p>
        </div>

        {/* CLOSE / BACK BUTTON FOR SIDE PANEL OR MODAL */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
            title="Close panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* SUMMARY STATS BADGES - COMPACT PILL-SHAPED BADGES */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-mora-500/10 border border-mora-500/30 text-mora-300 font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] uppercase tracking-wider">
          <Plus size={10} className="text-mora-400 font-extrabold" /> {diff.additionsCount} Additions
        </span>
        <span className="bg-red-500/10 border border-red-500/30 text-red-300 font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] uppercase tracking-wider">
          <Minus size={10} className="text-red-400 font-extrabold" /> {diff.deletionsCount} Deletions
        </span>
        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] uppercase tracking-wider">
          <RefreshCw size={10} className="text-amber-400" /> {diff.modificationsCount} Modified
        </span>
      </div>

      {/* FILTER BUTTONS - HORIZONTAL SCROLL */}
      <div className="flex items-center gap-1.5 bg-black/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            filterType === 'all' ? 'bg-mora-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Changes
        </button>
        <button
          onClick={() => setFilterType('added')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            filterType === 'added' ? 'bg-mora-500 text-black shadow-md' : 'text-mora-400 hover:bg-mora-500/10'
          }`}
        >
          <Plus size={11} /> Additions ({diff.additionsCount})
        </button>
        <button
          onClick={() => setFilterType('deleted')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            filterType === 'deleted' ? 'bg-red-500 text-white shadow-md' : 'text-red-400 hover:bg-red-500/10'
          }`}
        >
          <Minus size={11} /> Deletions ({diff.deletionsCount})
        </button>
        <button
          onClick={() => setFilterType('modified')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            filterType === 'modified' ? 'bg-amber-500 text-black shadow-md' : 'text-amber-400 hover:bg-amber-500/10'
          }`}
        >
          <RefreshCw size={11} /> Modified ({diff.modificationsCount})
        </button>
      </div>

      {/* CONFIG & METADATA DIFF SECTION */}
      {diff.configChanges.length > 0 && (
        <div className="bg-dark-900/60 border border-white/10 rounded-2xl p-4 space-y-2.5">
          <span className="text-xs text-mora-400 uppercase font-bold tracking-wider block flex items-center gap-1.5 font-mono">
            <Zap size={14} className="text-mora-400" /> Stack &amp; Configuration Delta
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {diff.configChanges.map((cfg, idx) => (
              <div key={idx} className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">{cfg.key}</span>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 line-through bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px]">{cfg.from}</span>
                  <ArrowRight size={11} className="text-slate-500" />
                  <span className="text-mora-300 font-bold bg-mora-500/10 border border-mora-500/20 px-2 py-0.5 rounded-full text-[10px]">{cfg.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENDPOINTS DIFF SECTION */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-mora-400 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Layers size={14} className="text-mora-400" /> API Endpoints Changeset ({filteredEndpoints.length})
          </span>
        </div>

        {filteredEndpoints.length === 0 ? (
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center text-slate-500 font-sans">
            No endpoint changes match filter criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEndpoints.map((item, idx) => {
              if (item.type === 'added') {
                const ep = item.current;
                const filteredChanges = (item.changes || []).filter(
                  c => !c.toLowerCase().includes('new endpoint') && !c.toLowerCase().includes('synthesized')
                );
                return (
                  <div
                    key={`add_${idx}`}
                    className="bg-dark-900/60 border border-white/10 hover:border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-mora-500/20 text-mora-300 border border-mora-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                          <Plus size={9} /> Added
                        </span>
                        <span className="bg-white/5 text-slate-200 border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                          {ep.method}
                        </span>
                        <span className="text-white font-mono font-bold text-xs">{ep.path}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Auth: {ep.authRequired ? 'Required' : 'Public'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{ep.description}</p>
                    {filteredChanges.length > 0 && (
                      <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-white/5 flex items-center gap-1">
                        <ShieldCheck size={11} className="text-mora-400" />
                        <span>{filteredChanges.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.type === 'deleted') {
                const ep = item.previous;
                return (
                  <div
                    key={`del_${idx}`}
                    className="bg-dark-900/60 border border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                          <Minus size={9} /> Deleted
                        </span>
                        <span className="bg-white/5 text-slate-500 border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase line-through">
                          {ep.method}
                        </span>
                        <span className="text-red-400/90 font-mono font-bold text-xs line-through">{ep.path}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-sans line-through">{ep.description}</p>
                  </div>
                );
              }

              if (item.type === 'modified') {
                const ep = item.current;
                return (
                  <div
                    key={`mod_${idx}`}
                    className="bg-dark-900/60 border border-white/10 hover:border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                          <RefreshCw size={9} /> Modified
                        </span>
                        <span className="bg-white/5 text-slate-200 border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                          {ep.method}
                        </span>
                        <span className="text-amber-300 font-mono font-bold text-xs">{ep.path}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">{ep.description}</p>
                    {item.changes && item.changes.length > 0 && (
                      <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-white/5">
                        Changes: {item.changes.join(', ')}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* DATABASE SCHEMA TABLES DIFF SECTION */}
      <div className="space-y-3.5 pt-4 border-t border-white/10">
        <span className="text-xs font-bold text-mora-400 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Database size={14} className="text-mora-400" /> Database DDL Schema Delta ({filteredTables.length})
        </span>

        {filteredTables.length === 0 ? (
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center text-slate-500 font-sans">
            No database schema table changes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTables.map((tbl, idx) => {
              const isAdded = tbl.type === 'added';
              const isDeleted = tbl.type === 'deleted';

              return (
                <div
                  key={`tbl_${idx}`}
                  className="bg-dark-900/60 border border-white/10 hover:border-white/20 rounded-2xl p-3.5 sm:p-4 space-y-2.5 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      {isAdded && <Plus size={11} className="text-mora-400" />}
                      {isDeleted && <Minus size={11} className="text-red-400" />}
                      Table: {tbl.name}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isAdded
                        ? 'bg-mora-500/10 text-mora-300 border-mora-500/30'
                        : isDeleted
                        ? 'bg-red-500/10 text-red-300 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {tbl.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono">
                    {tbl.fieldChanges?.map((fc, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between py-0.5">
                        <span className={fc.type === 'added' ? 'text-mora-400 font-medium' : fc.type === 'deleted' ? 'text-red-400 line-through' : 'text-amber-300'}>
                          {fc.type === 'added' ? '+ ' : fc.type === 'deleted' ? '- ' : '~ '}
                          {fc.name}
                        </span>
                        <span className="text-slate-400 text-[10px] bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">{fc.dataType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (isSidePanelMode) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[200] flex flex-col bg-dark-950/98 backdrop-blur-2xl animate-fade-in h-screen w-screen overflow-hidden pt-16 sm:pt-20">
        {/* TOP FIXED STICKY BAR - FIXED TOP TO BOTTOM INSET WITH SAFE-AREA SPACING */}
        <div className="bg-dark-900/95 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl shrink-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="bg-mora-500/10 hover:bg-mora-500/20 border border-mora-500/40 text-mora-300 font-mono text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={13} /> Back to Architecture
            </button>
            <span className="text-xs font-mono font-bold text-white hidden sm:inline-block">
              Apives Architect <span className="text-mora-400">• Full Revision Changeset Inspector</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden md:inline-block">
              {diff.additionsCount + diff.deletionsCount + diff.modificationsCount} Total Delta Changes
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FULL-HEIGHT CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl w-full mx-auto bg-dark-900/80 border border-mora-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

