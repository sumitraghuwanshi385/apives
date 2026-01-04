import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (to) {
      navigate(to);
      return;
    }

    if (window.history.length > 1 && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className="group relative flex items-center space-x-1.5 md:space-x-2 bg-dark-900/60 hover:bg-white/[0.08] backdrop-blur-xl border border-white/10 px-2.5 py-1.5 md:px-5 md:py-2.5 rounded-full transition-all duration-300 hover:pr-5 md:hover:pr-7 mb-4 md:mb-8 w-fit z-50 cursor-pointer overflow-hidden active:scale-95"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-mora-500 to-transparent opacity-60"></div>
      
      <ArrowLeft size={12} className="md:size-4 text-slate-400 group-hover:text-white transition-colors group-hover:-translate-x-0.5 duration-300 relative z-10" />
      <span className="text-[10px] md:text-sm font-bold md:font-medium text-slate-400 group-hover:text-white relative z-10 uppercase tracking-tighter md:tracking-normal">Return</span>
    </button>
  );
};