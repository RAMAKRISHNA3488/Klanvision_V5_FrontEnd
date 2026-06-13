import React from "react";

export function QuestionView({ question, index, answer, onAnswer }) {
  const options = [
    { key: "A", text: question.option_a },
    { key: "B", text: question.option_b },
    { key: "C", text: question.option_c },
    { key: "D", text: question.option_d },
  ];

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
      case "hard": return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";
      default: return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Question Metadata Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
          QUESTION {(index + 1).toString().padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty || "Medium"}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 px-2.5 py-1 rounded-md">
            {question.marks || 1} {question.marks === 1 ? "Mark" : "Marks"}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
          {question.question_text}
        </h3>
      </div>

      {/* Options Selection Cards */}
      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => {
          const isSelected = answer === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onAnswer(question.id, opt.key)}
              className={`w-full text-left p-5 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-4 cursor-pointer group
                ${isSelected 
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 text-indigo-900 dark:text-indigo-200" 
                  : "border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"}`}
            >
              {/* Option Index Bubble */}
              <div className={`h-8 w-8 rounded-xl font-bold flex items-center justify-center border shrink-0 transition-colors
                ${isSelected 
                  ? "bg-indigo-600 border-indigo-700 text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 group-hover:bg-slate-100"}`}
              >
                {opt.key}
              </div>
              <span className="leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
