import React from "react";
import { Clock, Shield, Menu, Camera, Mic, Maximize2, Wifi, ShieldAlert } from "lucide-react";

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
  // Proctoring and connection indicators
  isOnline = true,
  isCameraActive = true,
  isMicActive = true,
  isFullscreenActive = true,
  violationsCount = 0,
  enableProctoring = false
}) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex flex-col gap-4 sticky top-0 z-30 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Organization branding */}
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

        {/* Timer */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl">
          <Clock className={`h-5 w-5 ${timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <span className={`font-mono text-lg font-black tracking-widest ${timeLeft < 180 ? 'text-red-500 font-black' : 'text-emerald-400'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-slate-500 font-medium ml-1">REMAINING</span>
        </div>

        {/* Info badges */}
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
      </div>

      {/* Live proctor monitoring status bar */}
      {enableProctoring && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-3 text-[11px] font-bold text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-500 tracking-wider text-[10px] uppercase">PROCTOR MONITORING:</span>
            
            {/* Connection Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/30 border border-slate-800">
              <Wifi className={`h-3.5 w-3.5 ${isOnline ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`} />
              <span>Network:</span>
              <span className={isOnline ? 'text-emerald-400' : 'text-red-400 animate-pulse'}>
                {isOnline ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Camera Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/30 border border-slate-800">
              <Camera className={`h-3.5 w-3.5 ${isCameraActive ? 'text-emerald-500' : 'text-red-500'}`} />
              <span>Camera:</span>
              <span className={isCameraActive ? 'text-emerald-400' : 'text-red-400'}>
                {isCameraActive ? 'Active' : 'Missing'}
              </span>
            </div>

            {/* Microphone Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/30 border border-slate-800">
              <Mic className={`h-3.5 w-3.5 ${isMicActive ? 'text-emerald-500' : 'text-red-500'}`} />
              <span>Microphone:</span>
              <span className={isMicActive ? 'text-emerald-400' : 'text-red-400'}>
                {isMicActive ? 'Active' : 'Missing'}
              </span>
            </div>

            {/* Fullscreen Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/30 border border-slate-800">
              <Maximize2 className={`h-3.5 w-3.5 ${isFullscreenActive ? 'text-emerald-500' : 'text-red-500 animate-bounce'}`} />
              <span>Fullscreen:</span>
              <span className={isFullscreenActive ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                {isFullscreenActive ? 'Locked' : 'Unlocked'}
              </span>
            </div>
          </div>

          {/* Warnings alert tally */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400">
            <ShieldAlert className="h-4 w-4" />
            <span>Security Violations:</span>
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-xs">
              {violationsCount} / 3
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
