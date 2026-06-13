import React from "react";
import { User, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";

export function Sidebar({
  studentName,
  sections,
  currentQuestionIndex,
  answers,
  markedForReview,
  visitedQuestions,
  onNavigate,
  onSubmit,
  disableSubmit,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  // Helpers to check status
  const getQuestionStatus = (qId) => {
    const isAnswered = !!answers[qId];
    const isMarked = !!markedForReview[qId];
    const isVisited = !!visitedQuestions[qId];

    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (isVisited) return "visited";
    return "unvisited";
  };

  // Helper to count total answered
  const answeredTotal = Object.values(answers).filter(val => val !== null && val !== undefined && val !== "").length;
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  // Layout styling classes
  const classes = {
    answered: "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600",
    marked: "bg-purple-600 text-white border-purple-700 hover:bg-purple-700",
    visited: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800 hover:bg-blue-200",
    unvisited: "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800 hover:bg-slate-200",
    active: "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950",
  };

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 lg:relative lg:inset-y-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full transform transition-transform duration-300 ease-in-out select-none
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
    >
      {/* Candidate Profile header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          <User size={20} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Candidate</p>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{studentName}</h3>
        </div>
      </div>

      {/* Navigation sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {sections.map((sec, secIdx) => (
          <div key={sec.id || secIdx} className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {sec.name}
            </h4>
            <div className="grid grid-cols-5 gap-2.5">
              {sec.questions.map((q, idx) => {
                // Find global index in questions array
                const qGlobalIndex = sections.slice(0, secIdx).reduce((sum, s) => sum + s.questions.length, 0) + idx;
                const status = getQuestionStatus(q.id);
                const isActive = currentQuestionIndex === qGlobalIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => onNavigate(qGlobalIndex)}
                    className={`h-9 w-9 text-xs font-bold rounded-lg border flex items-center justify-center transition-all cursor-pointer
                      ${classes[status]} ${isActive ? classes.active : ""}`}
                  >
                    {(qGlobalIndex + 1).toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legends & Finish controls */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 space-y-6">
        {/* Status indicator legends */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
            <span>Answered ({answeredTotal})</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-3.5 w-3.5 rounded bg-purple-600" />
            <span>Marked Review</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-3.5 w-3.5 rounded bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-3.5 w-3.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <span>Unvisited</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            onClick={onSubmit}
            className="w-full py-6 font-bold uppercase tracking-wider text-xs border border-green-600 bg-green-600 text-white hover:bg-green-700 rounded-xl"
          >
            Submit Assessment
          </Button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            <ShieldCheck size={13} /> SECURE WEB BROWSER MONITORED
          </div>
        </div>
      </div>

      {/* Mobile close overlay button */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 -left-80 bg-black/40 z-[-1] backdrop-blur-sm cursor-pointer"
        />
      )}
    </aside>
  );
}
