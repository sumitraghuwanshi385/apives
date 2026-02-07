import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Terminal,
  LayoutDashboard,
  LogOut,
  Home as HomeIcon,
  Search,
  PlusCircle,
  Cpu,
  ShieldCheck,
  Trophy,
  Zap,
} from 'lucide-react';

/* ================= LINKS ================= */

const NavLink = ({
  to,
  children,
  icon: Icon,
}: React.PropsWithChildren<{ to: string; icon?: React.ElementType }>) => (
  <Link
    to={to}
    className="relative group text-slate-400 hover:text-white transition-colors px-4 py-2 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
  >
    {Icon && (
      <Icon
        size={14}
        className="text-mora-500/70 group-hover:text-mora-500 transition-colors"
      />
    )}
    {children}
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-mora-500 transition-all group-hover:w-1/2 duration-300 rounded-full"></span>
  </Link>
);

const MobileNavLink = ({
  to,
  children,
  onClick,
  icon: Icon,
}: React.PropsWithChildren<{
  to: string;
  onClick: () => void;
  icon: React.ElementType;
}>) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-300 hover:text-mora-400 hover:bg-mora-500/5 border border-transparent hover:border-white/10 transition-all uppercase tracking-wide"
  >
    <Icon size={13} className="text-mora-500/60" />
    {children}
  </Link>
);

/* ================= NAVBAR ================= */

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userRaw = localStorage.getItem('mora_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isAdmin = user?.email === 'beatslevelone@gmail.com';

  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/access';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

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

  const navContainerStyle =
    isScrolled && !isOpen
      ? 'top-4 md:top-6 w-[92%] max-w-7xl rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] py-1.5 md:py-2'
      : isOpen
      ? 'top-0 w-full bg-black border-b border-white/10 py-2.5 md:py-4'
      : 'top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-sm py-2 md:py-3';

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">
            Logging out...
          </span>
        </div>
      )}

      <nav
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-700 ${navContainerStyle}`}
      >
        <div className="mx-auto px-4 md:px-6 w-full">
          <div className="flex justify-between items-center">
            {/* LEFT */}
            <div className="flex items-center">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img
                  src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png"
                  alt="Apives"
                  className="w-9 h-9 md:w-16 md:h-16"
                />
              </Link>

              <div className="hidden md:flex ml-6 space-x-1 border-l border-white/10 pl-6">
                <NavLink to="/" icon={HomeIcon}>
                  Home
                </NavLink>
                <NavLink to="/browse" icon={Search}>
                  Explore APIs
                </NavLink>
                <NavLink to="/submit" icon={PlusCircle}>
                  Submit API
                </NavLink>
              </div>
            </div>

            {/* RIGHT DESKTOP */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/provider"
                    className="flex items-center gap-2 bg-white/5 hover:bg-mora-500/20 border border-white/10 hover:border-mora-500/50 text-slate-300 hover:text-mora-400 px-5 py-2 rounded-full"
                  >
                    <LayoutDashboard size={14} />
                    <span className="text-[10px] font-bold uppercase">
                      Console
                    </span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/sponsors"
                      className="flex items-center gap-2 bg-white/5 hover:bg-mora-500/20 border border-white/10 hover:border-mora-500/50 text-slate-300 hover:text-mora-400 px-5 py-2 rounded-full"
                    >
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-bold uppercase">
                        Sponsor Analytics
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-full border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <Link
                  to="/access"
                  className="flex items-center gap-2 bg-mora-600 hover:bg-mora-500 text-white px-6 py-2.5 rounded-full"
                >
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase">
                    Access Console
                  </span>
                </Link>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/20"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden bg-black border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink
                to="/"
                icon={HomeIcon}
                onClick={() => setIsOpen(false)}
              >
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/browse"
                icon={Search}
                onClick={() => setIsOpen(false)}
              >
                Explore APIs
              </MobileNavLink>
              <MobileNavLink
                to="/submit"
                icon={PlusCircle}
                onClick={() => setIsOpen(false)}
              >
                Submit API
              </MobileNavLink>

              {isAuthenticated && (
                <>
                  <MobileNavLink
                    to="/provider"
                    icon={LayoutDashboard}
                    onClick={() => setIsOpen(false)}
                  >
                    Console
                  </MobileNavLink>

                  {isAdmin && (
                    <MobileNavLink
                      to="/admin/sponsors"
                      icon={ShieldCheck}
                      onClick={() => setIsOpen(false)}
                    >
                      Sponsor Analytics
                    </MobileNavLink>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};