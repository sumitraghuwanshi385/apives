import React, { useState } from 'react';
import { Play, Download, Copy, Code2, Activity, GitCompare, GitBranch, Terminal, Package, Database, FileText, FolderTree, ExternalLink, Share2, FileJson, Link as LinkIcon } from 'lucide-react';
import { ArchitectProject } from '../../services/architectEngine';
import { SupportedFramework, FrameworkCodePreview } from '../../services/backendGenerators/types';
import { downloadFile, exportPostmanCollection } from '../../utils/download';
import { EndpointCards } from './EndpointCards';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { OpenApiViewer } from './OpenApiViewer';
import { BackendGenerator } from './BackendGenerator';
import { ChangesetSidePanel } from './ChangesetSidePanel';

interface OutputWorkspaceProps {
  currentProject: ArchitectProject;
  previousProject: ArchitectProject | null;
  selectedFramework: SupportedFramework;
  setSelectedFramework: (fw: SupportedFramework) => void;
  activeFrameworkBackend: FrameworkCodePreview;
  onOpenLiveRunner: () => void;
  onCopy: (text: string, label: string) => void;
  showToast: (msg: string) => void;
}

type TabType = 'overview' | 'heatmap' | 'changeset' | 'flow' | 'cicd' | 'backend' | 'schema' | 'openapi' | 'structure' | 'docs';

export const OutputWorkspace: React.FC<OutputWorkspaceProps> = ({
  currentProject,
  previousProject,
  selectedFramework,
  setSelectedFramework,
  activeFrameworkBackend,
  onOpenLiveRunner,
  onCopy,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isChangesetPanelOpen, setIsChangesetPanelOpen] = useState<boolean>(false);
  const [isExportConfigOpen, setIsExportConfigOpen] = useState<boolean>(false);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?project=${currentProject.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Shareable architecture link copied to clipboard!');
    setIsExportConfigOpen(false);
  };

  const handleDownloadConfigJson = () => {
    const filename = `${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_architect_config.json`;
    downloadFile(JSON.stringify(currentProject, null, 2), filename, 'application/json');
    showToast(`Downloaded ${filename}`);
    setIsExportConfigOpen(false);
  };

  const tabs: { id: TabType; label: string; icon: React.FC<{ size?: number }> }[] = [
    { id: 'overview', label: 'Endpoints Overview', icon: Code2 },
    { id: 'heatmap', label: 'Latency Heatmap', icon: Activity },
    { id: 'changeset', label: 'Changeset Diff', icon: GitCompare },
    { id: 'flow', label: 'Endpoint Flow', icon: GitBranch },
    { id: 'cicd', label: 'CI/CD Pipelines', icon: Terminal },
    { id: 'backend', label: 'Production Backend', icon: Package },
    { id: 'schema', label: 'Database Schema', icon: Database },
    { id: 'openapi', label: 'OpenAPI Spec', icon: FileText },
    { id: 'structure', label: 'Folder Structure', icon: FolderTree },
    { id: 'docs', label: 'Documentation', icon: ExternalLink }
  ];

  return (
    <div id="output-preview-section" className="space-y-6 animate-fade-in scroll-mt-28">
      {/* TOP HEADER & QUICK ACTIONS */}
      <div className="bg-dark-900 border border-mora-500/40 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mora-500 via-mora-400 to-transparent"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono bg-mora-500/20 text-mora-300 border border-mora-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {currentProject.config.architecture} Architecture
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                ID: {currentProject.id}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-white">{currentProject.name}</h2>
            <p className="text-xs text-slate-400 font-light mt-1 max-w-2xl">{currentProject.description}</p>
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            {/* EXPORT CONFIGURATION DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsExportConfigOpen(!isExportConfigOpen)}
                className="bg-mora-500/10 hover:bg-mora-500/20 border border-mora-500/40 text-mora-300 font-mono text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Share2 size={13} /> Export Config
              </button>

              {isExportConfigOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-900 border border-mora-500/40 rounded-2xl p-2 shadow-2xl z-[80] font-mono text-xs space-y-1 backdrop-blur-xl animate-fade-in">
                  <button
                    onClick={handleDownloadConfigJson}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-mora-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileJson size={14} className="text-mora-400" />
                    <span>Download JSON Config</span>
                  </button>
                  <button
                    onClick={handleCopyShareLink}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-mora-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LinkIcon size={14} className="text-mora-400" />
                    <span>Copy Shareable Link</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsChangesetPanelOpen(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <GitCompare size={13} /> View Changeset
            </button>

            <button
              onClick={onOpenLiveRunner}
              className="bg-mora-600 hover:bg-mora-500 text-white font-mono text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Play size={13} /> Live API Runner
            </button>

            <button
              onClick={() => downloadFile(currentProject.openApiJson, `${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_openapi.json`, 'application/json')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download size={12} /> Export OpenAPI
            </button>

            <button
              onClick={() => exportPostmanCollection(currentProject)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download size={12} /> Export Postman
            </button>

            <button
              onClick={() => onCopy(currentProject.documentationMarkdown, 'Documentation')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Copy size={12} /> Copy Docs
            </button>
          </div>
        </div>

        {/* STATS & METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-4 border-t border-white/10">
          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Endpoints</span>
            <span className="text-base font-bold font-mono text-white">{currentProject.stats.endpointsGenerated}</span>
          </div>

          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">DB Tables</span>
            <span className="text-base font-bold font-mono text-white">{currentProject.stats.schemasCount}</span>
          </div>

          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Est. Time Saved</span>
            <span className="text-base font-bold font-mono text-mora-400">~{currentProject.stats.estimatedTimeSavedHours} hrs</span>
          </div>

          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Complexity</span>
            <span className="text-base font-bold font-mono text-cyan-400">{currentProject.stats.complexityCategory}</span>
          </div>

          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Security Score</span>
            <span className="text-base font-bold font-mono text-mora-400">{currentProject.stats.securityScore}/100</span>
          </div>

          <div className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Architecture</span>
            <span className="text-base font-bold font-mono text-amber-400">{currentProject.stats.architectureQuality}</span>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-mora-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                  : 'bg-dark-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT RENDERERS */}
      {activeTab === 'overview' && (
        <EndpointCards endpoints={currentProject.endpoints} onCopy={onCopy} />
      )}

      {activeTab === 'openapi' && (
        <OpenApiViewer openApiJson={currentProject.openApiJson} openApiYaml={currentProject.openApiYaml} onCopy={onCopy} />
      )}

      {activeTab === 'backend' && (
        <BackendGenerator
          projectName={currentProject.name}
          selectedFramework={selectedFramework}
          setSelectedFramework={setSelectedFramework}
          activeFrameworkBackend={activeFrameworkBackend}
          onCopy={onCopy}
          showToast={showToast}
        />
      )}

      {(activeTab === 'heatmap' || activeTab === 'changeset' || activeTab === 'flow' || activeTab === 'cicd' || activeTab === 'schema' || activeTab === 'structure' || activeTab === 'docs') && (
        <ArchitectureDiagram
          currentProject={currentProject}
          previousProject={previousProject}
          selectedFramework={selectedFramework}
          activeTab={activeTab}
          onCopy={onCopy}
        />
      )}

      {/* CHANGESET SLIDE-OVER SIDE PANEL */}
      <ChangesetSidePanel
        currentProject={currentProject}
        previousProject={previousProject}
        isOpen={isChangesetPanelOpen}
        onClose={() => setIsChangesetPanelOpen(false)}
        isSidePanelMode={true}
      />
    </div>
  );
};
