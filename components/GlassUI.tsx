import React from 'react';

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  gradient?: string; 
  [key: string]: any;
}

export const GlassCard: React.FC<BaseProps> = ({ children, className = '', gradient, ...props }) => {
  // Ultra-transparent glass style
  // bg-white/10 to bg-white/20 provides that "floating" look
  // backdrop-blur-xl creates the frosted effect
  // border-white/30 defines the edges
  const bgClass = 'bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]';

  return (
    <div 
      className={`rounded-[2rem] p-8 transition-all duration-300 relative overflow-hidden ${bgClass} ${className}`}
      {...props}
    >
      {/* Optional: Subtle gloss gradient overlay for extra "glass" feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-50"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// GlassIcon: Clean, minimal, circular
export const GlassIcon: React.FC<{ icon: React.ReactNode; color?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  icon, color = 'white', size = 'md' 
}) => {
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const innerSizeClasses = {
     sm: 'w-5 h-5',
     md: 'w-8 h-8',
     lg: 'w-10 h-10'
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-all duration-300`}>
       <div className={`${innerSizeClasses[size]} text-slate-800`}>
          {React.cloneElement(icon as React.ReactElement<any>, { width: '100%', height: '100%', strokeWidth: 2 } as any)}
       </div>
    </div>
  );
};

export const GlassInput: React.FC<BaseProps & { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; multiline?: boolean; label?: string; suggestions?: string[] }> = ({ 
  value, onChange, type = 'text', placeholder, multiline = false, label, suggestions, className = '', ...props 
}) => {
  const baseClasses = `w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-500/70 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all duration-300 shadow-sm ${className}`;
  const listId = React.useId();

  const container = (child: React.ReactNode) => (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</label>}
      {child}
    </div>
  );

  if (multiline) {
    return container(
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} min-h-[120px] resize-none`}
        {...props}
      />
    );
  }
  return container(
    <>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={baseClasses}
        list={suggestions ? listId : undefined}
        {...props}
      />
      {suggestions && (
        <datalist id={listId}>
          {suggestions.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      )}
    </>
  );
};

export const GlassSlider: React.FC<BaseProps & { value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min: number; max: number; step?: number; label?: string; suffix?: string }> = ({
  value, onChange, min, max, step = 1, label, suffix = '', className = '', ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-end">
         {label && <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</label>}
         <span className="text-sm font-bold text-slate-800">{value}{suffix}</span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-slate-800 hover:accent-slate-700"
        {...props}
      />
    </div>
  );
};

export const GlassImageUpload: React.FC<BaseProps & { images: string[]; onAdd: (files: FileList) => void; onRemove: (index: number) => void; maxImages?: number; label?: string }> = ({
  images, onAdd, onRemove, maxImages = 5, label = 'Reference Images', className = ''
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files);
    }
    if (e.target.value) e.target.value = '';
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-2 block">
        {label} ({images.length}/{maxImages})
      </label>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-white/50 shadow-sm group">
            <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => onRemove(idx)}
              className="absolute top-1 right-1 bg-black/40 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-white/50 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white transition-all text-slate-500 hover:text-slate-700"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
              multiple
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        )}
      </div>
    </div>
  );
};

export const GlassIdeaGenerator: React.FC<BaseProps & { onPromptGenerated: (text: string) => void; isLoading?: boolean; label?: string; loadingLabel?: string; buttonLabel?: string }> = ({
  onPromptGenerated, isLoading = false, label = 'Prompt Idea', loadingLabel = 'Analyzing...', buttonLabel = 'Analyze', className = ''
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onPromptGenerated(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target.value) e.target.value = '';
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-2 block">
        {label}
      </label>
      <div 
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`
           relative h-20 rounded-xl border border-white/50 bg-white/5 backdrop-blur-md
           flex items-center justify-center cursor-pointer transition-all hover:bg-white/10 hover:border-white
           ${isLoading ? 'opacity-80 cursor-wait' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex flex-col items-center gap-1 text-slate-700">
             <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-bold uppercase tracking-wider">{loadingLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
            {/* Requested 2-Star Sparkle Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              {/* Large Star */}
              <path d="M10 2L12.5 8L19 10L12.5 12L10 18L7.5 12L1 10L7.5 8L10 2Z" />
              {/* Small Star */}
              <path d="M19 14L20 17L23 18L20 19L19 22L18 19L15 18L18 17L19 14Z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{buttonLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const GlassButton: React.FC<BaseProps & { onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean }> = ({ 
  children, onClick, variant = 'primary', disabled = false, className = '', ...props 
}) => {
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      // Updated primary button to be dark/slate for contrast against light glass
      variantClasses = 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10';
      break;
    case 'secondary':
      // Transparent glass button
      variantClasses = 'bg-white/30 hover:bg-white/50 text-slate-800 border border-white/50 shadow-sm backdrop-blur-md';
      break;
    case 'danger':
      variantClasses = 'bg-red-500/80 hover:bg-red-500 text-white border border-red-400';
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden px-6 py-4 rounded-xl font-bold tracking-wide transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]
        flex items-center justify-center gap-2
        ${variantClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassSelect: React.FC<BaseProps & { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; label?: string }> = ({
  value, onChange, options, label, className = '', ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
       {label && <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all duration-300 cursor-pointer shadow-sm ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-800 bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};