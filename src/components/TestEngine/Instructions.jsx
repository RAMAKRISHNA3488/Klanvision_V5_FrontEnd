import React from "react";
import { ShieldAlert, Play, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

export function Instructions({
  testName,
  duration,
  questionCount,
  negativeMarking,
  negativeMarks,
  sections,
  studentName,
  onStart,
  orgName,
  orgLogoUrl,
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        {/* Header Branding */}
        <div className="bg-slate-900 px-8 py-8 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {orgName || "Klanvision Exam Portal"}
            </h2>
            <h1 className="text-2xl font-black tracking-tight mt-1">{testName || "Online Assessment"}</h1>
          </div>
          {orgLogoUrl ? (
            <img src={orgLogoUrl} alt="Organization Logo" className="h-10 object-contain" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-base shadow-lg">
              KV
            </div>
          )}
        </div>

        {/* Instructions Body */}
        <div className="p-8 flex-1 space-y-8 overflow-y-auto max-h-[60vh]">
          {/* Welcome Student Banner */}
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Student Profile</p>
              <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{studentName || "Guest Student"}</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Exam Duration</p>
              <h4 className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 justify-end">
                <Clock className="h-4.5 w-4.5" />
                {duration || 30} Mins
              </h4>
            </div>
          </div>

          {/* Test Sections Summary Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Assessment Sections</h3>
            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 border-b border-slate-150 dark:border-slate-800 font-bold">
                    <th className="p-4 uppercase tracking-wider">Section Name</th>
                    <th className="p-4 uppercase tracking-wider text-center">Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((sec, i) => (
                    <tr key={sec.id || i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 font-medium">
                      <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{sec.name}</td>
                      <td className="p-4 text-center font-bold text-slate-800 dark:text-slate-200">{sec.questions.length}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/50 dark:bg-slate-950/20 font-black border-t border-slate-150 dark:border-slate-800">
                    <td className="p-4 text-slate-800 dark:text-slate-200">Total Assessment Scope</td>
                    <td className="p-4 text-center text-indigo-600 dark:text-indigo-400">{questionCount} Questions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety rules and security notice */}
          <div className="space-y-5">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rules & Security Protocol</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2.5">
                <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                  Navigation Locks
                </h5>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
                  You are prohibited from exiting fullscreen or switching browser tabs. Exiting fullscreen mode or switching tabs will flag security alerts.
                </p>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2.5">
                <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                  Auto-Submission
                </h5>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
                  A maximum of 3 security flags are allowed. The 3rd alert will result in immediate automatic submission of the test.
                </p>
              </div>

              {negativeMarking && (
                <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-2.5 md:col-span-2 bg-amber-50/10 dark:bg-amber-950/5 border-amber-500/10">
                  <h5 className="font-extrabold text-sm text-amber-500 flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
                    Negative Marking Active
                  </h5>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
                    Each incorrect answer carries a negative weight of -{negativeMarks || 0.25} marks. Unanswered questions do not attract negative scores. Answer carefully.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={16} /> Closed Book Session
          </div>
          <Button
            onClick={onStart}
            className="flex items-center gap-2 py-6 px-8 font-black uppercase tracking-widest text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20"
          >
            <Play className="h-4 w-4 fill-current" />
            Start Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
