import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: React.ElementType; // Optional icon to display inside the trigger
  className?: string; // Container class
  triggerClassName?: string; // specific styling for the button
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option", 
  icon: Icon,
  className,
  triggerClassName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option click
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-left focus:border-mora-500/50 focus:outline-none transition-all flex items-center justify-between group hover:border-white/20 hover:bg-white/5 ${triggerClassName || ''} ${isOpen ? 'border-mora-500/50 ring-1 ring-mora-500/50' : ''}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
            {Icon && <Icon size={16} className={value ? "text-white" : "text-slate-500"} />}
            <span className={`block truncate ${value ? "text-white" : "text-slate-500"}`}>
                {value || placeholder}
            </span>
        </div>
        <ChevronDown 
            size={16} 
            className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-mora-500' : 'group-hover:text-white'}`} 
        />
      </button>

      {isOpen && (
        <div 
            className="absolute top-full left-0 w-full mt-2 bg-dark-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-slide-up origin-top backdrop-blur-xl ring-1 ring-white/5"
            ref={listRef}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between transition-all duration-200 group ${
                    value === option 
                    ? 'bg-mora-500/10 text-mora-500 font-medium' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {value === option && <Check size={14} className="flex-shrink-0 animate-fade-in" />}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};