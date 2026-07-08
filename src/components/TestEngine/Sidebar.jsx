import React, { useState } from "react";
import { User, ShieldCheck, Calculator, FileText, Trash2, X } from "lucide-react";
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
  // Widget states
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [quickNotes, setQuickNotes] = useState("");
  
  // Calculator arithmetic
  const [calcVal, setCalcVal] = useState("");
  const [calcRes, setCalcRes] = useState("");

  // Section Filtering Tabs state
  const [activeSectionFilter, setActiveSectionFilter] = useState("all");

  const handleCalcClick = (btn) => {
    if (btn === "C") {
      setCalcVal("");
      setCalcRes("");
    } else if (btn === "=") {
      try {
        // Safe evaluation of simple math
        const cleaned = calcVal.replace(/[^0-9+\-*/.]/g, "");
        const evaled = new Function(`return ${cleaned}`)();
        setCalcRes(evaled.toString());
      } catch (e) {
        setCalcRes("Error");
      }
    } else {
      setCalcVal(prev => prev + btn);
    }
  };

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
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Candidate</p>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{studentName}</h3>
          </div>
        </div>
      </div>

      {/* Widget utility shortcuts */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3 text-[11px] font-bold text-slate-500">
        <button
          onClick={() => { setShowCalc(!showCalc); setShowNotes(false); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Calculator className="h-3.5 w-3.5 text-indigo-500" /> Calculator
        </button>
        <button
          onClick={() => { setShowNotes(!showNotes); setShowCalc(false); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FileText className="h-3.5 w-3.5 text-amber-500" /> Exam Notes
        </button>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex gap-1.5 border-b border-slate-100 dark:border-slate-800 px-6 py-3 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveSectionFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 transition-colors
            ${activeSectionFilter === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400"}`}
        >
          All
        </button>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSectionFilter(s.id)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 transition-colors
              ${activeSectionFilter === s.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Navigation sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
        {/* Floating Widgets overlay inside panel */}
        {showCalc && (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 z-10 p-5 flex flex-col border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4 w-4" /> Calculator Widget
              </span>
              <button onClick={() => setShowCalc(false)} className="text-slate-400 hover:text-slate-200"><X size={16} /></button>
            </div>
            
            {/* Screen */}
            <div className="bg-slate-950 text-right p-4 rounded-xl mb-4 font-mono select-text">
              <div className="text-slate-500 text-xs truncate h-5">{calcVal || "0"}</div>
              <div className="text-white text-xl font-bold truncate h-7">{calcRes || "0"}</div>
            </div>

            {/* Keys */}
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"].map((k) => (
                <button
                  key={k}
                  onClick={() => handleCalcClick(k)}
                  className={`h-11 rounded-lg border transition-colors cursor-pointer
                    ${k === "=" ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700" :
                      k === "C" ? "bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/40 hover:bg-red-100" :
                      "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100"}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {showNotes && (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 z-10 p-5 flex flex-col border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Personal Scratch Notes
              </span>
              <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-slate-200"><X size={16} /></button>
            </div>
            
            <textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              className="flex-1 w-full p-4 bg-amber-50/20 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
              placeholder="Jot down formulas, code stubs, or notes here. These notes are only saved locally for this attempt..."
            />
            
            <button
              onClick={() => setQuickNotes("")}
              className="mt-4 h-10 w-full rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 font-bold text-xs flex items-center justify-center gap-1.5 bg-red-50/20"
            >
              <Trash2 size={14} /> Clear scratchpad
            </button>
          </div>
        )}

        {/* Question Palette grid */}
        {sections.map((sec, secIdx) => {
          // If a section filter tab is selected, hide other sections
          if (activeSectionFilter !== "all" && activeSectionFilter !== sec.id) return null;

          return (
            <div key={sec.id || secIdx} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {sec.name}
              </h4>
              <div className="grid grid-cols-5 gap-2.5">
                {sec.questions.map((q, idx) => {
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
          );
        })}
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
            className="w-full py-6 font-bold uppercase tracking-wider text-xs border border-green-600 bg-green-600 text-white hover:bg-green-700 rounded-xl cursor-pointer"
          >
            Review & Submit
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
