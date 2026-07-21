import React from "react";
import { Check, Bookmark, AlertCircle, Sparkles } from "lucide-react";

export function QuestionView({ question, index, answer, onAnswer, totalQuestions = 30, hideHeader = false }) {
  const options = [
    { key: "A", text: question.option_a },
    { key: "B", text: question.option_b },
    { key: "C", text: question.option_c },
    { key: "D", text: question.option_d },
  ].filter(opt => opt.text); // Filter out empty options if any

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 select-none text-left font-sans flex-1 flex flex-col justify-start w-full">
      {/* Question Metadata Header — hidden when parent renders it */}
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-[#1E295D]/25 pb-4.5">
          <span className="text-[12.5px] font-['Outfit'] font-black uppercase tracking-widest flex items-center gap-2">
            <Bookmark className="w-4.5 h-4.5 text-[#00F2FE] fill-[#00F2FE]/20 drop-shadow-[0_0_8px_rgba(0,242,254,0.65)]" />
            <span className="text-[#8B9BB4]">QUESTION</span> 
            <span className="text-[#818CF8] bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">{(index + 1).toString().padStart(2, "0")}</span>
            <span className="text-slate-600">/</span> 
            <span className="text-slate-400 font-extrabold">{totalQuestions.toString().padStart(2, "0")}</span>
          </span>
          <div className="flex gap-2">
            <span className={`text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty || "Medium"}
            </span>
            <span className="text-[9.5px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-1.5 rounded-lg">
              {question.marks || 1} {question.marks === 1 ? "Mark" : "Marks"}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="text-[16.5px] font-extrabold text-[#F8FAFC] leading-relaxed font-['Outfit'] drop-shadow-[0_2px_10px_rgba(99,102,241,0.15)]">
          {question.question_text}
        </h3>
        <p className="text-[11px] text-[#8B9BB4] font-semibold font-['Outfit']">Choose the correct answer</p>
      </div>

      {/* Options Selection Cards */}
      <div className="grid grid-cols-1 gap-3.5 mt-2">
        {options.map((opt) => {
          const isSelected = answer === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onAnswer(question.id, opt.key)}
              className={`w-full text-left p-4.5 rounded-2xl text-[13.5px] font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer group clay-card-interactive ${
                isSelected 
                  ? "clay-card-emerald text-white" 
                  : "clay-card hover:border-indigo-500/40"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Option Index Bubble */}
                <div className={`h-9 w-9 rounded-xl font-black flex items-center justify-center border shrink-0 transition-all duration-300 font-['Outfit'] text-[14px] clay-pill ${
                  isSelected 
                    ? "bg-emerald-600 border-white/40 text-white shadow-lg" 
                    : "bg-slate-900/80 border-slate-700/60 text-indigo-300 group-hover:border-indigo-500"
                }`}>
                  {opt.key}
                </div>
                <span className={`text-[13.5px] leading-relaxed font-bold font-['Outfit'] transition-colors duration-300 ${
                  isSelected ? "text-white drop-shadow-md" : "text-slate-200 group-hover:text-white"
                }`}>
                  {opt.text}
                </span>
              </div>

              {/* Selection Checkbox Ring */}
              <div className="shrink-0 ml-4">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                    <Check className="w-4 h-4 stroke-[4]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-600/60 group-hover:border-indigo-500/80 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Banner Block (Rendered if explanation is available) */}
      {question.explanation && (
        <div className="bg-[#061C18] border border-[#10B981]/20 rounded-2xl p-5 text-left flex gap-3.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
          <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[12px] font-['Outfit'] font-black uppercase text-[#10B981] tracking-wider leading-none">
              Explanation
            </h4>
            <p className="text-[11px] text-slate-300 mt-2 font-medium leading-relaxed font-sans">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
