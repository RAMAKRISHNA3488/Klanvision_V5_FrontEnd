import React from 'react';

export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div 
        onClick={() => onOpenChange?.(false)} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
      />
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export function AlertDialogContent({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl w-full max-w-lg rounded-3xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children, className = '', ...props }) {
  return <div className={`space-y-2 text-center sm:text-left ${className}`} {...props}>{children}</div>;
}

export function AlertDialogTitle({ children, className = '', ...props }) {
  return <h3 className={`text-lg font-extrabold text-slate-900 dark:text-slate-100 ${className}`} {...props}>{children}</h3>;
}

export function AlertDialogDescription({ children, className = '', ...props }) {
  return <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${className}`} {...props}>{children}</p>;
}

export function AlertDialogFooter({ children, className = '', ...props }) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6 ${className}`} {...props}>{children}</div>;
}

export function AlertDialogCancel({ children, onClick, className = '', ...props }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({ children, onClick, className = '', ...props }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
