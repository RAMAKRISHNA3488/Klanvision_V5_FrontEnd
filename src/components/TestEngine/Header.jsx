import React from "react";
import { Clock, Shield, Menu } from "lucide-react";

export function Header({
  testName,
  timeLeft,
  formatTime,
  duration,
  questionCount,
  negativeMarking,
  negativeMarks,
  attemptNumber,
  attemptsAllowed,
  orgName,
  orgLogoUrl,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {orgLogoUrl ? (
          <img src={orgLogoUrl} alt="Organization Logo" className="h-8 object-contain" />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm">
            KV
          </div>
        )}
        <div>
          <h2 className="text-sm font-black tracking-wider text-slate-400 uppercase">
            {orgName || "Klanvision Portal"}
          </h2>
          <h1 className="text-base font-bold text-slate-100">{testName || "Online Assessment"}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl">
        <Clock className={`h-5 w-5 ${timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
        <span className={`font-mono text-lg font-black tracking-widest ${timeLeft < 180 ? 'text-red-500 font-black' : 'text-emerald-400'}`}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs text-slate-500 font-medium ml-1">REMAINING</span>
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-400 w-full md:w-auto justify-between md:justify-end">
        <div className="text-right">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Assessment</p>
          <p className="text-slate-200 font-bold">{questionCount} Qs &nbsp;·&nbsp; {duration} Mins</p>
        </div>

        <div className="text-right border-l border-slate-800 pl-6">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Attempts</p>
          <p className="text-slate-200 font-bold">
            #{attemptNumber} {attemptsAllowed ? `/ ${attemptsAllowed}` : ""}
          </p>
        </div>

        {negativeMarking && (
          <div className="text-right border-l border-slate-800 pl-6 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-amber-500 font-bold uppercase tracking-wider text-[9px]">Negative Marking</p>
              <p className="text-slate-200 font-bold">-{negativeMarks || 0.25} / Wrong</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
