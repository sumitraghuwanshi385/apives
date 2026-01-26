import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, LayoutDashboard, LogOut, Radio, Home as HomeIcon, Search, PlusCircle, Cpu, ShieldCheck, Box, Trophy, Zap } from 'lucide-react';

const NavLink = ({ to, children, icon: Icon }: React.PropsWithChildren<{ to: string; icon?: React.ElementType }>) => (
  <Link to={to} className="relative group text-slate-400 hover:text-white transition-colors px-4 py-2 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
    {Icon && <Icon size={14} className="text-mora-500/70 group-hover:text-mora-500 transition-colors" />}
    {children}
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-mora-500 transition-all group-hover:w-1/2 duration-300 rounded-full"></span>
  </Link>
);

const MobileNavLink = ({ to, children, onClick, icon: Icon }: React.PropsWithChildren<{ to: string; onClick: () => void; icon: React.ElementType }>) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-300 hover:text-mora-400 hover:bg-mora-500/5 border border-transparent hover:border-white/10 transition-all uppercase tracking-wide">
    <Icon size={13} className="text-mora-500/60" />
    {children}
  </Link>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/access';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const checkAuth = () => {
        setIsAuthenticated(!!localStorage.getItem('mora_user'));
    };
    checkAuth();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
      setIsLoggingOut(true);
      setTimeout(() => {
          localStorage.removeItem('mora_user');
          setIsAuthenticated(false);
          setIsLoggingOut(false);
          setIsOpen(false);
          navigate('/');
      }, 1000);
  };

  if (isAuthPage) return null;

  const navContainerStyle = isScrolled && !isOpen
    ? "top-4 md:top-6 w-[92%] max-w-7xl rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] py-1.5 md:py-2" 
    : isOpen 
        ? "top-0 w-full bg-black border-b border-white/10 py-2.5 md:py-4" 
        : "top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-sm py-2 md:py-3";

  return (
    <>
      {isLoggingOut && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
              <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
              <span className="text-white font-mono text-[10px] font-bold uppercase tracking-widest">Logging out...</span>
          </div>
      )}

      <nav className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${navContainerStyle}`}>
        {isScrolled && !isOpen && (
            <div className="absolute inset-0 rounded-full pointer-events-none">
                <div className="absolute top-0 bottom-0 left-0 w-[50%] border-l-[2px] md:border-l-[3.5px] border-mora-500 rounded-l-full shadow-[-15px_0_30px_-5px_rgba(34,197,94,0.4)] opacity-90"></div>
                <div className="absolute top-0 bottom-0 right-0 w-[50%] border-r-[2px] md:border-r-[3.5px] border-mora-500 rounded-r-full shadow-[15px_0_30px_-5px_rgba(34,197,94,0.4)] opacity-90"></div>
            </div>
        )}

        <div className="mx-auto px-4 md:px-6 w-full relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                <img 
                  src="https://i.postimg.cc/Fsby98j9/IMG-20251219-132426.png" 
                  alt="Apives Logo" 
                  className="w-9 h-9 md:w-16 md:h-16 object-contain transition-transform group-hover:rotate-12 duration-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                />
              </Link>
              
              <div className="hidden md:flex ml-4 lg:ml-8 space-x-1 border-l border-white/10 pl-4 lg:pl-8">
                <NavLink to="/" icon={HomeIcon}>Home</NavLink>
                <NavLink to="/browse" icon={Search}>Explore APIs</NavLink>
                <NavLink to="/submit" icon={PlusCircle}>Submit API</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden lg:flex items-center space-x-3">
                {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                       <Link to="/provider" className="flex items-center space-x-2 bg-white/5 hover:bg-mora-500/20 border border-white/10 hover:border-mora-500/50 text-slate-300 hover:text-mora-400 px-5 py-2 rounded-full transition-all duration-300">
                          <LayoutDashboard size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Console</span>
                       </Link>
                       <button onClick={handleLogout} className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 p-2.5 rounded-full border border-white/10 transition-all">
                          <LogOut size={14} />
                       </button>
                    </div>
                ) : (
                  <Link to="/access" className="group flex items-center space-x-2 bg-mora-600 hover:bg-mora-500 text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <Terminal size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Access Console</span>
                  </Link>
                )}
              </div>

              {isAuthenticated && (
                <Link to="/provider" className="lg:hidden flex items-center gap-1.5 bg-mora-500/10 border border-mora-500/30 text-mora-400 px-3.5 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-md">
                   <Cpu size={10} /> Console
                </Link>
              )}

              <div className="lg:hidden relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className={`w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full border shadow-lg transition-all duration-300 ${
                    isOpen 
                    ? 'bg-mora-500/20 border-mora-500 text-mora-400' 
                    : 'bg-white/[0.05] backdrop-blur-[20px] border-white/20 text-slate-300 hover:bg-white/[0.1] active:scale-90'
                  }`}
                >
                  {isOpen ? <X size={14} md:size={20} /> : <Menu size={14} md:size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {isOpen && (
          <div className="lg:hidden border-t border-white/10 animate-fade-in bg-black absolute w-full left-0 top-full shadow-2xl overflow-hidden rounded-b-2xl md:rounded-b-3xl">
            <div className="px-4 pt-3 pb-4 space-y-1">
              <MobileNavLink to="/" icon={HomeIcon} onClick={() => setIsOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/browse" icon={Search} onClick={() => setIsOpen(false)}>Explore APIs</MobileNavLink>
              <MobileNavLink to="/fresh" icon={Zap} onClick={() => setIsOpen(false)}>New Releases</MobileNavLink>
              <MobileNavLink to="/popular" icon={Trophy} onClick={() => setIsOpen(false)}>Top Rated</MobileNavLink>
              <MobileNavLink to="/submit" icon={PlusCircle} onClick={() => setIsOpen(false)}>Submit API</MobileNavLink>
              <div className="border-t border-white/10 my-2 opacity-30"></div>
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/provider" icon={LayoutDashboard} onClick={() => setIsOpen(false)}>Console</MobileNavLink>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-wide mt-1"
                  >
                    <LogOut size={13} className="text-red-500/60" /> 
                    Terminate Session
                  </button>
                </>
              ) : (
                <MobileNavLink to="/access" icon={Terminal} onClick={() => setIsOpen(false)}>Access Console</MobileNavLink>
              )}
            </div>
          </div>
        )}
      </nav>
      {!isScrolled && <div className="h-0"></div>}
    </>
  );
};