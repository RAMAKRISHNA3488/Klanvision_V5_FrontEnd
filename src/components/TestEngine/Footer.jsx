import React from "react";
import { ChevronLeft, ChevronRight, Bookmark, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export function Footer({
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
  isMarked,
  onMarkForReview,
  onClear,
}) {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none sticky bottom-0 z-20">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <Button
          variant="outline"
          onClick={onClear}
          className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
        >
          <RotateCcw className="h-4.5 w-4.5" />
          Clear Response
        </Button>
        
        <Button
          variant="outline"
          onClick={onMarkForReview}
          className={`flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] h-11 px-5 rounded-xl transition-colors
            ${isMarked
              ? "bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
              : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"}`}
        >
          <Bookmark className="h-4.5 w-4.5 fill-current" />
          {isMarked ? "Marked for Review" : "Mark for Review"}
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          disabled={disablePrevious}
          onClick={onPrevious}
          className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] h-11 px-6 rounded-xl disabled:opacity-30 disabled:pointer-events-none border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>

        <Button
          disabled={disableNext}
          onClick={onNext}
          className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] h-11 px-6 rounded-xl disabled:opacity-30 disabled:pointer-events-none bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save & Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}
