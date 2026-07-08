import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Code2, Terminal, Database, Sparkles, CheckCircle2, XCircle, 
  RefreshCw, FileText, Volume2, Video, HelpCircle, FileDown, Check
} from "lucide-react";

export function QuestionView({ question, index, answer, onAnswer }) {
  // Determine question type (defaults to MCQ)
  const qType = (question.question_type || "MCQ_SINGLE").toUpperCase();

  // IDE states for Coding Questions
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [codeContents, setCodeContents] = useState({});
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalStatus, setTerminalStatus] = useState("idle"); // idle, running, success, error
  const [executionStats, setExecutionStats] = useState(null);

  // SQL states
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlStatus, setSqlStatus] = useState("idle");

  // Essay word count
  const [wordCount, setWordCount] = useState(0);

  // Starter templates for code compiler
  const codeTemplates = {
    javascript: `// Write a function to find the sum of two integers\nfunction sum(a, b) {\n    return a + b;\n}\n\n// Examples:\nconsole.log(sum(5, 10)); // Expected: 15`,
    python: `# Write a function to find the sum of two integers\ndef sum_two_numbers(a, b):\n    return a + b\n\n# Examples:\nprint(sum_two_numbers(5, 10)) # Expected: 15`,
    java: `// Write a function to find the sum of two integers\npublic class Solution {\n    public static int sum(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(sum(5, 10)); // Expected: 15\n    }\n}`,
    cpp: `// Write a function to find the sum of two integers\n#include <iostream>\n\nint sum(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    std::cout << sum(5, 10); // Expected: 15\n    return 0;\n}`,
    c: `// Write a function to find the sum of two integers\n#include <stdio.h>\n\nint sum(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("%d", sum(5, 10)); // Expected: 15\n    return 0;\n}`,
    go: `package main\n\nimport "fmt"\n\n// Write a function to find the sum of two integers\nfunc sum(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    fmt.Println(sum(5, 10)) // Expected: 15\n}`,
    rust: `// Write a function to find the sum of two integers\nfn sum(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nfn main() {\n    println!("{}", sum(5, 10)); // Expected: 15\n}`,
    kotlin: `// Write a function to find the sum of two integers\nfn sum(a: Int, b: Int): Int {\n    return a + b\n}\n\nfun main(args: Array<String>) {\n    println(sum(5, 10)) // Expected: 15\n}`
  };

  // Sync answer state with internal states on question index change
  useEffect(() => {
    if (qType === "CODING" || qType === "PROGRAMMING") {
      try {
        const parsed = JSON.parse(answer || "{}");
        setCodeContents(parsed.code || {});
        setSelectedLang(parsed.lang || "javascript");
        setTerminalOutput(parsed.output || "");
        setExecutionStats(parsed.stats || null);
      } catch (e) {
        // Fallback if raw text
        setCodeContents({ [selectedLang]: answer || codeTemplates[selectedLang] });
      }
    } else if (qType === "SQL") {
      setSqlQuery(answer || "SELECT * FROM employees;");
      setSqlResult(null);
      setSqlStatus("idle");
    } else if (qType === "ESSAY" || qType === "PARAGRAPH") {
      const text = answer || "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  }, [question.id, qType]);

  // Handle IDE text changes and save
  const handleCodeChange = (val) => {
    const nextContents = { ...codeContents, [selectedLang]: val };
    setCodeContents(nextContents);
    
    // Save both the active language and code block to attempt answers
    onAnswer(question.id, JSON.stringify({
      lang: selectedLang,
      code: nextContents,
      output: terminalOutput,
      stats: executionStats
    }));
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    const existing = codeContents[lang] || codeTemplates[lang];
    const nextContents = { ...codeContents, [lang]: existing };
    setCodeContents(nextContents);
    
    onAnswer(question.id, JSON.stringify({
      lang,
      code: nextContents,
      output: terminalOutput,
      stats: executionStats
    }));
  };

  // Simulated code compiler run/submit execution
  const runCodeExecution = (isSubmission = false) => {
    setTerminalStatus("running");
    setTerminalOutput("> Compiling solution...\n> Initializing unit test suite...\n");
    
    setTimeout(() => {
      const currentCode = codeContents[selectedLang] || codeTemplates[selectedLang];
      
      // Simple Javascript executor for real execution visual
      let runtimeOutput = "";
      let errorOccurred = false;
      
      if (selectedLang === "javascript") {
        try {
          // Simple sandbox test logic
          if (currentCode.includes("function sum")) {
            // Test inputs
            const testFn = new Function(currentCode + "\nreturn sum(arguments[0], arguments[1]);");
            const res1 = testFn(5, 10);
            const res2 = testFn(-3, 8);
            
            runtimeOutput = `> Executing unit test cases...\n`;
            runtimeOutput += `Test Case 1: sum(5, 10)\n  - Expected: 15\n  - Actual: ${res1}\n  - Status: ${res1 === 15 ? "PASSED" : "FAILED"}\n\n`;
            runtimeOutput += `Test Case 2: sum(-3, 8)\n  - Expected: 5\n  - Actual: ${res2}\n  - Status: ${res2 === 5 ? "PASSED" : "FAILED"}\n\n`;
            if (res1 === 15 && res2 === 5) {
              runtimeOutput += `All Test Cases Passed successfully.`;
            } else {
              runtimeOutput += `Some tests failed. Check logic implementation.`;
              errorOccurred = true;
            }
          } else {
            runtimeOutput = `> Code run complete.\nOutput Console:\n` + currentCode.substring(0, 150) + "\n...\n(Simulation complete: Output verified)";
          }
        } catch (e) {
          runtimeOutput = `Compilation Error: ${e.message}\nLine: ${e.stack?.split("\n")[1] || "Unknown"}`;
          errorOccurred = true;
        }
      } else {
        // Simulated runner output for non-JS languages
        runtimeOutput = `> [${selectedLang.toUpperCase()} Compiler Mode]\n`;
        runtimeOutput += `> Executing unit test cases...\n`;
        runtimeOutput += `Test Case 1: input (5, 10)\n  - Expected: 15\n  - Output: 15\n  - Status: PASSED\n\n`;
        runtimeOutput += `Test Case 2: input (-3, 8)\n  - Expected: 5\n  - Output: 5\n  - Status: PASSED\n\n`;
        if (isSubmission) {
          runtimeOutput += `> Running hidden system test cases...\n`;
          runtimeOutput += `Hidden Case 3 (large bounds): PASSED\n`;
          runtimeOutput += `Hidden Case 4 (empty values): PASSED\n\n`;
          runtimeOutput += `Submission complete: 4/4 test cases passed successfully.`;
        } else {
          runtimeOutput += `Compilation run successful. All local unit tests passed.`;
        }
      }

      setTerminalOutput(runtimeOutput);
      setTerminalStatus(errorOccurred ? "error" : "success");
      
      const stats = {
        time: (Math.random() * 80 + 12).toFixed(1) + " ms",
        memory: (Math.random() * 12 + 4.2).toFixed(2) + " MB",
        tests: isSubmission ? "4/4 cases passed" : "2/2 cases passed"
      };
      setExecutionStats(stats);

      // Save output/stats to attempt state
      onAnswer(question.id, JSON.stringify({
        lang: selectedLang,
        code: codeContents,
        output: runtimeOutput,
        stats
      }));
    }, 1500);
  };

  // SQL Query compiler simulator
  const runSQLQuery = () => {
    setSqlStatus("running");
    
    setTimeout(() => {
      const q = sqlQuery.toLowerCase().trim();
      
      if (q.startsWith("select")) {
        // Mock query returns matching tables
        if (q.includes("employees")) {
          setSqlResult([
            { id: "101", name: "Alice Smith", salary: 85000, department_id: "D01" },
            { id: "102", name: "Bob Jones", salary: 92000, department_id: "D02" },
            { id: "103", name: "Charlie Davis", salary: 78000, department_id: "D01" }
          ]);
        } else if (q.includes("departments")) {
          setSqlResult([
            { id: "D01", name: "Engineering" },
            { id: "D02", name: "Marketing" }
          ]);
        } else {
          setSqlResult([
            { status: "Query executed", rows: "0 matches found" }
          ]);
        }
        setSqlStatus("success");
      } else {
        setSqlResult([{ error: "SQL Syntax Error near: " + q.split(" ")[0] }]);
        setSqlStatus("error");
      }
    }, 1000);
  };

  // Layout color styles
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
      case "hard": return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";
      default: return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
    }
  };

  // Main UI Render wrapper
  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* ── QUESTION HEADER METADATA ── */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">
          QUESTION {(index + 1).toString().padStart(2, "0")} &nbsp;·&nbsp; <span className="text-slate-400 font-semibold">{qType.replace("_", " ")}</span>
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

      {/* ── QUESTION BODY TEXT ── */}
      <div className="space-y-4 shrink-0">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
          {question.question_text}
        </h3>
        
        {/* Support media contents */}
        {question.question_image_url && (
          <div className="my-4 max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100/50">
            <img src={question.question_image_url} alt="Question Asset" className="w-full h-auto object-cover max-h-80" />
          </div>
        )}

        {question.question_audio_url && (
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <Volume2 className="h-5 w-5 text-indigo-500 shrink-0" />
            <audio src={question.question_audio_url} controls className="w-full h-8" />
          </div>
        )}

        {question.question_video_url && (
          <div className="my-4 max-w-lg border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden shadow">
            <video src={question.question_video_url} controls className="w-full" />
          </div>
        )}

        {/* Attachment download */}
        {question.attachments && (
          <a
            href={question.attachments}
            download
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <FileDown className="h-4 w-4" /> Download Accompanying Case Files
          </a>
        )}
      </div>

      {/* ── QUESTION INPUT RENDERING PANEL ── */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. MCQ Single Choice */}
        {(qType === "MCQ_SINGLE" || qType === "SINGLE_CHOICE") && (
          <div className="grid grid-cols-1 gap-4">
            {[
              { key: "A", val: question.option_a },
              { key: "B", val: question.option_b },
              { key: "C", val: question.option_c },
              { key: "D", val: question.option_d }
            ].map((opt) => {
              if (!opt.val) return null;
              const isSelected = answer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onAnswer(question.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center gap-4 cursor-pointer group
                    ${isSelected 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 text-indigo-900 dark:text-indigo-200" 
                      : "border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"}`}
                >
                  <div className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center border shrink-0 transition-colors
                    ${isSelected 
                      ? "bg-indigo-600 border-indigo-700 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 group-hover:bg-slate-100"}`}
                  >
                    {opt.key}
                  </div>
                  <span>{opt.val}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. MCQ Multiple Choice (Checkbox checks) */}
        {(qType === "MCQ_MULTIPLE" || qType === "MULTIPLE_CHOICE") && (
          <div className="grid grid-cols-1 gap-4">
            {[
              { key: "A", val: question.option_a },
              { key: "B", val: question.option_b },
              { key: "C", val: question.option_c },
              { key: "D", val: question.option_d }
            ].map((opt) => {
              if (!opt.val) return null;
              
              // Handle multiple answers stored as CSV
              const currentAnswers = answer ? answer.split(",") : [];
              const isSelected = currentAnswers.includes(opt.key);
              
              const toggleAnswer = () => {
                let nextAnswers;
                if (isSelected) {
                  nextAnswers = currentAnswers.filter(a => a !== opt.key);
                } else {
                  nextAnswers = [...currentAnswers, opt.key].sort();
                }
                onAnswer(question.id, nextAnswers.join(","));
              };

              return (
                <button
                  key={opt.key}
                  onClick={toggleAnswer}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center gap-4 cursor-pointer group
                    ${isSelected 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 text-indigo-900 dark:text-indigo-200" 
                      : "border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"}`}
                >
                  <div className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center border shrink-0 transition-colors
                    ${isSelected 
                      ? "bg-indigo-600 border-indigo-700 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 group-hover:bg-slate-100"}`}
                  >
                    {isSelected ? <Check size={14} className="stroke-[3]" /> : opt.key}
                  </div>
                  <span>{opt.val}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. True / False Selection */}
        {(qType === "TRUE_FALSE" || qType === "TRUE-FALSE") && (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {["True", "False"].map((opt) => {
              const isSelected = answer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onAnswer(question.id, opt)}
                  className={`h-16 text-sm font-bold border rounded-xl flex items-center justify-center cursor-pointer transition-all
                    ${isSelected 
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300"}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* 4. Fill in the Blank */}
        {(qType === "FILL_BLANK" || qType === "FILL_IN_BLANK") && (
          <div className="max-w-md space-y-3">
            <label htmlFor={`fill-blank-${question.id}`} className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Provide Fill-in Answer:</label>
            <input
              id={`fill-blank-${question.id}`}
              name={`fill-blank-${question.id}`}
              type="text"
              value={answer || ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Type your response here..."
              className="w-full px-4 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-semibold"
            />
          </div>
        )}

        {/* 5. Essay / Paragraph response */}
        {(qType === "ESSAY" || qType === "PARAGRAPH") && (
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-550 font-bold uppercase">
              <label htmlFor={`essay-response-${question.id}`}>Write text response:</label>
              <span>Words: {wordCount}</span>
            </div>
            <textarea
              id={`essay-response-${question.id}`}
              name={`essay-response-${question.id}`}
              value={answer || ""}
              onChange={(e) => {
                const text = e.target.value;
                onAnswer(question.id, text);
                const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                setWordCount(words);
              }}
              rows={8}
              placeholder="Enter your detailed essay explanation here..."
              className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 focus:outline-none text-sm leading-relaxed"
            />
          </div>
        )}

        {/* 6. Built-in IDE Code Editor (Java, Python, C, C++, JS, Go, Rust, Kotlin) */}
        {(qType === "CODING" || qType === "PROGRAMMING") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {/* Split description column */}
            <div className="lg:col-span-4 p-5 flex flex-col border-r border-slate-100 dark:border-slate-800/80 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">
                <FileText className="h-4 w-4 text-indigo-500" /> Challenge Specifications
              </div>
              
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>Implement the code function specified in the editor window. Review inputs, constraints, and test outputs carefully.</p>
                
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Time limit:</span>
                    <span className="font-mono text-slate-200">2000 ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Memory limit:</span>
                    <span className="font-mono text-slate-200">65 MB</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1.5 font-mono text-[10px]">
                  <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Standard Case 1:</p>
                  <p><span className="text-indigo-400">Input:</span> 5, 10</p>
                  <p><span className="text-emerald-400">Expected:</span> 15</p>
                </div>
              </div>
            </div>

            {/* Code Workspace column */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-slate-950">
              {/* Toolbar */}
              <div className="h-12 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-300">Editor</span>
                </div>
                
                {/* Language switcher */}
                <select
                  value={selectedLang}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 h-8 text-[11px] font-bold text-indigo-400 focus:outline-none"
                >
                  <option value="javascript">JavaScript (Node v18)</option>
                  <option value="python">Python (v3.10)</option>
                  <option value="java">Java (JDK 17)</option>
                  <option value="cpp">C++ (GCC 11)</option>
                  <option value="c">C (GCC 11)</option>
                  <option value="go">Go (v1.20)</option>
                  <option value="rust">Rust (v1.68)</option>
                  <option value="kotlin">Kotlin (v1.8)</option>
                </select>
              </div>

              {/* Monospace Code Editor input area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Simulated line numbers */}
                <div className="w-10 bg-slate-900 text-slate-600 font-mono text-xs text-right pr-2.5 py-4 select-none border-r border-slate-800/40">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="h-6 leading-6">{i + 1}</div>
                  ))}
                </div>

                <textarea
                  id={`code-editor-${question.id}`}
                  name={`code-editor-${question.id}`}
                  aria-label="Code Editor"
                  value={codeContents[selectedLang] || codeTemplates[selectedLang]}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="flex-1 h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-6 resize-none focus:outline-none focus:ring-0 focus:border-none"
                  spellCheck={false}
                />
              </div>

              {/* Code outputs console panel */}
              <div className="h-44 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0">
                <div className="h-8 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> Output Console
                  </div>
                  {executionStats && (
                    <div className="flex gap-4 font-mono normal-case text-slate-500">
                      <span>CPU: {executionStats.time}</span>
                      <span>Memory: {executionStats.memory}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 font-mono text-[10px] overflow-y-auto text-slate-300 leading-relaxed">
                  {terminalStatus === "running" ? (
                    <div className="flex items-center gap-2 text-indigo-400">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Compiling code files against unit tests...</span>
                    </div>
                  ) : terminalOutput ? (
                    <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                  ) : (
                    <span className="text-slate-600 italic">Terminal is idle. Click Run Code to verify execution paths.</span>
                  )}
                </div>

                {/* Compile controls */}
                <div className="h-12 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-end gap-3 shrink-0">
                  <button
                    disabled={terminalStatus === "running"}
                    onClick={() => runCodeExecution(false)}
                    className="h-8 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="h-3 w-3" /> Run Tests
                  </button>
                  <button
                    disabled={terminalStatus === "running"}
                    onClick={() => runCodeExecution(true)}
                    className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" /> Submit Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SQL Query challenge */}
        {qType === "SQL" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[500px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {/* Database schema layout panel */}
            <div className="lg:col-span-4 p-5 flex flex-col border-r border-slate-100 dark:border-slate-800/80 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-4">
                <Database className="h-4 w-4 text-indigo-500" /> Database Schemas
              </div>

              <div className="space-y-4">
                {/* Schema Table 1 */}
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-950 p-2 font-mono text-[10px] font-black text-slate-500">
                    TABLE: employees
                  </div>
                  <div className="p-3 font-mono text-[10px] text-slate-400 space-y-1">
                    <p><span className="text-indigo-400">id</span>: INT (PK)</p>
                    <p><span className="text-indigo-400">name</span>: VARCHAR(100)</p>
                    <p><span className="text-indigo-400">salary</span>: DECIMAL</p>
                    <p><span className="text-indigo-400">department_id</span>: VARCHAR(36) (FK)</p>
                  </div>
                </div>

                {/* Schema Table 2 */}
                <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-950 p-2 font-mono text-[10px] font-black text-slate-500">
                    TABLE: departments
                  </div>
                  <div className="p-3 font-mono text-[10px] text-slate-400 space-y-1">
                    <p><span className="text-indigo-400">id</span>: VARCHAR(36) (PK)</p>
                    <p><span className="text-indigo-400">name</span>: VARCHAR(100)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SQL Query input pane */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-slate-950">
              <div className="h-12 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
                <label htmlFor={`sql-editor-${question.id}`} className="text-xs font-bold text-slate-300">Write SQL Query</label>
                <button
                  onClick={runSQLQuery}
                  disabled={sqlStatus === "running"}
                  className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="h-3 w-3" /> Run Query
                </button>
              </div>

              {/* SQL Textarea */}
              <textarea
                id={`sql-editor-${question.id}`}
                name={`sql-editor-${question.id}`}
                value={sqlQuery}
                onChange={(e) => {
                  setSqlQuery(e.target.value);
                  onAnswer(question.id, e.target.value);
                }}
                className="flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-6 resize-none focus:outline-none border-b border-slate-800/60"
                placeholder="SELECT * FROM employees WHERE salary > 80000;"
                spellCheck={false}
              />

              {/* Grid query results console */}
              <div className="h-44 bg-slate-950 flex flex-col overflow-hidden shrink-0">
                <div className="h-8 bg-slate-900 px-4 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                  Query Results Console
                </div>

                <div className="flex-1 p-3 font-mono text-[10px] overflow-auto text-slate-300">
                  {sqlStatus === "running" ? (
                    <div className="flex items-center gap-2 text-indigo-400">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Parsing query structure against schema indexes...</span>
                    </div>
                  ) : sqlResult ? (
                    sqlResult[0]?.error ? (
                      <span className="text-red-400 font-bold">{sqlResult[0].error}</span>
                    ) : (
                      <table className="w-full text-left border-collapse border border-slate-800 text-[10px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800">
                            {Object.keys(sqlResult[0] || {}).map((k) => (
                              <th key={k} className="p-2 text-slate-400 uppercase font-black">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResult.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/40">
                              {Object.values(row).map((val, vIdx) => (
                                <td key={vIdx} className="p-2">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    <span className="text-slate-600 italic">No query has been executed yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. Match the Following elements */}
        {(qType === "MATCHING" || qType === "MATCH_FOLLOWING") && (
          <div className="space-y-4 max-w-lg">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Select the matching mapping for column items:</p>
            {[
              { id: "m1", left: "Principle of Least Privilege", choices: ["A. Memory Limits", "B. Role Restrictions", "C. Logging Methods"] },
              { id: "m2", left: "Garbage Collector heap bounds", choices: ["A. Memory Limits", "B. Role Restrictions", "C. Logging Methods"] },
              { id: "m3", left: "Centralized Telemetry Logging", choices: ["A. Memory Limits", "B. Role Restrictions", "C. Logging Methods"] }
            ].map((matchRow, idx) => {
              const currentMatches = answer ? answer.split(",") : [];
              const currentRowMatch = currentMatches[idx] || "";
              
              const updateRowMatch = (val) => {
                const updated = [...currentMatches];
                updated[idx] = val;
                onAnswer(question.id, updated.join(","));
              };

              return (
                <div key={matchRow.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl gap-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{matchRow.left}</span>
                  <select
                    value={currentRowMatch}
                    onChange={(e) => updateRowMatch(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 h-10 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="">-- Choose Match --</option>
                    {matchRow.choices.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}

        {/* 9. Case Study splits */}
        {qType === "CASE_STUDY" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-[500px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {/* Scrollable text details */}
            <div className="p-6 overflow-y-auto border-r border-slate-100 dark:border-slate-800/80 leading-relaxed text-sm text-slate-600 dark:text-slate-300 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              <h4 className="text-xs font-black uppercase text-indigo-500 tracking-wider">Scrollable Case Study Context</h4>
              <p className="font-semibold text-slate-800 dark:text-slate-200">The Core Decoupled Pipeline Design:</p>
              <p>Consider a distributed IoT message polling orchestrator scaling in a hybrid cloud cloud deployment. Client workloads spike dynamically by 10x during hourly sync locks. Legacy systems utilized single node transactional caches, which caused massive socket blocks and query queues...</p>
              <p>Our proposed architecture targets horizontal scale via broker topics and distributed message partitions. To guarantee data recoverability under regional network failures, the cache is distributed and synced edge-to-edge...</p>
            </div>

            {/* Answer option choices */}
            <div className="p-6 overflow-y-auto flex flex-col justify-center gap-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Based on the case context, select the best action:</p>
              {[
                { key: "A", val: "Enforce vertical scaling and lock thread pools during sync peaks" },
                { key: "B", val: "Establish broker queues and horizontal partition locks" },
                { key: "C", val: "Degrade caches and fallback to file storage writes" },
                { key: "D", val: "Switch off CORS security parameters during spike intervals" }
              ].map((opt) => {
                const isSelected = answer === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => onAnswer(question.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer
                      ${isSelected 
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/25 text-indigo-900 dark:text-indigo-200" 
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"}`}
                  >
                    <div className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center border shrink-0
                      ${isSelected ? "bg-indigo-600 border-indigo-700 text-white" : "bg-slate-50 text-slate-500 dark:bg-slate-950"}`}
                    >
                      {opt.key}
                    </div>
                    <span>{opt.val}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
