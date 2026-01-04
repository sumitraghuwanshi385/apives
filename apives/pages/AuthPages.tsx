import { apiService } from '../services/apiClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Cpu, Radio, ShieldCheck, Key, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BackButton } from '../components/BackButton';

type AuthView = 'login' | 'signup' | 'forgot' | 'verify' | 'reset';

interface PasswordInputProps {
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showPasswordError: boolean;
  setShowPasswordError: (show: boolean) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, onChange, placeholder, showPassword, setShowPassword, showPasswordError, setShowPasswordError 
}) => (
    <div className="space-y-2">
        <div className="relative group/input">
            <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={value} 
                onChange={(e) => { 
                    onChange(e.target.value); 
                    if (showPasswordError && e.target.value.length >= 8) setShowPasswordError(false);
                }}
                className={`w-full bg-black/50 border rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-1 transition-all placeholder-slate-700 pr-10 ${
                    showPasswordError 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-white/10 focus:border-mora-500 focus:ring-mora-500'
                }`} 
                placeholder={placeholder} 
            />
            <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${showPasswordError ? 'text-red-400' : 'text-slate-600'}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ease-out ${showPasswordError ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
             <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 animate-slide-up">
                <div className="min-w-[20px] h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle size={12} className="text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                    Security Protocol: Minimum 8 Characters Required
                </span>
             </div>
        </div>
        {!showPasswordError && value.length >= 8 && (
             <div className="flex items-center gap-2 px-1 animate-fade-in">
                 <CheckCircle2 size={12} className="text-mora-500" />
                 <span className="text-[10px] font-bold text-mora-500 uppercase tracking-wide">Strong Key Detected</span>
             </div>
        )}
    </div>
);

export const AccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showPasswordError, setShowPasswordError] = useState(false);
  const isPasswordValid = password.length >= 8;

  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
        interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Loading Animation Utility
  const loadingPhrases = {
      forgot: ["Checking database...", "Sending secure token...", "Sent"],
      verify: ["Authenticating...", "Verified"],
      reset: ["Updating credentials...", "Success"]
  };

  const cycleLoadingText = (type: keyof typeof loadingPhrases, onComplete: () => void) => {
      setLoading(true);
      const phrases = loadingPhrases[type];
      let i = 0;
      setLoadingText(phrases[0]);
      
      const interval = setInterval(() => {
          i++;
          if (i < phrases.length) {
              setLoadingText(phrases[i]);
          } else {
              clearInterval(interval);
              setTimeout(() => {
                  setLoading(false);
                  onComplete();
              }, 500);
          }
      }, 800);
  };

  // --- INTEGRATED LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!isPasswordValid) {
        setShowPasswordError(true);
        return;
    }

    setLoading(true);
    setLoadingText("Establishing secure link...");

    try {
        // CALLING BACKEND
        const data = await apiService.login({ email, password });

        // Save Token & User Info
        localStorage.setItem('mora_user', JSON.stringify({ 
            ...data.user, 
            token: data.token 
        }));

        window.dispatchEvent(new CustomEvent('auth-change'));
        
        const params = new URLSearchParams(window.location.search);
        navigate(params.get('returnUrl') || '/provider');
        
    } catch (err: any) {
        // Show Backend Error
        const msg = err.response?.data?.message || "Authentication Failed";
        alert(msg); // You can use a toast or state here if you prefer
    } finally {
        setLoading(false);
    }
  };

  // --- INTEGRATED SIGNUP ---
  const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!isPasswordValid) {
          setShowPasswordError(true);
          return;
      }

      setLoading(true);
      setLoadingText("Creating identity node...");
      
      try {
        // CALLING BACKEND
        const data = await apiService.register({ name, email, password });

        // Save Token & User Info
        localStorage.setItem('mora_user', JSON.stringify({ 
            ...data.user, 
            token: data.token 
        }));

        window.dispatchEvent(new CustomEvent('auth-change'));
        navigate('/onboarding');
        
      } catch (err: any) {
        // Show Backend Error
        const msg = err.response?.data?.message || "Registration Failed";
        alert(msg);
      } finally {
        setLoading(false);
      }
  };

  // --- Mock Functions for Forgot/Reset (Backend Pending) ---
  const handleForgot = async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage('');
      setLoading(true);
      setLoadingText("Locating identity node...");

      try {
          await apiService.forgotPassword(email);
          setView('verify');
          setResendTimer(30);
          setSuccessMessage(`Token dispatched to ${email}`);
      } catch (err: any) {
          const msg = err.response?.data?.message || "Transmission failed.";
          alert(msg); // Or use a toast
      } finally {
          setLoading(false);
      }
  };

  const handleVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setLoadingText("Verifying token integrity...");

      try {
          await apiService.verifyOtp(email, verificationCode);
          setView('reset');
          setSuccessMessage('Token verified. Initialize new key.');
      } catch (err: any) {
          const msg = err.response?.data?.message || "Invalid token.";
          alert(msg);
          setVerificationCode('');
      } finally {
          setLoading(false);
      }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setLoadingText("Re-dispatching protocol...");
    try {
        await apiService.forgotPassword(email);
        setResendTimer(30);
    } catch (err) {
        alert("Failed to resend.");
    } finally {
        setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword.length < 8) return; 

      setLoading(true);
      setLoadingText("Overwriting security protocols...");

      try {
          await apiService.resetPassword(email, verificationCode, newPassword);
          setSuccessMessage('Credentials reset successfully. Please sign in.');
          
          setTimeout(() => {
              setView('login');
              setPassword(''); 
              setNewPassword('');
              setVerificationCode('');
          }, 2000);
      } catch (err: any) {
          alert(err.response?.data?.message || "Reset failed.");
      } finally {
          setLoading(false);
      }
  };

  const renderForm = () => {
      switch(view) {
          case 'login':
              return (
                <form className="space-y-5 animate-fade-in" onSubmit={handleLogin}>
                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-start gap-3 animate-fade-in">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-green-200">{successMessage}</p>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Grid Email</label>
                        <div className="relative group/input">
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all placeholder-slate-700" placeholder="developer@grid.com" />
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1 ml-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Key</label>
                            <button type="button" onClick={() => { setView('forgot'); setSuccessMessage(''); }} className="text-[10px] text-mora-500 hover:text-mora-400 font-bold uppercase tracking-wide">Recover Key?</button>
                        </div>
                        <PasswordInput 
                            value={password} 
                            onChange={setPassword} 
                            placeholder="••••••••" 
                            showPassword={showPassword} 
                            setShowPassword={setShowPassword} 
                            showPasswordError={showPasswordError}
                            setShowPasswordError={setShowPasswordError}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-mora-600 text-white font-bold text-sm py-3 rounded-full hover:bg-mora-500 transition-all flex items-center justify-center mt-6 shadow-lg shadow-mora-500/20 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processing...' : <><span className="mr-2">Initiate Access</span> <ArrowRight size={16} /></>}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-6">
                        New builder? <button type="button" onClick={() => { setView('signup'); setPassword(''); setShowPasswordError(false); setSuccessMessage(''); }} className="text-white font-bold hover:text-mora-400 ml-1">Initialize Identity</button>
                    </p>
                </form>
              );
          case 'signup':
              return (
                <form className="space-y-5 animate-fade-in" onSubmit={handleSignup}>
                     <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Legal Name</label>
                        <div className="relative group/input">
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all placeholder-slate-700" placeholder="Rohan Sharma" />
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Grid Email</label>
                        <div className="relative group/input">
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all placeholder-slate-700" placeholder="rohan@company.in" />
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Secure Access Key</label>
                        <PasswordInput 
                            value={password} 
                            onChange={setPassword} 
                            placeholder="Create a high-entropy key" 
                            showPassword={showPassword} 
                            setShowPassword={setShowPassword} 
                            showPasswordError={showPasswordError}
                            setShowPasswordError={setShowPasswordError}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-mora-600 text-white font-bold text-sm py-3 rounded-full hover:bg-mora-500 transition-all flex items-center justify-center mt-6 shadow-lg shadow-mora-500/20 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processing...' : <><span className="mr-2">Create Identity</span> <ArrowRight size={16} /></>}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-6">
                        Already in the grid? <button type="button" onClick={() => { setView('login'); setPassword(''); setShowPasswordError(false); }} className="text-white font-bold hover:text-mora-400 ml-1">Access Node</button>
                    </p>
                </form>
              );
          case 'forgot':
               return (
                <form className="space-y-5 animate-fade-in" onSubmit={handleForgot}>
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3 border border-white/10">
                            <ShieldCheck className="text-mora-500" size={24} />
                        </div>
                        <h3 className="text-white font-bold">Identity Recovery</h3>
                        <p className="text-xs text-slate-400 mt-1">Request a temporal access token via your registered grid mailbox.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Registered Email</label>
                        <div className="relative group/input">
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all placeholder-slate-700" placeholder="developer@grid.com" />
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-mora-600 text-white font-bold text-sm py-3 rounded-full hover:bg-mora-500 transition-all flex items-center justify-center mt-6 shadow-lg shadow-mora-500/20 uppercase tracking-wide">
                         {loading ? 'Processing...' : 'Request Token'}
                    </button>
                    <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wide mt-4">Return to Gateway</button>
                </form>
               );
          case 'verify':
               return (
                <form className="space-y-5 animate-fade-in" onSubmit={handleVerify}>
                     <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3 border border-white/10">
                            <Key className="text-yellow-500" size={24} />
                        </div>
                        <h3 className="text-white font-bold">Verify Link</h3>
                        <p className="text-xs text-slate-400 mt-1">Enter the temporal token dispatched to <span className="text-white">{email}</span></p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Temporal Token</label>
                        <div className="relative group/input">
                            <input type="text" required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-mora-500 focus:ring-1 focus:ring-mora-500 transition-all placeholder-slate-700 tracking-[0.5em] text-center font-mono font-bold" placeholder="000000" />
                            <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-mora-600 text-white font-bold text-sm py-3 rounded-full hover:bg-mora-500 transition-all flex items-center justify-center mt-6 shadow-lg shadow-mora-500/20 uppercase tracking-wide">
                         {loading ? 'Processing...' : 'Verify Token'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className={`w-full text-xs font-bold uppercase tracking-wide mt-4 flex items-center justify-center gap-2 ${resendTimer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-500 hover:text-white'}`}
                    >
                        {resendTimer > 0 ? (
                            <>
                                <Clock size={12} /> Dispatch available in {resendTimer}s
                            </>
                        ) : (
                            'Resend Token'
                        )}
                    </button>
                    <button type="button" onClick={() => setView('forgot')} className="w-full text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wide mt-2">Modify Target Mailbox</button>
                </form>
               );
           case 'reset':
               return (
                <form className="space-y-5 animate-fade-in" onSubmit={handleReset}>
                     <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3 border border-white/10">
                            <RefreshCw className="text-mora-500" size={24} />
                        </div>
                        <h3 className="text-white font-bold">New Grid Key</h3>
                        <p className="text-xs text-slate-400 mt-1">Secure your identity with a fresh high-entropy key.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">New Key</label>
                        <PasswordInput 
                            value={newPassword} 
                            onChange={setNewPassword} 
                            placeholder="Fresh high-entropy key" 
                            showPassword={showPassword} 
                            setShowPassword={setShowPassword} 
                            showPasswordError={false}
                            setShowPasswordError={() => {}}
                        />
                    </div>
                    <button type="submit" disabled={loading || newPassword.length < 8} className="w-full bg-mora-600 text-white font-bold text-sm py-3 rounded-full hover:bg-mora-500 transition-all flex items-center justify-center mt-6 shadow-lg shadow-mora-500/20 uppercase tracking-wide disabled:opacity-50">
                         {loading ? 'Processing...' : 'Commit New Key'}
                    </button>
                </form>
               );
      }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans selection:bg-mora-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-mora-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-8 left-6 md:left-12 z-30">
         <BackButton to="/" />
      </div>

      <div className="relative z-20 w-full max-w-md px-6">
        <div className="text-center mb-8">
           <img 
              src="https://i.postimg.cc/Fsby98j9/IMG-20251219-132426.png" 
              alt="Apives Logo" 
              className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-[0_0_35px_rgba(34,197,94,0.4)] hover:scale-105 transition-transform duration-500"
            />
           
           <div className="mb-6 flex justify-center h-8">
                <span className={`flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-mono border uppercase tracking-widest transition-all duration-500 animate-fade-in ${
                    view === 'signup'
                    ? 'bg-mora-500/10 border-mora-500/30 text-mora-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                }`}>
                    {view === 'signup' ? (
                        <>
                            <Cpu size={12} className="animate-pulse" /> GRID_IDENTITY_PROTOCOL_INIT
                        </>
                    ) : (
                        <>
                            <Radio size={12} className="animate-pulse" /> {loading ? 'SIGNAL_LOCKED' : 'GATEWAY_READY'}
                        </>
                    )}
                </span>
           </div>

           <h2 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
               {view === 'signup' ? 'Initialize Node' : view === 'login' ? 'Access Gateway' : 'Identity Sync'}
           </h2>
           <p className="text-slate-400 text-sm">
             {view === 'signup' ? 'Register your signature on the global grid.' : view === 'login' ? 'Authenticate to interface with grid endpoints.' : 'Sync your neural link to the grid.'}
           </p>
        </div>

        <div className="bg-dark-950/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mora-500/50 to-transparent"></div>

            {loading && loadingText && (
                <div className="absolute inset-0 z-50 bg-dark-950/95 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-mora-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]"></div>
                    <div className="text-slate-300 text-sm font-medium tracking-wide animate-pulse">{loadingText}</div>
                </div>
            )}

            {renderForm()}
        </div>
      </div>
    </div>
  );
};