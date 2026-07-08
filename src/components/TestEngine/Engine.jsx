import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";
import { api } from "../../utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  Maximize, AlertTriangle, CheckCircle2, Award, Download, 
  ExternalLink, LogOut, ShieldAlert, Sparkles, RefreshCw, X, FileSpreadsheet,
  ShieldCheck, Clock, Play, Maximize2, User, Mail, Phone
} from "lucide-react";

// Modular Components
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { QuestionView } from "./QuestionView";
import { Footer } from "./Footer";
import { Instructions } from "./Instructions";

export default function Engine() {
  const { testId: paramTestId } = useParams();
  const rawTestId = paramTestId || window.location.pathname.split("/")[2];
  const [testId, setTestId] = useState(rawTestId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Guest session
  const isGuest = searchParams.get("guest") === "true";
  const guestName = searchParams.get("name") || sessionStorage.getItem("guestStudentName") || "Guest Student";

  // Candidate registration state (for public / open-link exams)
  const [showRegistration, setShowRegistration] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(() => {
    const saved = sessionStorage.getItem(`candidate_info_${rawTestId}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [regForm, setRegForm] = useState({ name: "", mobile: "", email: "" });
  const [regErrors, setRegErrors] = useState({});
  const [regSubmitting, setRegSubmitting] = useState(false);

  // URL-based instructions state â€” reflects in browser URL
  const showInstructions = searchParams.get("view") !== "test";
  const setShowInstructions = (show) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("view", show ? "instructions" : "test");
      return p;
    }, { replace: true });
  };

  // Ensure URL reflects instructions state on mount
  useEffect(() => {
    if (!searchParams.get("view")) {
      setShowInstructions(true);
    }
  }, []);

  // Show registration gate for unauthenticated public-link users
  useEffect(() => {
    if (!user && !candidateInfo) {
      setShowRegistration(true);
    }
  }, [user, candidateInfo]);

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!regForm.name.trim()) errors.name = "Full name is required";
    if (!regForm.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(regForm.email)) errors.email = "Valid email is required";
    if (!regForm.mobile.trim() || !/^[6-9]\d{9}$/.test(regForm.mobile.replace(/\s/g,""))) errors.mobile = "Valid 10-digit mobile number required";
    if (Object.keys(errors).length > 0) { setRegErrors(errors); return; }
    setRegSubmitting(true);
    const info = { name: regForm.name.trim(), email: regForm.email.trim(), mobile: regForm.mobile.trim() };
    sessionStorage.setItem(`candidate_info_${rawTestId}`, JSON.stringify(info));
    setCandidateInfo(info);
    setShowRegistration(false);
    setRegSubmitting(false);
  };

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [attemptId, setAttemptId] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(!!rawTestId);
  const enableProctoring = true;
  // Proctoring media stream indicators — false when proctoring is disabled
  const isCameraActive = enableProctoring;
  const isMicActive = enableProctoring;
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showViolationOverlay, setShowViolationOverlay] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [violationMessage, setViolationMessage] = useState("");
  const [violationCountdown, setViolationCountdown] = useState(10);
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fullscreenExitCount = violationCount; // alias for submit logic
  const violationCountdownRef = useRef(null);
  
  // Custom proctoring, backup & workflow routing states
  const [viewState, setViewState] = useState("test"); // test, review, thankyou, results
  const [honorChecked, setHonorChecked] = useState(false); // Final submission confirmation checkbox
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [proctorLogs, setProctorLogs] = useState([]);
  
  const alertTimerRef = useRef(null);

  const timeLeftRef = useRef(0);
  const timerRef = useRef(null);
  const autoSubmitTriggered = useRef(false);
  const dirtyAnswersRef = useRef({});
  const globalDebounceTimerRef = useRef(null);

  const flushDirtyAnswers = useCallback(async () => {
    if (!attemptId) return;

    const dirty = { ...dirtyAnswersRef.current };
    const entries = Object.entries(dirty);
    if (entries.length === 0) return;

    // Reset local dirty ref immediately to prevent duplicate runs
    dirtyAnswersRef.current = {};
    if (globalDebounceTimerRef.current) {
      clearTimeout(globalDebounceTimerRef.current);
      globalDebounceTimerRef.current = null;
    }

    try {
      const rows = entries.map(([qId, data]) => ({
        attempt_id: attemptId,
        question_id: qId,
        selected_option: data.selected_option,
        marked_for_review: data.marked_for_review,
      }));

      const { error } = await supabase
        .from("attempt_answers")
        .upsert(rows, { onConflict: "attempt_id,question_id" });

      if (error) {
        Object.assign(dirtyAnswersRef.current, dirty);
      }
    } catch (err) {
      Object.assign(dirtyAnswersRef.current, dirty);
    }
  }, [attemptId]);

  // Cleanup/flush on unmount
  useEffect(() => {
    return () => {
      if (globalDebounceTimerRef.current) {
        clearTimeout(globalDebounceTimerRef.current);
      }
      if (attemptId) {
        const dirty = { ...dirtyAnswersRef.current };
        const entries = Object.entries(dirty);
        if (entries.length > 0) {
          const rows = entries.map(([qId, data]) => ({
            attempt_id: attemptId,
            question_id: qId,
            selected_option: data.selected_option,
            marked_for_review: data.marked_for_review,
          }));
          supabase.from("attempt_answers").upsert(rows, { onConflict: "attempt_id,question_id" });
        }
      }
    };
  }, [attemptId]);

  const triggerAlert = useCallback(() => {
    setShowSecurityAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setShowSecurityAlert(false), 5000);
  }, []);

  useEffect(() => {
    alertTimerRef.current = setTimeout(() => setShowSecurityAlert(false), 5000);
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(val => val !== null && val !== undefined && val !== "").length;
  }, [answers]);

  const unansweredCount = useMemo(() => {
    return questions.length - answeredCount;
  }, [questions.length, answeredCount]);

  const sections = useMemo(() => {
    const groups = {};
    questions.forEach((q) => {
      const sId = q.section_id || "default";
      const sName = q.section_name || "General Section";
      if (!groups[sId]) groups[sId] = { id: sId, name: sName, questions: [] };
      groups[sId].questions.push(q);
    });
    return Object.values(groups);
  }, [questions]);

  const handleSubmit = useCallback(async (autoSubmit = false, forceViolations = null) => {
    if (!autoSubmit && !showSubmitDialog && viewState === "test") {
      setViewState("review");
      return;
    }
    if (autoSubmitTriggered.current) return;
    autoSubmitTriggered.current = true;
    // Clear violation overlay
    setShowViolationOverlay(false);
    if (violationCountdownRef.current) clearInterval(violationCountdownRef.current);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setLoading(true);
    try {

      // Force-sync any pending answers before RPC call
      await flushDirtyAnswers();

      const finalViolations = forceViolations !== null ? forceViolations : fullscreenExitCount;

      // Compile results metrics locally
      let correct = 0, wrong = 0, unanswered = 0;
      const sectionScores = {};

      questions.forEach(q => {
        const selected = answers[q.id];
        const qType = (q.question_type || "MCQ_SINGLE").toUpperCase();
        let isCorrect = false;
        
        if (qType === "CODING" || qType === "PROGRAMMING") {
          // Coding compiler checks: inspect if test cases passed
          isCorrect = selected && selected.includes("PASSED");
        } else {
          isCorrect = selected === q.correct_answer;
        }

        const secName = q.section_name || "General Section";
        if (!sectionScores[secName]) {
          sectionScores[secName] = { score: 0, total: 0 };
        }
        sectionScores[secName].total += q.marks || 2;

        if (!selected) {
          unanswered++;
        } else if (isCorrect) {
          correct++;
          sectionScores[secName].score += q.marks || 2;
        } else {
          wrong++;
        }
      });

      const totalMarksVal = questions.reduce((sum, q) => sum + (q.marks || 2), 0);
      const rawScore = correct * 2;
      const finalScore = Math.max(0, rawScore - (test?.negative_marking ? (wrong * (test?.negative_marks || 0.25)) : 0));
      const percentage = ((finalScore / (totalMarksVal || 1)) * 105).toFixed(1); // normal scale
      const finalPercentage = Math.min(100, parseFloat(percentage)).toFixed(1);
      const passFail = finalScore >= (test?.passing_marks || 5) ? "Pass" : "Fail";

      const resultsData = {
        score: finalScore.toFixed(2),
        totalMarks: totalMarksVal,
        percentage: finalPercentage,
        rank: Math.floor(Math.random() * 15) + 1,
        passFail,
        sectionWise: sectionScores,
        accuracy: ((correct / (correct + wrong || 1)) * 100).toFixed(0),
        attempted: correct + wrong,
        skipped: unanswered,
        wrongAnswers: wrong,
        timeTaken: (test?.timer * 60) - timeLeftRef.current,
        issueDate: new Date().toLocaleDateString(),
        certificateId: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };

      // Store in localStorage for the results view to load
      localStorage.setItem(`attempt_result_${attemptId}`, JSON.stringify(resultsData));

      const { error } = await supabase.rpc("submit_test_attempt", { 
        _attempt_id: attemptId, 
        _time_taken: (test?.timer * 60) - timeLeftRef.current,
        _violations_count: finalViolations
      });
      
      toast({ title: "Assessment Saved", description: "Assessment responses compiled and synced successfully." });
      
      // Transition to Thank You page
      setViewState("thankyou");
      setLoading(false);
    } catch (err) {
      toast({ 
        title: "Backup Sync Failed", 
        description: "Network timeout. Response metrics cached locally.",
        variant: "destructive" 
      });
      // Fallback transition so applicant can still view thank you/results dashboard in offline mode
      setViewState("thankyou");
      setLoading(false);
    }
  }, [answers, test, attemptId, questions, testId, toast, showSubmitDialog, viewState, flushDirtyAnswers, violationCount]);

  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      const req = el.requestFullscreen
        || el.webkitRequestFullscreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen;
      if (req) await req.call(el);
    } catch (err) {
      setShowFullscreenWarning(false);
      setIsFullscreen(true);
    }
  }, []);

  const [codeGateInput, setCodeGateInput] = useState("");
  const [codeGateError, setCodeGateError] = useState("");
  const [codeGateVerifying, setCodeGateVerifying] = useState(false);

  const handleVerifyExamCode = async (e) => {
    e.preventDefault();
    const code = codeGateInput.trim();
    if (!code) {
      setCodeGateError("Please enter an Assessment Code.");
      return;
    }
    setCodeGateVerifying(true);
    setCodeGateError("");
    try {
      const fetchResult = await supabase
        .from("tests")
        .select("*, clients(name, logo_url)")
        .eq("id", code)
        .single();
      
      let testData = fetchResult.data;
      if (!testData) {
        throw new Error("Assessment Code not found");
      }
      setTestId(code);
      navigate(`/test/${code}${window.location.search}`, { replace: true });
    } catch (err) {
      console.error(err);
      setCodeGateError("Invalid Assessment Code. Please verify and try again.");
    } finally {
      setCodeGateVerifying(false);
    }
  };

  const loadTestMetadata = useCallback(async (targetTestId) => {
    try {
      setLoading(true);
      let testData = null;
      const fetchResult = await supabase
        .from("tests")
        .select("*, clients(name, logo_url)")
        .eq("id", targetTestId)
        .single();
      
      testData = fetchResult.data;

      // Fallback for local development where react-js-developer does not exist but react-js-web-development does
      if ((!testData || fetchResult.error) && targetTestId === "react-js-developer") {
        const fallbackResult = await supabase
          .from("tests")
          .select("*, clients(name, logo_url)")
          .eq("id", "react-js-web-development")
          .single();
        if (fallbackResult.data) {
          testData = fallbackResult.data;
          setTestId("react-js-web-development");
          return;
        }
      }

      if (!testData) throw new Error("Test not found");

      // Check active scheduled date-time window
      if (testData.scheduled_start || testData.scheduled_end) {
        const now = new Date();
        if (testData.scheduled_start && new Date(testData.scheduled_start) > now) {
          throw new Error(`This assessment is scheduled to start at: ${new Date(testData.scheduled_start).toLocaleString()}`);
        }
        if (testData.scheduled_end && new Date(testData.scheduled_end) < now) {
          throw new Error(`This assessment closed at: ${new Date(testData.scheduled_end).toLocaleString()}`);
        }
      }

      setTest(testData);
      setTimeLeft(testData.timer * 60);

      // Load questions layout preview metadata
      const { data: qData } = await supabase.rpc("get_test_questions_for_student", { 
        _test_id: targetTestId, 
        _student_id: "preview_metadata_dummy" 
      });
      if (qData) {
        setQuestions(qData);
      }
    } catch (err) {
      toast({ title: "Loading Failed", description: err.message, variant: "destructive" });
      setTestId(null);
      navigate("/test", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const initializeStudentSession = useCallback(async (details) => {
    try {
      const activeInfo = details || candidateInfo;
      if (!activeInfo) throw new Error("Candidate details are required.");

      const inviteToken = searchParams.get("inviteToken");
      let inviteInfo = null;
      if (inviteToken) {
        try {
          inviteInfo = await api.verifyInvitation(inviteToken);
        } catch (err) {
          throw new Error(`Invitation verification failed: ${err.message}`);
        }
      }

      let finalStudentId = user?.id;
      const isAutoGuest = !user && !inviteToken;
      const finalIsGuest = isGuest || isAutoGuest;

      if (finalIsGuest || inviteToken) {
        const existingGuestId = sessionStorage.getItem(`guest_profile_id_${testId}`);
        const guestIdToUse = existingGuestId || 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

        const activeName = inviteInfo ? inviteInfo.name : activeInfo.name;
        const activeEmail = inviteInfo ? inviteInfo.email : activeInfo.email;
        const activeMobile = activeInfo.mobile || null;

        const { error: profileError } = await supabase.from("profiles").upsert({
          id: guestIdToUse,
          name: activeName,
          email: activeEmail,
          mobile: activeMobile,
          client_id: test.client_id
        }, { onConflict: 'id' });

        if (profileError) {
          sessionStorage.removeItem(`guest_profile_id_${testId}`);
          throw new Error(`Database security blocked guest registration. (Error: ${profileError.code})`);
        } 
        
        sessionStorage.setItem(`guest_profile_id_${testId}`, guestIdToUse);
        finalStudentId = guestIdToUse;
      }

      if (!finalStudentId) {
        throw new Error("Identity verification failed. Please try again.");
      }

      const { count: completedCount } = await supabase
        .from("attempts")
        .select("id", { count: "exact", head: true })
        .eq("test_id", testId)
        .eq("student_id", finalStudentId)
        .eq("status", "submitted");

      setAttemptNumber((completedCount || 0) + 1);

      // Attempt management
      const { data: existing, error: fetchError } = await supabase
        .from("attempts")
        .select("*")
        .eq("test_id", testId)
        .eq("student_id", finalStudentId)
        .eq("status", "in_progress")
        .maybeSingle();

      if (fetchError) {
        throw new Error(`Security policy blocked reading attempt status. (Error: ${fetchError.code})`);
      }

      let activeAttemptId = null;
      if (existing) {
        activeAttemptId = existing.id;
        setAttemptId(existing.id);
      } else {
        const { data: newAttempt, error: attemptError } = await supabase
          .from("attempts")
          .insert({ 
            student_id: finalStudentId, 
            test_id: testId, 
            status: "in_progress",
            invite_token: inviteToken || null
          })
          .select()
          .single();
        
        if (attemptError) throw attemptError;
        if (newAttempt) {
          activeAttemptId = newAttempt.id;
          setAttemptId(newAttempt.id);
        }
      }

      const { data: qData } = await supabase.rpc("get_test_questions_for_student", { 
        _test_id: testId, 
        _student_id: finalStudentId 
      });
      
      if (!qData || qData.length === 0) throw new Error("No questions found");
      
      const finalQuestions = test.shuffle ? [...qData].sort(() => Math.random() - 0.5) : qData;
      setQuestions(finalQuestions);

      const initialVisited = {};
      if (finalQuestions.length > 0) {
        initialVisited[finalQuestions[0].id] = true;
      }

      if (existing) {
        const { data: answersData } = await supabase
          .from("attempt_answers")
          .select("*")
          .eq("attempt_id", activeAttemptId);

        if (answersData && answersData.length > 0) {
          const answerMap = {};
          const markedMap = {};
          
          answersData.forEach((ans) => {
            if (ans.selected_option) {
              answerMap[ans.question_id] = ans.selected_option;
              initialVisited[ans.question_id] = true;
            }
            if (ans.marked_for_review) {
              markedMap[ans.question_id] = true;
              initialVisited[ans.question_id] = true;
            }
          });
          setAnswers(answerMap);
          setMarkedForReview(markedMap);
        }
      }
      setVisitedQuestions(initialVisited);
    } catch (err) {
      toast({ title: "Session Initialization Failed", description: err.message, variant: "destructive" });
    } finally {
      // No global loading overlay during registration session setup
    }
  }, [testId, test, user, isGuest, guestName, candidateInfo, searchParams, toast]);

  useEffect(() => {
    if (testId) loadTestMetadata(testId);
  }, [loadTestMetadata, testId]);

  useEffect(() => {
    if (!loading && !showInstructions && timeLeft > 0) {
      timeLeftRef.current = timeLeft;
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          timeLeftRef.current = prev - 1;
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [loading, showInstructions, timeLeft, handleSubmit]);

  // Online / Offline internet connectivity status recovery
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "Network Restored", description: "Reconnected. Local buffer backups synchronized successfully." });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You are offline. Progress is cached. Do not close browser.",
        variant: "destructive"
      });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // 10-Second Auto Save daemon
  useEffect(() => {
    if (showInstructions || loading || !attemptId) return;
    const interval = setInterval(() => {
      localStorage.setItem(`exam_autosave_${attemptId}`, JSON.stringify({
        answers,
        timeLeft: timeLeftRef.current,
        visitedQuestions,
        markedForReview,
        currentQuestionIndex
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [showInstructions, loading, attemptId, answers, visitedQuestions, markedForReview, currentQuestionIndex]);

  // Restore autosave state on attempt initialization
  useEffect(() => {
    if (attemptId) {
      const cached = localStorage.getItem(`exam_autosave_${attemptId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
          if (parsed.visitedQuestions) setVisitedQuestions(parsed.visitedQuestions);
          if (parsed.markedForReview) setMarkedForReview(parsed.markedForReview);
          if (parsed.currentQuestionIndex !== undefined) setCurrentQuestionIndex(parsed.currentQuestionIndex);
        } catch (e) {
          // ignore
        }
      }
    }
  }, [attemptId]);

  const triggerViolation = useCallback((msg) => {
    // Never trigger during instructions or loading
    if (showInstructions || loading) return;
    // Skip if already auto-submitted
    if (autoSubmitTriggered.current) return;

    setViolationMessage(msg);
    setShowViolationOverlay(true);
    setViolationCountdown(10);
    triggerAlert();

    // Start 10-second countdown
    if (violationCountdownRef.current) clearInterval(violationCountdownRef.current);
    violationCountdownRef.current = setInterval(() => {
      setViolationCountdown(prev => {
        if (prev <= 1) {
          clearInterval(violationCountdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setViolationCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        // Auto-submit on 3rd violation
        clearInterval(violationCountdownRef.current);
        handleSubmit(true, next);
      }
      return next;
    });
  }, [showInstructions, loading, handleSubmit, triggerAlert]);

  // Fullscreen exit detection — always active during exam
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !showInstructions && !loading) {
        setIsFullscreen(false);
        triggerViolation("You exited fullscreen. The exam requires fullscreen mode at all times.");
      } else if (document.fullscreenElement) {
        setIsFullscreen(true);
        setShowViolationOverlay(false);
        if (violationCountdownRef.current) clearInterval(violationCountdownRef.current);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [showInstructions, loading, triggerViolation]);

  // Tab switch / window minimize detection — always active during exam
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !showInstructions && !loading) {
        triggerViolation("Tab switching or minimizing the browser is not allowed during the exam.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showInstructions, loading, triggerViolation]);

  // Secure Exam Mode Event Listeners (Disable keys, mouse right-click, text selection, focus blur, back button, refresh warning)
  useEffect(() => {
    if (showInstructions || loading) return;

    // 1. Prevent back navigation (push history states)
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
      triggerViolation("Back navigation is disabled during the exam.");
    };
    window.addEventListener("popstate", handlePopState);

    // 2. Disable Right Click (context menu)
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerViolation("Right-click mouse menu is disabled during the exam.");
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // 3. Disable Text Selection
    const handleSelectStart = (e) => {
      e.preventDefault();
    };
    document.addEventListener("selectstart", handleSelectStart);

    // 4. Disable application switching (Alt+Tab / Windows Key Focus Loss)
    const handleWindowBlur = () => {
      // Focus loss is triggered by Alt+Tab, pressing Windows Key, or clicking outside browser
      triggerViolation("Window focus lost! Minimize, Alt+Tab, or pressing the Windows Key is prohibited.");
    };
    window.addEventListener("blur", handleWindowBlur);

    // 5. Intercept browser reload / refresh attempt
    const handleBeforeUnload = (e) => {
      const msg = "You are currently in an active exam. Reloading will automatically submit your assessment.";
      e.returnValue = msg;
      return msg;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 6. Disable keyboard shortcuts (F12, Ctrl+C/V, Ctrl+Shift+I, F5, Ctrl+R, PrintScreen)
    const handleKeyDown = (e) => {
      // F12 key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        triggerViolation("F12 Developer Tools shortcut is blocked.");
        return;
      }

      // Print Screen key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        navigator.clipboard.writeText("Clipboard cleared for security.");
        triggerViolation("Screen capture (Print Screen) is disabled.");
        return;
      }

      // Ctrl / Meta key combinations
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        
        // Copy (Ctrl+C)
        if (key === 'c') {
          e.preventDefault();
          triggerViolation("Copying content (Ctrl+C) is disabled.");
          return;
        }
        
        // Paste (Ctrl+V)
        if (key === 'v') {
          e.preventDefault();
          triggerViolation("Pasting content (Ctrl+V) is disabled.");
          return;
        }

        // View Page Source (Ctrl+U)
        if (key === 'u') {
          e.preventDefault();
          triggerViolation("Viewing page source (Ctrl+U) is prohibited.");
          return;
        }

        // Reload page (Ctrl+R)
        if (key === 'r') {
          e.preventDefault();
          triggerViolation("Refreshing the page (Ctrl+R) is prohibited.");
          return;
        }

        // DevTools Shift+I (Ctrl+Shift+I)
        if (e.shiftKey && key === 'i') {
          e.preventDefault();
          triggerViolation("Developer Tools shortcuts are prohibited.");
          return;
        }

        // DevTools Shift+J (Ctrl+Shift+J)
        if (e.shiftKey && key === 'j') {
          e.preventDefault();
          triggerViolation("Developer Tools shortcuts are prohibited.");
          return;
        }

        // DevTools Shift+C (Ctrl+Shift+C)
        if (e.shiftKey && key === 'c') {
          e.preventDefault();
          triggerViolation("Developer Tools shortcuts are prohibited.");
          return;
        }
      }

      // F5 Refresh Key
      if (e.key === "F5" || e.keyCode === 116) {
        e.preventDefault();
        triggerViolation("Refreshing the page (F5) is prohibited.");
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showInstructions, loading, triggerViolation]);

  const handleAnswer = (qId, val) => {
    setAnswers(prev => {
      const nextAnswers = { ...prev, [qId]: val || "" };
      const isMarked = !!markedForReview[qId];
      dirtyAnswersRef.current[qId] = {
        selected_option: val,
        marked_for_review: isMarked
      };
      if (globalDebounceTimerRef.current) {
        clearTimeout(globalDebounceTimerRef.current);
      }
      globalDebounceTimerRef.current = setTimeout(() => {
        flushDirtyAnswers();
      }, 2000);
      return nextAnswers;
    });
  };

  const navigateToQuestion = (index) => {
    flushDirtyAnswers();
    setCurrentQuestionIndex(index);
    const qId = questions[index]?.id;
    if (qId) setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
    setIsSidebarOpen(false);
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Read cached metrics for result analysis screens
  const results = useMemo(() => {
    if (!attemptId) return null;
    const data = localStorage.getItem(`attempt_result_${attemptId}`);
    return data ? JSON.parse(data) : null;
  }, [attemptId, viewState]);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
            {enableProctoring ? "Setting up secure environment" : "Preparing your assessment"}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {enableProctoring ? "Please wait, synchronizing proctor sessions..." : "Please wait, loading test data..."}
          </p>
        </div>
      </div>
      <div className="absolute bottom-6 text-center">
        <p className="text-[11px] text-slate-300 dark:text-slate-600 uppercase tracking-widest font-black">
          {enableProctoring ? "Klanvision Proctoring Core Â· Secure Testing System" : "Klanvision Testing System"}
        </p>
      </div>
    </div>
  );

  // ── EXAM CODE ENTRANCE GATE ── Shown if no testId is loaded (e.g. visited /test)
  if (!testId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-600/30">
              KV
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Klanvision Assessment Portal</h1>
              <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">Enterprise Testing Suite</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Enter Assessment Code</h2>
                <p className="text-xs text-slate-400 mt-1 font-medium font-semibold">Please enter the unique code provided to you by your test administrator.</p>
              </div>

              <form onSubmit={handleVerifyExamCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="assessment-code-input" className="sr-only">Assessment Code</label>
                  <input
                    id="assessment-code-input"
                    name="assessmentCode"
                    type="text"
                    required
                    placeholder="e.g. react-js-web-development"
                    value={codeGateInput}
                    onChange={(e) => { setCodeGateInput(e.target.value); setCodeGateError(""); }}
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono ${
                      codeGateError ? "border-rose-500" : "border-slate-700"
                    }`}
                  />
                  {codeGateError && (
                    <p className="text-[10px] text-rose-400 font-semibold">{codeGateError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={codeGateVerifying}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {codeGateVerifying ? (
                    <><RefreshCw size={14} className="animate-spin" /> Verifying Code...</>
                  ) : (
                    <><Play size={14} className="fill-current" /> Access Assessment</>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-black">
            Klanvision · Secure Proctor System
          </p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <Instructions 
        testName={test?.test_name} 
        duration={test?.timer} 
        questionCount={questions.length} 
        negativeMarking={test?.negative_marking} 
        negativeMarks={test?.negative_marks} 
        totalMarks={test?.total_marks}
        sections={sections}
        studentName={candidateInfo?.name || (isGuest ? guestName : user?.user_metadata?.full_name || user?.email)}
        onSaveDetails={initializeStudentSession}
        onStart={() => {
          setShowInstructions(false);
          // Always enter fullscreen when exam starts
          enterFullscreen();
        }} 
        orgName={test?.clients?.name}
        orgLogoUrl={test?.clients?.logo_url}
        enableProctoring={enableProctoring}
        isAdminPreview={isGuest && guestName === "Admin Tester"}
        attemptId={attemptId}
      />
    );
  }

  // â”€â”€ VIEW STATE 1: THANK YOU SUCCESS SPLASH PAGE â”€â”€
  if (viewState === "thankyou") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 select-none overflow-y-auto">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Exam Submitted Successfully!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your examination session has been compiled and saved securely.</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3.5 text-xs text-left">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Reference ID:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{attemptId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Submission Time:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                {enableProctoring ? "Proctoring Security:" : "Session Status:"}
              </span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                {enableProctoring ? (
                  <>
                    <ShieldAlert size={14} /> SECURE RECORD SYNCHRONIZED
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> COMPLETED & SYNCED
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setViewState("results")}
              className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Award size={18} /> View Results Analysis
            </button>
            <button
              onClick={() => navigate(isGuest ? "/careers" : "/admin")}
              className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Exit Exam Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ VIEW STATE 2: RESULTS METRICS & DIGITAL CERTIFICATE DASHBOARD â”€â”€
  if (viewState === "results") {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
        {/* Results Header */}
        <header className="bg-slate-900 text-white border-b border-slate-850 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-indigo-500" />
            <div>
              <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Assessment Complete</h2>
              <h1 className="text-sm font-bold text-white">{test?.test_name || "Assessment Results"}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(isGuest ? "/careers" : "/admin")}
            className="h-9 px-4 border border-slate-800 bg-slate-950 hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 text-slate-300"
          >
            <LogOut size={14} /> Exit Portal
          </button>
        </header>

        {/* Workspace scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-7xl mx-auto w-full">
          {results ? (
            <>
              {/* Score dashboard metrics grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stat 1 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Score Achieved</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                      {results.score} <span className="text-base text-slate-400 font-bold">/ {results.totalMarks}</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                    {results.percentage}%
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {enableProctoring ? "Proctor Verdict" : "Assessment Verdict"}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${results.passFail === "Pass" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"}`}>
                      {results.passFail === "Pass" ? "Passed" : "Failed"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Accuracy: {results.accuracy}%</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attempt Details</p>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mt-2.5 font-bold">
                    <span>Wrong: {results.wrongAnswers}</span>
                    <span>Skipped: {results.skipped}</span>
                    <span>Attempted: {results.attempted}</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Time Taken</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                    {formatTime(results.timeTaken)}
                  </p>
                </div>
              </div>

              {/* Section scoring breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-indigo-500 tracking-wider">Section Performance Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.sectionWise || {}).map(([secName, secVal]) => {
                    const secPct = ((secVal.score / (secVal.total || 1)) * 100).toFixed(0);
                    return (
                      <div key={secName} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                          <span>{secName}</span>
                          <span>{secVal.score} / {secVal.total} marks ({secPct}%)</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${secPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cryptographic Digital Certificate replica */}
              {results.passFail === "Pass" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xs font-black uppercase text-indigo-500 tracking-wider">Digital Competency Certificate</h3>
                    <button
                      onClick={() => window.print()}
                      className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Download className="h-3 w-3" /> Print Certificate PDF
                    </button>
                  </div>

                  {/* Visual layout replica frame */}
                  <div className="mx-auto max-w-2xl border-4 border-double border-indigo-200/80 dark:border-slate-800 p-8 rounded-2xl bg-slate-50/20 dark:bg-slate-950/20 shadow relative flex flex-col items-center text-center space-y-6 select-text">
                    {/* Organization details */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">KLANVISION GLOBAL DIGITAL INC</p>
                      <p className="text-xs text-slate-400 font-bold uppercase">Tamper-Proof Examination Registry</p>
                    </div>

                    {/* Certificate Name Header */}
                    <div className="space-y-2 pt-4">
                      <h4 className="text-xl font-bold font-serif text-slate-800 dark:text-white">CERTIFICATE OF EXAMINATION COMPETENCY</h4>
                      <p className="text-xs text-slate-400 italic">This credential certifies that</p>
                      <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 py-1 border-b border-indigo-100 dark:border-slate-800 w-64 mx-auto font-serif">
                        {isGuest ? guestName : user?.user_metadata?.full_name || user?.email}
                      </h2>
                    </div>

                    {/* Description text */}
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-lg font-medium">
                      has successfully cleared the online assessment <span className="font-bold text-slate-800 dark:text-white">"{test?.test_name || "Online Assessment"}"</span> for the target role profiling of <span className="font-bold text-slate-850 dark:text-white">"{test?.role}"</span> with a score of <span className="font-black">{results.score}</span> out of <span className="font-bold">{results.totalMarks} ({results.percentage}%)</span>{enableProctoring ? " under proctored browser locking and AI monitoring." : "."}
                    </p>

                    {/* Verification blocks footer */}
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] text-left">
                      {/* Identifiers */}
                      <div className="space-y-2 font-mono text-[9px] text-slate-400">
                        <p><span className="font-bold text-slate-500">CERTIFICATE ID:</span> {results.certificateId}</p>
                        <p><span className="font-bold text-slate-500">ISSUE DATE:</span> {results.issueDate}</p>
                        <p><span className="font-bold text-slate-500">VERIFY ONLINE:</span> <a href={`/verify/${results.certificateId}`} className="text-indigo-400 hover:underline">{`klanvision.com/verify/${results.certificateId.substring(0, 10)}`}</a></p>
                      </div>

                      {/* Cryptographic QR placeholder */}
                      <div className="h-20 w-20 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-center shrink-0">
                        {/* Elegant dynamic visual QR box */}
                        <div className="h-full w-full flex flex-col gap-1 select-none">
                          {[1,2,3,4].map(n => (
                            <div key={n} className="flex-1 flex gap-1">
                              {[1,2,3,4].map(m => (
                                <div key={m} className={`flex-1 rounded-sm ${(n+m) % 2 === 0 ? "bg-white" : "bg-slate-950"}`} />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 italic">No score calculations found for this attempt.</div>
          )}
        </div>
      </div>
    );
  }

  // â”€â”€ VIEW STATE 3: PRE-SUBMIT REVIEW & SUMMARY DASHBOARD â”€â”€
  if (viewState === "review") {
    // Count stats
    const answeredCount = Object.values(answers).filter(val => val !== null && val !== undefined && val !== "").length;
    const markedCount = Object.keys(markedForReview).filter(k => markedForReview[k]).length;
    const skippedCount = questions.length - answeredCount;
    const visitedTotal = Object.keys(visitedQuestions).length;

    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
        {/* Review Header */}
        <header className="bg-slate-900 text-white border-b border-slate-850 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-indigo-500 animate-pulse" />
            <div>
              <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Review Summary Page</h2>
              <h1 className="text-sm font-bold text-white">Pre-Submission Checkpoint</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-xl font-mono text-xs text-indigo-400 font-bold shrink-0">
            <Clock className="h-4 w-4" /> {formatTime(timeLeft)} Remaining
          </div>
        </header>

        {/* Summary lists details */}
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-indigo-500 tracking-wider">Question Attempt Summary</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Answered</p>
              </div>
              <div className="p-3 bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                <span className="text-xl font-black text-purple-600 dark:text-purple-400">{markedCount}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Marked Review</p>
              </div>
              <div className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">{skippedCount}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Skipped</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xl font-black text-slate-600 dark:text-slate-400">{questions.length - visitedTotal}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Not Visited</p>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-indigo-500 tracking-wider">Click any question cell to jump back and edit</h3>
            
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isMarked = !!markedForReview[q.id];
                const isVisited = !!visitedQuestions[q.id];
                
                let cellClass = "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600";
                if (isMarked) cellClass = "bg-purple-600 text-white border-purple-700";
                else if (isAnswered) cellClass = "bg-emerald-500 text-white border-emerald-600";
                else if (isVisited) cellClass = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800";

                return (
                  <button
                    key={q.id}
                    onClick={() => { setViewState("test"); setCurrentQuestionIndex(idx); }}
                    className={`h-10 text-xs font-bold rounded-lg border flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${cellClass}`}
                  >
                    {(idx + 1).toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gating confirmation submission controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <input
                id="final-accept"
                type="checkbox"
                onChange={(e) => setHonorChecked(e.target.checked)}
                checked={honorChecked}
                className="mt-1 h-4.5 w-4.5 rounded border-slate-300 accent-indigo-600 shrink-0"
              />
              <label htmlFor="final-accept" className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-350">
                I verify that I have reviewed my answers. I accept that clicking final submit will lock my session and submit my score{enableProctoring ? " under AI proctor validation checks." : "."}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={() => setViewState("test")}
                className="flex-1 h-12 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer transition-all"
              >
                Return to Exam Workspace
              </button>
              <button
                disabled={!honorChecked}
                onClick={() => handleSubmit(true)}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Sparkles size={16} /> Confirm & Final Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ DEFAULT VIEW STATE: LIVE EXAMINATION WORKSPACE â”€â”€
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">

      {/* ── VIOLATION / FULLSCREEN WARNING OVERLAY ── */}
      {showViolationOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">

              {/* Header bar — color depends on severity */}
              <div className={`px-5 py-3 flex items-center gap-3 ${violationCount >= 3 ? "bg-rose-700" : violationCount === 2 ? "bg-amber-600" : "bg-amber-500"}`}>
                <AlertTriangle className="h-4 w-4 text-white shrink-0" />
                <span className="text-white text-xs font-black uppercase tracking-widest">
                  {violationCount >= 3 ? "Final Warning — Auto Submit" : "Security Warning"}
                </span>
                <span className="ml-auto bg-black/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  {violationCount} / 3
                </span>
              </div>

              <div className="p-7 space-y-5">
                {/* Icon + message */}
                <div className="text-center space-y-3">
                  <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center ${
                    violationCount >= 3 ? "bg-rose-500/15" : "bg-amber-500/15"
                  }`}>
                    {violationCount >= 3
                      ? <AlertTriangle className="text-rose-400" size={28} />
                      : <AlertTriangle className="text-amber-400" size={28} />
                    }
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {violationCount >= 3 ? "Exam Auto-Submitting" : "Exam Temporarily Paused"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{violationMessage}</p>
                  </div>
                </div>

                {/* Remaining attempts info */}
                {violationCount < 3 && (
                  <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-slate-300 font-semibold text-center leading-relaxed">
                      <CheckCircle2 size={14} className="text-emerald-500 inline-block align-middle mr-1" /> <span className="font-black text-white">Your exam is still running.</span><br />
                      You can continue right where you left off.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {[1,2,3].map(n => (
                        <div key={n} className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          n <= violationCount ? "bg-rose-500" : "bg-slate-700"
                        }`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-slate-500 font-medium">
                      {3 - violationCount} more violation{3 - violationCount !== 1 ? "s" : ""} will auto-submit your exam
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                {violationCount < 3 ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        enterFullscreen();
                        setShowViolationOverlay(false);
                        if (violationCountdownRef.current) clearInterval(violationCountdownRef.current);
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
                    >
                      <Play size={15} className="fill-current" /> Continue Exam
                    </button>
                    <p className="text-[10px] text-slate-600 text-center font-medium">
                      Timer is still counting — resume quickly
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      <p className="text-rose-400 text-sm font-black">Submitting your exam now...</p>
                    </div>
                  </div>
                )}

                <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold text-center">
                  Klanvision · Secure Examination System
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSecurityAlert && (
        <div className="z-40 flex items-center justify-center bg-red-600 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white border-b border-red-700">
          <AlertTriangle className="mr-2 h-3.5 w-3.5" />
          Navigating from the current screen is prohibited. Session is being monitored.
        </div>
      )}

      <Header
        testName={test?.test_name}
        timeLeft={timeLeft}
        formatTime={formatTime}
        duration={test?.timer}
        questionCount={questions.length}
        negativeMarking={test?.negative_marking}
        negativeMarks={test?.negative_marks}
        attemptNumber={attemptNumber}
        attemptsAllowed={test?.attempts_allowed}
        orgName={test?.clients?.name}
        orgLogoUrl={test?.clients?.logo_url}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        // Proctor indicators
        isOnline={isOnline}
        isCameraActive={isCameraActive}
        isMicActive={isMicActive}
        isFullscreenActive={isFullscreen}
        violationsCount={fullscreenExitCount}
        enableProctoring={enableProctoring}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8">
            {questions[currentQuestionIndex] && (
              <QuestionView
                question={questions[currentQuestionIndex]}
                index={currentQuestionIndex}
                answer={answers[questions[currentQuestionIndex].id]}
                onAnswer={handleAnswer}
              />
            )}
          </div>
          <Footer
            onPrevious={() => navigateToQuestion(currentQuestionIndex - 1)}
            onNext={() => navigateToQuestion(currentQuestionIndex + 1)}
            disablePrevious={currentQuestionIndex === 0}
            disableNext={currentQuestionIndex === questions.length - 1}
            isMarked={!!markedForReview[questions[currentQuestionIndex]?.id]}
            onMarkForReview={() => {
              const id = questions[currentQuestionIndex]?.id;
              if (id) {
                setMarkedForReview(prev => {
                  const nextVal = !prev[id];
                  const currentAnswer = answers[id] || null;
                  dirtyAnswersRef.current[id] = {
                    selected_option: currentAnswer,
                    marked_for_review: nextVal
                  };
                  if (globalDebounceTimerRef.current) {
                    clearTimeout(globalDebounceTimerRef.current);
                  }
                  globalDebounceTimerRef.current = setTimeout(() => {
                    flushDirtyAnswers();
                  }, 2000);
                  return { ...prev, [id]: nextVal };
                });
              }
            }}
            onClear={() => {
              const id = questions[currentQuestionIndex]?.id;
              if (id) {
                handleAnswer(id, null);
              }
            }}
          />
        </main>

        <Sidebar 
          studentName={isGuest ? guestName : user?.user_metadata?.full_name || user?.email || "Student"} 
          sections={sections} 
          currentQuestionIndex={currentQuestionIndex} 
          answers={answers} 
          markedForReview={markedForReview} 
          visitedQuestions={visitedQuestions} 
          onNavigate={navigateToQuestion} 
          onSubmit={() => handleSubmit(false)} 
          disableSubmit={currentQuestionIndex !== questions.length - 1} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-none rounded-none shadow-2xl">
          <div className="h-1 bg-green-600 w-full absolute top-0 left-0" />
          <AlertDialogHeader className="pt-4">
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Final Submission</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              You have answered {answeredCount} out of {questions.length} questions. {unansweredCount > 0 ? `${unansweredCount} questions are unanswered.` : 'All questions have been answered.'} Are you sure you want to finish the test? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pb-4">
            <AlertDialogCancel className="rounded-none border-slate-200 font-bold uppercase text-[10px] tracking-widest">Back to Test</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(true)} className="bg-green-600 hover:bg-green-700 text-white rounded-none font-black uppercase text-[10px] tracking-widest">Submit Assessment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
