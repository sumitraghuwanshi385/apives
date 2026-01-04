import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, ArrowRight, Check, Search, Share2, MessageCircle, Globe, Code, Zap, Layout, Sparkles } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Builder');
  
  // Phases: 'terminal' | 'wizard'
  const [phase, setPhase] = useState<'terminal' | 'wizard'>('terminal');
  
  // Terminal State
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Wizard State
  const [step, setStep] = useState(1); // 1: Welcome, 2: Goal, 3: Referral
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedReferral, setSelectedReferral] = useState<string>('');

  // Terminal Logs Data
  const logMessages = [
    "Initializing secure connection...",
    "Verifying user credentials...",
    "Allocating grid resources...",
    "Syncing with local node...",
    "Connection established.",
    "Welcome to the Apives ecosystem."
  ];

  useEffect(() => {
    // Check Auth
    const user = localStorage.getItem('mora_user');
    if (!user) {
        navigate('/access');
        return;
    }

    // AUTH MEMORY LOGIC: If onboarding already completed, redirect to dashboard
    if (localStorage.getItem('mora_onboarding_complete') === 'true') {
        navigate('/provider', { replace: true });
        return;
    }

    const parsed = JSON.parse(user);
    setUserName(parsed.name || 'Builder');

    // Run Terminal Sequence
    let delay = 0;
    logMessages.forEach((msg, index) => {
        delay += Math.random() * 500 + 400; // Random delay between lines
        setTimeout(() => {
            setLogs(prev => [...prev, `> ${msg}`]);
            // Auto scroll to bottom
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
        }, delay);
    });

    // Switch to Wizard after logs finish
    setTimeout(() => {
        setPhase('wizard');
    }, delay + 1000);

  }, [navigate]);

  const handleNext = () => {
      if (step < 3) {
          setStep(step + 1);
      } else {
          // AUTH MEMORY LOGIC: Set flag on completion
          localStorage.setItem('mora_onboarding_complete', 'true');
          navigate('/provider');
      }
  };

  // --- RENDERERS ---

  if (phase === 'terminal') {
      return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 relative overflow-hidden font-mono">
            {/* Matrix Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
            
            <div className="w-full max-w-lg z-10">
                <div className="bg-dark-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-mora-500/10">
                    {/* Terminal Header */}
                    <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 ml-2">apives_terminal — -zsh</span>
                    </div>
                    {/* Terminal Body */}
                    <div 
                        ref={terminalRef}
                        className="p-6 h-64 overflow-y-auto text-sm space-y-2 custom-scrollbar"
                    >
                        {logs.map((log, i) => (
                            <div key={i} className="text-mora-400 animate-fade-in">
                                {log}
                            </div>
                        ))}
                        <div className="text-mora-500 animate-pulse">_</div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // WIZARD PHASE
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-black to-black"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-mora-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 animate-slide-up">
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-mora-500' : 'w-2 bg-white/10'}`}></div>
                ))}
            </div>

            <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                
                {/* STEP 1: WELCOME */}
                {step === 1 && (
                    <div className="text-center animate-fade-in">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <Sparkles size={32} className="text-yellow-400" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-3">Welcome, {userName}!</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            We are excited to have you on the grid. Let's get your personal dashboard ready in just a few seconds.
                        </p>
                        <button onClick={handleNext} className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group">
                            Let's Start <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                )}

                {/* STEP 2: GOAL */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-display font-bold text-white mb-2">What's your goal?</h2>
                        <p className="text-slate-400 text-sm mb-6">This helps us customize your experience.</p>
                        
                        <div className="space-y-3 mb-8">
                            {[
                                { id: 'build', label: 'I want to build apps', icon: Code, desc: 'Find APIs to use' },
                                { id: 'host', label: 'I want to sell APIs', icon: Zap, desc: 'Monetize my code' },
                                { id: 'explore', label: 'Just exploring', icon: Layout, desc: 'Looking around' }
                            ].map((option) => (
                                <div 
                                    key={option.id}
                                    onClick={() => setSelectedGoal(option.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedGoal === option.id ? 'bg-mora-500/10 border-mora-500' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                                >
                                    <div className={`p-2 rounded-lg ${selectedGoal === option.id ? 'bg-mora-500 text-black' : 'bg-white/10 text-slate-300'}`}>
                                        <option.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-sm ${selectedGoal === option.id ? 'text-white' : 'text-slate-200'}`}>{option.label}</h3>
                                        <p className="text-xs text-slate-500">{option.desc}</p>
                                    </div>
                                    {selectedGoal === option.id && <Check size={18} className="text-mora-500 ml-auto" />}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleNext} 
                            disabled={!selectedGoal}
                            className="w-full bg-mora-600 text-white font-bold py-3.5 rounded-full hover:bg-mora-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* STEP 3: SOURCE (One last thing) */}
                {step === 3 && (
                    <div className="animate-fade-in">
                         <div className="mb-6">
                            <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">One last thing</span>
                            <h2 className="text-2xl font-display font-bold text-white">Where did you hear about us?</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { id: 'social', label: 'Social Media', icon: Share2 },
                                { id: 'friend', label: 'Friend', icon: MessageCircle },
                                { id: 'search', label: 'Google Search', icon: Search },
                                { id: 'other', label: 'Other', icon: Globe },
                            ].map((option) => (
                                <div 
                                    key={option.id}
                                    onClick={() => setSelectedReferral(option.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center h-28 ${selectedReferral === option.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                                >
                                    <option.icon size={24} className={selectedReferral === option.id ? 'text-black' : 'text-slate-400'} />
                                    <span className={`text-xs font-bold ${selectedReferral === option.id ? 'text-black' : 'text-slate-300'}`}>{option.label}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleNext} 
                            // Allow skipping if they don't want to say, so distinct style if empty
                            className={`w-full font-bold py-3.5 rounded-full transition-all ${selectedReferral ? 'bg-mora-600 text-white hover:bg-mora-500' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            {selectedReferral ? 'Complete Setup' : 'Skip & Finish'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};