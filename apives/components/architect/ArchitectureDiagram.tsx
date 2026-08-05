import React, { useState } from 'react';
import { Activity, GitCompare, GitBranch, Terminal, Database, ArrowUp, ArrowDown, Play, Copy, Download } from 'lucide-react';
import { ArchitectProject, computeLatencyMetrics } from '../../services/architectEngine';
import { generateCiCdConfigs } from '../../services/backendGenerators/cicdGenerators';
import { SupportedFramework } from '../../services/backendGenerators/types';
import { downloadFile } from '../../utils/download';
import { ChangesetSidePanel } from './ChangesetSidePanel';

interface ArchitectureDiagramProps {
  currentProject: ArchitectProject;
  previousProject: ArchitectProject | null;
  selectedFramework: SupportedFramework;
  activeTab: 'heatmap' | 'changeset' | 'flow' | 'cicd' | 'schema' | 'structure' | 'docs';
  onCopy: (text: string, label: string) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  currentProject,
  previousProject,
  selectedFramework,
  activeTab,
  onCopy,
}) => {
  // Flow simulation state
  const [flowEndpointIds, setFlowEndpointIds] = useState<string[]>(
    currentProject.endpoints.map(e => e.id)
  );
  const [simulatedStep, setSimulatedStep] = useState<number | null>(null);
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(false);

  // CI/CD platform state
  const [cicdPlatform, setCicdPlatform] = useState<'github' | 'gitlab'>('github');

  // Folder structure state
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');

  const moveFlowEndpoint = (index: number, direction: 'up' | 'down') => {
    const newIds = [...flowEndpointIds];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newIds.length) return;
    const temp = newIds[index];
    newIds[index] = newIds[targetIdx];
    newIds[targetIdx] = temp;
    setFlowEndpointIds(newIds);
  };

  const startFlowSimulation = () => {
    setIsSimulatingFlow(true);
    setSimulatedStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= flowEndpointIds.length) {
        clearInterval(interval);
        setIsSimulatingFlow(false);
        setSimulatedStep(null);
      } else {
        setSimulatedStep(step);
      }
    }, 800);
  };

  const cicdConfigs = generateCiCdConfigs(selectedFramework, currentProject.name);

  return (
    <div className="space-y-4">
      {/* LATENCY HEATMAP DASHBOARD */}
      {activeTab === 'heatmap' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 space-y-5 animate-fade-in font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} className="text-mora-500" /> Endpoint Latency &amp; Bottleneck Analysis
              </h3>
              <p className="text-xs text-slate-400 font-sans font-light mt-0.5">
                Simulated P50/P95/P99 latency calculations based on DB engine queries and payload weight.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-mora-500/20 text-mora-400 border border-mora-500/40 px-2 py-0.5 rounded font-bold">Low Risk (&lt;50ms)</span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">Med Risk (50-100ms)</span>
              <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold">High Risk (&gt;100ms)</span>
            </div>
          </div>

          <div className="space-y-3">
            {computeLatencyMetrics(currentProject.endpoints).map((m) => {
              const riskColor = 
                m.riskLevel === 'HIGH' ? 'border-red-500/40 bg-red-950/20 text-red-400' :
                m.riskLevel === 'MEDIUM' ? 'border-amber-500/40 bg-amber-950/20 text-amber-400' :
                'border-mora-500/40 bg-mora-950/20 text-mora-400';

              return (
                <div key={m.endpointId} className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                        {m.method}
                      </span>
                      <span className="text-xs text-white font-bold">{m.path}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${riskColor}`}>
                        {m.riskLevel} LATENCY RISK
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block">P50</span>
                        <span className="text-mora-400 font-bold">{m.p50}ms</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block">P95</span>
                        <span className="text-amber-400 font-bold">{m.p95}ms</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block">P99</span>
                        <span className="text-red-400 font-bold">{m.p99}ms</span>
                      </div>
                      <div className="text-center pl-2 border-l border-white/10">
                        <span className="text-[9px] text-slate-500 block">DB Queries</span>
                        <span className="text-slate-300 font-bold">{m.dbQueriesCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Execution Latency Profile</span>
                      <span>Payload: ~{m.payloadKb} KB</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-mora-500 h-full" style={{ width: `${Math.min(100, (m.p50 / 120) * 100)}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, ((m.p95 - m.p50) / 120) * 100)}%` }}></div>
                      <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, ((m.p99 - m.p95) / 120) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                      <span className="text-slate-500 text-[9px] uppercase block font-bold">Bottleneck Diagnosis</span>
                      <span className="text-slate-300 font-sans">{m.bottleneckReason}</span>
                    </div>
                    <div className="bg-mora-500/5 border border-mora-500/20 p-2 rounded-lg">
                      <span className="text-mora-400 text-[9px] uppercase block font-bold">Optimization Advice</span>
                      <span className="text-slate-300 font-sans">{m.recommendation}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHANGESET VIEW */}
      {activeTab === 'changeset' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 space-y-4 animate-fade-in font-mono">
          <ChangesetSidePanel
            currentProject={currentProject}
            previousProject={previousProject}
          />
        </div>
      )}

      {/* ENDPOINT FLOW VISUALIZER */}
      {activeTab === 'flow' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 space-y-5 animate-fade-in font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitBranch size={16} className="text-mora-500" /> Interactive Endpoint Request Flow Visualizer
              </h3>
              <p className="text-xs text-slate-400 font-sans font-light mt-0.5">
                Reorder endpoints and run simulated request sequence execution to analyze architecture dependencies.
              </p>
            </div>
            <button
              onClick={startFlowSimulation}
              disabled={isSimulatingFlow}
              className="bg-mora-500 hover:bg-mora-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Play size={13} /> {isSimulatingFlow ? 'Simulating Sequence...' : 'Simulate Request Flow'}
            </button>
          </div>

          <div className="space-y-2">
            {flowEndpointIds.map((id, index) => {
              const ep = currentProject.endpoints.find(e => e.id === id);
              if (!ep) return null;

              const isActiveStep = simulatedStep === index;

              return (
                <div
                  key={ep.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    isActiveStep 
                      ? 'bg-mora-500/20 border-mora-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-[1.01]' 
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 text-slate-500">
                      <button onClick={() => moveFlowEndpoint(index, 'up')} className="hover:text-white transition-colors" title="Move Up">
                        <ArrowUp size={12} />
                      </button>
                      <button onClick={() => moveFlowEndpoint(index, 'down')} className="hover:text-white transition-colors" title="Move Down">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-mora-400">
                      {index + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mora-500/20 text-mora-400 border border-mora-500/30">
                      {ep.method}
                    </span>
                    <span className="text-xs text-white font-bold">{ep.path}</span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white/5">Client</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Auth Guard</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Controller</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-mora-500/10 text-mora-300 border border-mora-500/20">{currentProject.config.database}</span>
                  </div>

                  {isActiveStep && (
                    <span className="text-[10px] text-mora-400 font-bold animate-pulse">
                      ⚡ Executing Request (14ms)...
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CI/CD PIPELINES */}
      {activeTab === 'cicd' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 space-y-4 animate-fade-in font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal size={16} className="text-mora-500" /> CI/CD Pipeline Deployment Configurations
              </h3>
              <p className="text-xs text-slate-400 font-sans font-light mt-0.5">
                Production automated workflows for {selectedFramework} targeting GitHub Actions &amp; GitLab CI.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCicdPlatform('github')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  cicdPlatform === 'github' ? 'bg-mora-500 text-black border-mora-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                GitHub Actions
              </button>
              <button
                onClick={() => setCicdPlatform('gitlab')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  cicdPlatform === 'gitlab' ? 'bg-mora-500 text-black border-mora-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                GitLab CI/CD
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => onCopy(
                cicdPlatform === 'github' ? cicdConfigs.githubActions : cicdConfigs.gitlabCi,
                `${cicdPlatform === 'github' ? 'GitHub Actions' : 'GitLab CI'} Pipeline`
              )}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Copy size={12} /> Copy Pipeline YAML
            </button>
            <button
              onClick={() => downloadFile(
                cicdPlatform === 'github' ? cicdConfigs.githubActions : cicdConfigs.gitlabCi,
                cicdPlatform === 'github' ? 'deploy.yml' : '.gitlab-ci.yml',
                'text/yaml'
              )}
              className="bg-mora-500 text-black hover:bg-mora-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download size={12} /> Export YAML
            </button>
          </div>

          <pre className="bg-black/80 border border-white/10 rounded-xl p-4 text-xs text-mora-300 overflow-x-auto max-h-[480px] leading-relaxed">
            {cicdPlatform === 'github' ? cicdConfigs.githubActions : cicdConfigs.gitlabCi}
          </pre>
        </div>
      )}

      {/* DATABASE SCHEMA */}
      {activeTab === 'schema' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 animate-fade-in space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database size={16} className="text-mora-500" /> Relational Database DDL Schema
            </h3>
            <span className="text-xs text-mora-400 font-bold bg-mora-500/10 px-2.5 py-1 rounded-full border border-mora-500/20">
              {currentProject.config.database} Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProject.databaseSchema.tables.map((tbl) => (
              <div key={tbl.name} className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-mora-300">Table: {tbl.name}</span>
                  <span className="text-[10px] text-slate-500">{tbl.fields.length} Fields</span>
                </div>

                <div className="space-y-1 text-xs">
                  {tbl.fields.map((f) => (
                    <div key={f.name} className="flex items-center justify-between py-0.5">
                      <span className="text-white font-bold">{f.name}</span>
                      <span className="text-slate-400 text-[11px]">{f.type} {f.primaryKey ? '(PK)' : ''}</span>
                    </div>
                  ))}
                </div>

                {tbl.indexes && tbl.indexes.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block mb-1">Indexes</span>
                    <div className="flex flex-wrap gap-1">
                      {tbl.indexes.map((idx) => (
                        <span key={idx} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-slate-400">
                          {idx}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 animate-fade-in space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Database size={14} className="text-mora-500" /> Generated Backend Folder Architecture
            </h4>
            <span className="text-[10px] text-slate-500 uppercase">{currentProject.config.architecture} Standard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1 bg-black/60 border border-white/10 rounded-xl p-3">
              {currentProject.folderStructure.map((item) => (
                <div
                  key={item.path}
                  onClick={() => {
                    if (item.type === 'file') {
                      setSelectedFileName(item.path);
                      setSelectedFileContent(`// ${item.path}\n// ${item.description}\n\nexport const handler = async (req, res) => {\n  // Production logic initialized by Apives Architect\n  res.status(200).json({ ok: true, file: "${item.path}" });\n};`);
                    }
                  }}
                  className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedFileName === item.path ? 'bg-mora-500/20 text-mora-300 border border-mora-500/30' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-mora-500 text-xs">{item.type === 'folder' ? '📁' : '📄'}</span>
                    <span className={item.type === 'folder' ? 'text-white font-bold' : 'text-slate-300'}>{item.path}</span>
                  </div>
                  <span className="text-slate-500 text-[10px] truncate max-w-[140px]">{item.description}</span>
                </div>
              ))}
            </div>

            <div className="bg-black/90 border border-white/10 rounded-xl p-3 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400 text-[11px] font-bold">{selectedFileName || 'Select a file to inspect'}</span>
                {selectedFileContent && (
                  <button
                    onClick={() => onCopy(selectedFileContent, selectedFileName)}
                    className="text-[10px] text-mora-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy size={11} /> Copy
                  </button>
                )}
              </div>
              <pre className="text-mora-400 text-[11px] overflow-x-auto min-h-[160px] leading-relaxed">
                {selectedFileContent || '// Click any file in the left directory tree to view generated template handler code.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTATION TAB */}
      {activeTab === 'docs' && (
        <div className="bg-dark-900 border border-white/10 rounded-2xl p-5 animate-fade-in space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Markdown API Documentation</h3>
            <button
              onClick={() => onCopy(currentProject.markdownDocs, 'Markdown Docs')}
              className="bg-white/5 hover:bg-white/10 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Copy size={12} /> Copy Markdown
            </button>
          </div>

          <pre className="bg-black/80 border border-white/10 rounded-xl p-4 text-mora-300 overflow-x-auto max-h-[480px] leading-relaxed">
            {currentProject.markdownDocs}
          </pre>
        </div>
      )}
    </div>
  );
};
