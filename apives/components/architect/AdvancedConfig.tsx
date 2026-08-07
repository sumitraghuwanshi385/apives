import React from 'react';
import { Layers, Lock, Database, Server, ShieldCheck, Hash, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { ArchitectConfig } from '../../services/architectEngine';

interface AdvancedConfigProps {
  config: ArchitectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ArchitectConfig>>;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (val: boolean) => void;
  activeDropdown: 'auth' | 'database' | 'architecture' | 'apiStyle' | null;
  setActiveDropdown: (val: 'auth' | 'database' | 'architecture' | 'apiStyle' | null) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const AdvancedConfig: React.FC<AdvancedConfigProps> = ({
  config,
  setConfig,
  isAdvancedOpen,
  setIsAdvancedOpen,
  activeDropdown,
  setActiveDropdown,
  dropdownRef,
}) => {
  return (
    <div className="bg-dark-900/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full p-3.5 md:p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-mora-500" />
          <span className="text-[11px] md:text-xs font-mono font-bold text-white uppercase tracking-wider">
            Configuration
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] md:text-[9px] font-mono text-mora-400 bg-mora-500/10 px-2.5 py-0.5 rounded-full border border-mora-500/20 font-semibold tracking-tight shadow-sm">
            v{config.version.major}.{config.version.minor}.{config.version.patch}
          </span>
          {isAdvancedOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </button>

      {isAdvancedOpen && (
        <div ref={dropdownRef} className="p-5 md:p-6 border-t border-white/10 space-y-5 animate-fade-in bg-black/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CUSTOM DROPDOWN: AUTH STANDARD */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} className="text-mora-500" /> Auth Standard
              </label>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'auth' ? null : 'auth')}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 hover:border-mora-500/50 flex items-center justify-between transition-colors"
              >
                <span>{config.auth === 'JWT' ? 'JWT (Bearer)' : config.auth === 'OAuth2' ? 'OAuth 2.0 / OIDC' : config.auth === 'API_Key' ? 'API Key (X-API-Key)' : 'Session Cookie'}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {activeDropdown === 'auth' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-dark-900 border border-mora-500/40 rounded-xl shadow-2xl p-1 z-50 animate-fade-in font-mono text-xs space-y-0.5">
                  {[
                    { value: 'JWT', label: 'JWT (Bearer)' },
                    { value: 'OAuth2', label: 'OAuth 2.0 / OIDC' },
                    { value: 'API_Key', label: 'API Key (X-API-Key)' },
                    { value: 'Session', label: 'Session Cookie' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setConfig({ ...config, auth: opt.value as any });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        config.auth === opt.value ? 'bg-mora-500/20 text-mora-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {config.auth === opt.value && <Check size={12} className="text-mora-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CUSTOM DROPDOWN: DATABASE ENGINE */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database size={12} className="text-mora-500" /> Database Engine
              </label>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'database' ? null : 'database')}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 hover:border-mora-500/50 flex items-center justify-between transition-colors"
              >
                <span>{config.database}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {activeDropdown === 'database' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-dark-900 border border-mora-500/40 rounded-xl shadow-2xl p-1 z-50 animate-fade-in font-mono text-xs space-y-0.5">
                  {['PostgreSQL', 'MongoDB', 'MySQL'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setConfig({ ...config, database: opt as any });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        config.database === opt ? 'bg-mora-500/20 text-mora-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{opt}</span>
                      {config.database === opt && <Check size={12} className="text-mora-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CUSTOM DROPDOWN: PROTOCOL */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server size={12} className="text-mora-500" /> Protocol
              </label>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'architecture' ? null : 'architecture')}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 hover:border-mora-500/50 flex items-center justify-between transition-colors"
              >
                <span>{config.architecture === 'REST' ? 'REST API' : 'GraphQL Schema'}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {activeDropdown === 'architecture' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-dark-900 border border-mora-500/40 rounded-xl shadow-2xl p-1 z-50 animate-fade-in font-mono text-xs space-y-0.5">
                  {[
                    { value: 'REST', label: 'REST API' },
                    { value: 'GraphQL', label: 'GraphQL Schema' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setConfig({ ...config, architecture: opt.value as any });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        config.architecture === opt.value ? 'bg-mora-500/20 text-mora-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {config.architecture === opt.value && <Check size={12} className="text-mora-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CUSTOM DROPDOWN: VISIBILITY */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-mora-500" /> Visibility
              </label>
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'apiStyle' ? null : 'apiStyle')}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 hover:border-mora-500/50 flex items-center justify-between transition-colors"
              >
                <span>{config.apiStyle === 'Public' ? 'Public External' : config.apiStyle === 'Private' ? 'Private Partner' : 'Internal Service'}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {activeDropdown === 'apiStyle' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-dark-900 border border-mora-500/40 rounded-xl shadow-2xl p-1 z-50 animate-fade-in font-mono text-xs space-y-0.5">
                  {[
                    { value: 'Public', label: 'Public External' },
                    { value: 'Private', label: 'Private Partner' },
                    { value: 'Internal', label: 'Internal Service' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setConfig({ ...config, apiStyle: opt.value as any });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        config.apiStyle === opt.value ? 'bg-mora-500/20 text-mora-300 font-bold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {config.apiStyle === opt.value && <Check size={12} className="text-mora-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEMANTIC VERSIONING CONTROLS */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Hash size={12} className="text-mora-500" /> SemVer Version
              </label>
              <div className="flex items-center gap-1 bg-black border border-white/15 rounded-xl p-1 text-xs">
                <div className="flex items-center gap-0.5 px-2 py-1 bg-white/5 rounded-lg w-full justify-center">
                  <span className="text-[10px] text-slate-500 font-mono">v</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={config.version.major}
                    onChange={(e) => setConfig({
                      ...config,
                      version: { ...config.version, major: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-5 bg-transparent text-center font-mono font-bold text-mora-400 focus:outline-none"
                  />
                  <span className="text-slate-600 font-mono">.</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={config.version.minor}
                    onChange={(e) => setConfig({
                      ...config,
                      version: { ...config.version, minor: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-5 bg-transparent text-center font-mono font-bold text-slate-200 focus:outline-none"
                  />
                  <span className="text-slate-600 font-mono">.</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={config.version.patch}
                    onChange={(e) => setConfig({
                      ...config,
                      version: { ...config.version, patch: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-5 bg-transparent text-center font-mono font-bold text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* OUTPUT CHECKBOX TOGGLES */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={(config.outputTypes || ['openapi', 'controllers', 'schema', 'docs']).includes('openapi')}
                onChange={(e) => {
                  const currentTypes = config.outputTypes || ['openapi', 'controllers', 'schema', 'docs'];
                  const types = e.target.checked
                    ? [...currentTypes, 'openapi']
                    : currentTypes.filter(t => t !== 'openapi');
                  setConfig({ ...config, outputTypes: types });
                }}
                className="rounded bg-black border-white/20 text-mora-500 focus:ring-mora-500"
              />
              <span>OpenAPI Spec (v3.1)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={(config.outputTypes || ['openapi', 'controllers', 'schema', 'docs']).includes('controllers')}
                onChange={(e) => {
                  const currentTypes = config.outputTypes || ['openapi', 'controllers', 'schema', 'docs'];
                  const types = e.target.checked
                    ? [...currentTypes, 'controllers']
                    : currentTypes.filter(t => t !== 'controllers');
                  setConfig({ ...config, outputTypes: types });
                }}
                className="rounded bg-black border-white/20 text-mora-500 focus:ring-mora-500"
              />
              <span>Controller Stubs</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={(config.outputTypes || ['openapi', 'controllers', 'schema', 'docs']).includes('schema')}
                onChange={(e) => {
                  const currentTypes = config.outputTypes || ['openapi', 'controllers', 'schema', 'docs'];
                  const types = e.target.checked
                    ? [...currentTypes, 'schema']
                    : currentTypes.filter(t => t !== 'schema');
                  setConfig({ ...config, outputTypes: types });
                }}
                className="rounded bg-black border-white/20 text-mora-500 focus:ring-mora-500"
              />
              <span>Database DDL Schemas</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={(config.outputTypes || ['openapi', 'controllers', 'schema', 'docs']).includes('docs')}
                onChange={(e) => {
                  const currentTypes = config.outputTypes || ['openapi', 'controllers', 'schema', 'docs'];
                  const types = e.target.checked
                    ? [...currentTypes, 'docs']
                    : currentTypes.filter(t => t !== 'docs');
                  setConfig({ ...config, outputTypes: types });
                }}
                className="rounded bg-black border-white/20 text-mora-500 focus:ring-mora-500"
              />
              <span>Markdown API Docs</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
