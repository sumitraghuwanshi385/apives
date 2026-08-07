import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2 } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { Hero } from '../components/architect/Hero';
import { PromptWorkspace } from '../components/architect/PromptWorkspace';
import { AdvancedConfig } from '../components/architect/AdvancedConfig';
import { CircuitPipeline } from '../components/architect/CircuitPipeline';
import { ExampleLibrary } from '../components/architect/ExampleLibrary';
import { RecentProjects } from '../components/architect/RecentProjects';
import { OutputWorkspace } from '../components/architect/OutputWorkspace';
import { ShortcutsModal } from '../components/architect/ShortcutsModal';
import { DeleteModal } from '../components/architect/DeleteModal';
import { LiveRunnerModal } from '../components/architect/LiveRunnerModal';
import {
  generateApiArchitecture,
  ArchitectConfig,
  ArchitectProject,
  DEFAULT_ARCHITECT_CONFIG
} from '../services/architectEngine';
import { SupportedFramework } from '../services/backendGenerators/types';
import { generateFrameworkBackend } from '../services/backendGenerators';

export const ApivesArchitect: React.FC = () => {
  // Input State
  const [promptText, setPromptText] = useState<string>('');
  const [config, setConfig] = useState<ArchitectConfig>(DEFAULT_ARCHITECT_CONFIG);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<'auth' | 'database' | 'architecture' | 'apiStyle' | null>(null);

  // Execution State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  // Projects State
  const [recentProjects, setRecentProjects] = useState<ArchitectProject[]>(() => {
    try {
      const saved = localStorage.getItem('apives_architect_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return [];
  });

  const [currentProject, setCurrentProject] = useState<ArchitectProject | null>(() => {
    try {
      const saved = localStorage.getItem('apives_architect_projects');
      if (saved) {
        const list = JSON.parse(saved);
        if (list.length > 0) return list[0];
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [previousProject, setPreviousProject] = useState<ArchitectProject | null>(null);
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState<SupportedFramework>('Express.js');

  // Modals & UI State
  const [isShortcutSheetOpen, setIsShortcutSheetOpen] = useState<boolean>(false);
  const [isLiveRunnerOpen, setIsLiveRunnerOpen] = useState<boolean>(false);
  const [deletingProject, setDeletingProject] = useState<ArchitectProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apives_architect_projects', JSON.stringify(recentProjects));
    } catch (e) {
      console.error('Failed to persist projects', e);
    }
  }, [recentProjects]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input/select except Ctrl combinations
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPromptText('');
        showToast('Workspace text cleared');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (currentProject) {
          setIsLiveRunnerOpen(prev => !prev);
        }
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutSheetOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsShortcutSheetOpen(false);
        setIsLiveRunnerOpen(false);
        setDeletingProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [promptText, isGenerating, currentProject]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navigate = useNavigate();

  const handleChipClick = (chip: string) => {
    setPromptText(prev => (prev ? `${prev}\n• Include ${chip}` : `Build API with ${chip}`));
  };

  const handleTemplateClick = (templatePrompt: string) => {
    setPromptText(templatePrompt);
    showToast('Loaded prompt template into workspace');
  };

  const handleGenerate = () => {
    if (!promptText.trim() || isGenerating) return;

    // Redirect to auth page if non-logged user
    const userStr = localStorage.getItem('mora_user');
    if (!userStr) {
      navigate('/access?returnUrl=/architect');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);
    setTimeout(() => setGenerationStep(4), 1800);

    setTimeout(() => {
      if (currentProject) {
        setPreviousProject(currentProject);
      }

      const generated = generateApiArchitecture(promptText, config);

      setCurrentProject(generated);
      setRecentProjects(prev => [generated, ...prev.filter(p => p.id !== generated.id)]);

      setIsGenerating(false);
      setGenerationStep(0);
      // Success toast removed as requested (silent transition)

      setTimeout(() => {
        const outputElem = document.getElementById('output-preview-section');
        if (outputElem) {
          outputElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 2400);
  };

  const handleDuplicateProject = (project: ArchitectProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: ArchitectProject = {
      ...project,
      id: `proj_${Math.random().toString(36).substring(2, 9)}`,
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRecentProjects(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${project.name}"`);
  };

  const handleOpenDeleteModal = (project: ArchitectProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingProject(project);
  };

  const confirmDeleteProject = () => {
    if (!deletingProject) return;
    const projId = deletingProject.id;
    setRecentProjects(prev => prev.filter(p => p.id !== projId));

    if (currentProject?.id === projId) {
      const remaining = recentProjects.filter(p => p.id !== projId);
      setCurrentProject(remaining.length > 0 ? remaining[0] : null);
    }

    showToast(`Deleted "${deletingProject.name}"`);
    setDeletingProject(null);
  };

  const activeFrameworkBackend = currentProject
    ? generateFrameworkBackend(selectedFramework, currentProject)
    : generateFrameworkBackend(selectedFramework, {
        id: 'proj_default',
        name: 'Enterprise API Framework',
        description: 'Production API Scaffold',
        createdAt: '2026-08-05',
        prompt: 'Default architecture',
        config: DEFAULT_ARCHITECT_CONFIG,
        endpoints: [],
        databaseSchema: { tables: [] },
        folderStructure: [],
        openApiJson: '{}',
        openApiYaml: '',
        documentationMarkdown: '',
        stats: {
          endpointsGenerated: 0,
          schemasCount: 0,
          estimatedTimeSavedHours: 0,
          complexityScore: 50,
          complexityCategory: 'Medium',
          securityScore: 90,
          architectureQuality: 'A+'
        },
        aiReadiness: { score: 90, recommendations: [] },
        suggestions: {
          bestPractices: [],
          security: [],
          performance: [],
          naming: [],
          versioning: [],
          restDesign: []
        }
      });

  return (
    <div className="min-h-screen bg-black text-slate-100 pt-24 sm:pt-28 md:pt-32 pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-20 relative overflow-hidden font-sans">
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-mora-500/5 blur-[140px] pointer-events-none rounded-full"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark-900 border border-mora-500/50 text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center gap-3 animate-slide-up backdrop-blur-xl">
          <Sparkles className="text-mora-400 size-4 animate-spin" />
          <span className="text-xs font-mono font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <ShortcutsModal isOpen={isShortcutSheetOpen} onClose={() => setIsShortcutSheetOpen(false)} />
      <DeleteModal project={deletingProject} onCancel={() => setDeletingProject(null)} onConfirm={confirmDeleteProject} />
      <LiveRunnerModal
        isOpen={isLiveRunnerOpen}
        onClose={() => setIsLiveRunnerOpen(false)}
        project={currentProject}
        onCopy={(text, label) => showToast(`Copied ${label} to clipboard!`)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <BackButton to="/" />

        {/* HERO SECTION */}
        <Hero onOpenShortcuts={() => setIsShortcutSheetOpen(true)} />

        {/* MAIN WORKSPACE FORM */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <PromptWorkspace
            promptText={promptText}
            setPromptText={setPromptText}
            onClearText={() => {
              setPromptText('');
              showToast('Text cleared');
            }}
            onChipClick={handleChipClick}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generationStep={generationStep}
          />

          <AdvancedConfig
            config={config}
            setConfig={setConfig}
            isAdvancedOpen={isAdvancedOpen}
            setIsAdvancedOpen={setIsAdvancedOpen}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            dropdownRef={dropdownRef}
          />
        </div>

        {/* WORKFLOW TIMELINE SECTION */}
        <CircuitPipeline />

        {/* EXAMPLE PROMPT LIBRARY */}
        <ExampleLibrary onSelectTemplate={handleTemplateClick} />

        {/* RECENT PROJECTS SECTION */}
        <RecentProjects
          recentProjects={recentProjects}
          projectSearch={projectSearch}
          setProjectSearch={setProjectSearch}
          currentProject={currentProject}
          onSelectProject={(proj) => {
            setCurrentProject(proj);
            showToast(`Loaded project "${proj.name}"`);
            const el = document.getElementById('output-preview-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onDuplicateProject={handleDuplicateProject}
          onOpenDeleteModal={handleOpenDeleteModal}
        />

        {/* OUTPUT PREVIEW WORKSPACE */}
        {currentProject ? (
          <OutputWorkspace
            currentProject={currentProject}
            previousProject={previousProject}
            selectedFramework={selectedFramework}
            setSelectedFramework={setSelectedFramework}
            activeFrameworkBackend={activeFrameworkBackend}
            onOpenLiveRunner={() => setIsLiveRunnerOpen(true)}
            onCopy={(text, label) => {
              navigator.clipboard.writeText(text);
              showToast(`Copied ${label} to clipboard`);
            }}
            showToast={showToast}
          />
        ) : (
          /* EMPTY STATE WHEN NO PROJECT IS ACTIVE */
          <div className="bg-dark-900/60 border border-dashed border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-mora-500/10 border border-mora-500/30 flex items-center justify-center mx-auto mb-4 text-mora-400">
              <Wand2 size={28} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Your next API starts here</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Describe your idea in the textarea above and let Apives Architect design the complete production architecture, database schema, and OpenAPI specification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApivesArchitect;
