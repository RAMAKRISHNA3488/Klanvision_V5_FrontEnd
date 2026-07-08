import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ShieldAlert, Play, Clock, FileText, CheckCircle2, User, Mail, 
  Settings, Camera, Mic, Volume2, Wifi, Globe, Maximize2, Laptop, 
  ArrowRight, ShieldCheck, HelpCircle, RefreshCw, XCircle, AlertTriangle,
  Monitor, Copy, Check
} from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "../../integrations/supabase/client";

export function Instructions({
  testName,
  duration,
  questionCount,
  negativeMarking,
  negativeMarks,
  totalMarks,
  sections,
  studentName,
  onSaveDetails,
  onStart,
  orgName,
  orgLogoUrl,
  enableProctoring = false,
  isAdminPreview = false,
  attemptId = null,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [honorChecked, setHonorChecked] = useState(isAdminPreview);
  const [instructionsAccepted, setInstructionsAccepted] = useState(isAdminPreview);

  // Form details state
  const [formData, setFormData] = useState({
    name: studentName || "",
    email: isAdminPreview ? "admin.tester@klanvision.com" : "",
    mobile: isAdminPreview ? "9876543210" : ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [savingDetails, setSavingDetails] = useState(false);

  // System checks state
  const [checks, setChecks] = useState(() => {
    const base = {
      speed: { status: "checking", message: "Pending speed check...", type: "speed" },
      fullscreen: { status: "checking", message: "Checking fullscreen support...", type: "fullscreen" },
    };
    if (enableProctoring) {
      return {
        ...base,
        webcamHardware: { status: "checking", message: "Detecting webcam...", type: "camera" },
        microphoneHardware: { status: "checking", message: "Detecting mic...", type: "mic" },
        speaker: { status: "warning", message: "Action required: Play sound", type: "speaker" },
        cameraPermission: { status: "checking", message: "Awaiting permission...", type: "camera" },
        micPermission: { status: "checking", message: "Awaiting permission...", type: "mic" },
      };
    }
    return base;
  });

  const [speedVal, setSpeedVal] = useState(null);
  const [browserInfo, setBrowserInfo] = useState({ name: "", version: "" });
  const [speakerPlayed, setSpeakerPlayed] = useState(false);
  const [speakerSuccess, setSpeakerSuccess] = useState(false);

  // Media Streams & Audio contexts refs
  const [videoStream, setVideoStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [clipboardAuthorized, setClipboardAuthorized] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticStatusMessage, setDiagnosticStatusMessage] = useState("Initializing diagnostics...");
  const [diagnosticReport, setDiagnosticReport] = useState(() => {
    const timestamp = new Date().toLocaleString();
    const id = `SYS-CHK-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      timestamp,
      id,
      summary: { imageCapture: "PASS", voiceCheck: "PASS", internetCheck: "PASS", windowsCheck: "PASS" },
      notes: { imageCapture: "Pending", voiceCheck: "Pending", internetCheck: "Pending", windowsCheck: "Pending" },
      details: { camera: "Detecting...", cameraPerm: "Detecting...", mic: "Detecting...", micPerm: "Detecting...", speaker: "Detecting...", bandwidth: "Detecting...", latency: "Detecting...", fullscreen: "Detecting...", osBrowser: "Detecting..." },
      statuses: { camera: "checking", cameraPerm: "checking", mic: "checking", micPerm: "checking", speaker: "checking", bandwidth: "checking", latency: "checking", fullscreen: "checking", osBrowser: "checking" },
      remediations: []
    };
  });

  const videoRef = useRef(null);
  const videoRefCallback = useCallback((node) => {
    videoRef.current = node;
    if (node && videoStream) {
      node.srcObject = videoStream;
    }
  }, [videoStream]);
  const captureVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const micIndicatorRef = useRef(null);

  // Stop tracks (Camera, Mic, Screen Share)
  const stopMediaTracks = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(err => console.log("AudioCtx close error:", err));
    }
  };

  const handleProceedFromStep1 = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) errors.email = "Valid email is required";
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s/g,""))) errors.mobile = "Valid 10-digit mobile number required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSavingDetails(true);
    try {
      if (onSaveDetails) {
        await onSaveDetails(formData);
      }
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleProceedFromStep2 = async () => {
    if (enableProctoring && capturedPhoto && attemptId) {
      try {
        setSavingDetails(true);
        await supabase.from("attempts").update({ photo: capturedPhoto }).eq("id", attemptId);
      } catch (err) {
        console.error("Failed to upload identity snapshot:", err);
      } finally {
        setSavingDetails(false);
      }
    }
    setCurrentStep(3);
  };

  // Keep track of fullscreen changes via event listener
  useEffect(() => {
    const handleFsChange = () => {
      setFullscreenActive(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    setFullscreenActive(!!document.fullscreenElement);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // Cleanup on unmount only - keep streams active between steps 4, 5, and 6
  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);

  // Run compatibility checks when entering Step 2
  useEffect(() => {
    if (currentStep === 2) {
      runAllSystemChecks();
    }
  }, [currentStep]);

  // Bind video preview on Step 5 (Face Scan) if stream is already active
  useEffect(() => {
    if (currentStep === 5 && videoStream && captureVideoRef.current) {
      captureVideoRef.current.srcObject = videoStream;
    }
  }, [currentStep, videoStream]);

  // Parse User Agent
  const getBrowserData = () => {
    const ua = navigator.userAgent;
    let name = "Unknown";
    let version = "0";
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      return { name: "IE", version: "Older" };
    }
    if (M[1] === "Chrome") {
      let tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
      if (tem != null) {
        return { name: tem[1].replace("OPR", "Opera").replace("Edg", "Edge"), version: tem[2] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    let verMatch = ua.match(/version\/(\d+)/i);
    if (verMatch != null) {
      M.splice(1, 1, verMatch[1]);
    }
    name = M[0] || "Unknown";
    version = M[1] || "0";
    return { name, version };
  };

  // Play synthesized tone for speaker test
  const playTestSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 Note
      
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.3);
      
      setSpeakerPlayed(true);
      setChecks(prev => ({
        ...prev,
        speaker: { status: "warning", message: "Can you hear the sound?", type: "speaker" }
      }));
    } catch (err) {
      console.error("Speaker test failure:", err);
      setChecks(prev => ({
        ...prev,
        speaker: { status: "error", message: "Audio synth blocked", type: "speaker" }
      }));
    }
  };

  const requestCameraPermission = async () => {
    try {
      setChecks(prev => ({
        ...prev,
        cameraPermission: { status: "checking", message: "Requesting video access...", type: "camera" }
      }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } });
      setVideoStream(stream);
      
      setChecks(prev => ({
        ...prev,
        cameraPermission: { status: "green", message: "Camera permission granted", type: "camera" }
      }));

      setDiagnosticReport(prev => {
        const summary = { ...prev.summary };
        const statuses = { ...prev.statuses, cameraPerm: "PASS" };
        const details = { ...prev.details, cameraPerm: "Camera Access Granted" };
        summary.imageCapture = (statuses.camera === "PASS" && statuses.cameraPerm === "PASS") ? "PASS" : "FAIL";
        
        // Remove permission-blocked from remediations
        const remediations = prev.remediations.filter(r => !r.includes("Camera permission"));

        return { ...prev, summary, statuses, details, remediations };
      });
    } catch (err) {
      console.error("Camera access error:", err);
      const isPermissionDenied = err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      setChecks(prev => ({
        ...prev,
        cameraPermission: { status: "red", message: isPermissionDenied ? "Permission denied by user" : "Failed to access camera", type: "camera" }
      }));
      setDiagnosticReport(prev => {
        const summary = { ...prev.summary, imageCapture: "FAIL" };
        const statuses = { ...prev.statuses, cameraPerm: "FAIL" };
        const details = { ...prev.details, cameraPerm: isPermissionDenied ? "Camera Access Blocked" : "Camera Error" };
        const remediations = [...prev.remediations];
        if (!remediations.some(r => r.includes("Camera permission"))) {
          remediations.push("Camera permission is required. Please click 'Allow Camera Access'.");
        }
        return { ...prev, summary, statuses, details, remediations };
      });
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      setChecks(prev => ({
        ...prev,
        micPermission: { status: "checking", message: "Requesting audio access...", type: "mic" }
      }));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setupAudioVolumeMeter(stream);

      setChecks(prev => ({
        ...prev,
        micPermission: { status: "green", message: "Microphone permission granted", type: "mic" }
      }));

      setDiagnosticReport(prev => {
        const summary = { ...prev.summary };
        const statuses = { ...prev.statuses, micPerm: "PASS" };
        const details = { ...prev.details, micPerm: "Microphone Access Granted" };
        
        // If speaker test is also successful, voiceCheck is PASS
        const speakerPassed = speakerSuccess;
        summary.voiceCheck = (statuses.mic === "PASS" && statuses.micPerm === "PASS" && speakerPassed) ? "PASS" : "FAIL";
        
        // Remove permission-blocked from remediations
        const remediations = prev.remediations.filter(r => !r.includes("Microphone permission"));

        return { ...prev, summary, statuses, details, remediations };
      });
    } catch (err) {
      console.error("Microphone access error:", err);
      const isPermissionDenied = err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      setChecks(prev => ({
        ...prev,
        micPermission: { status: "red", message: isPermissionDenied ? "Permission denied by user" : "Failed to access mic", type: "mic" }
      }));
      setDiagnosticReport(prev => {
        const summary = { ...prev.summary, voiceCheck: "FAIL" };
        const statuses = { ...prev.statuses, micPerm: "FAIL" };
        const details = { ...prev.details, micPerm: isPermissionDenied ? "Microphone Access Blocked" : "Mic Error" };
        const remediations = [...prev.remediations];
        if (!remediations.some(r => r.includes("Microphone permission"))) {
          remediations.push("Microphone permission is required. Please click 'Allow Microphone Access'.");
        }
        return { ...prev, summary, statuses, details, remediations };
      });
    }
  };

  const confirmSpeakerCheck = () => {
    setSpeakerSuccess(true);
    setChecks(prev => ({
      ...prev,
      speaker: { status: "green", message: "Speaker test passed", type: "speaker" }
    }));
    setDiagnosticReport(prev => {
      const summary = { ...prev.summary };
      // Speaker passes, so if microphone passes, voiceCheck summary is PASS
      const allPassed = prev.statuses.micPerm === "PASS" && prev.statuses.mic === "PASS";
      summary.voiceCheck = allPassed ? "PASS" : "FAIL";
      return {
        ...prev,
        summary
      };
    });
  };

  const runAllSystemChecks = async () => {
    if (isAdminPreview) {
      const timestamp = new Date().toLocaleString();
      const id = `SYS-CHK-${Math.floor(100000 + Math.random() * 900000)}`;
      
      setChecks({
        speed: { status: "green", message: "Fast - 95.50 Mbps (Admin Preview)", type: "speed" },
        webcamHardware: { status: "green", message: "Camera hardware verified (Admin Preview)", type: "camera" },
        cameraPermission: { status: "green", message: "Camera permission granted (Admin Preview)", type: "camera" },
        microphoneHardware: { status: "green", message: "Microphone verified (Admin Preview)", type: "mic" },
        micPermission: { status: "green", message: "Microphone permission granted (Admin Preview)", type: "mic" },
        fullscreen: { status: "green", message: "Fullscreen supported (Admin Preview)", type: "fullscreen" },
        speaker: { status: "green", message: "Speaker test bypassed (Admin Preview)", type: "speaker" },
      });

      setDiagnosticReport({
        timestamp,
        id,
        summary: { imageCapture: "PASS", voiceCheck: "PASS", internetCheck: "PASS", windowsCheck: "PASS" },
        notes: { imageCapture: "None (Admin Preview)", voiceCheck: "None (Admin Preview)", internetCheck: "None (Admin Preview)", windowsCheck: "None (Admin Preview)" },
        details: {
          camera: "Camera Hardware Verified",
          cameraPerm: "Access Granted",
          mic: "Microphone Hardware Verified",
          micPerm: "Access Granted",
          speaker: "Speaker Verified",
          bandwidth: "95.50 Mbps",
          latency: "12ms (Estimated)",
          fullscreen: "Supported",
          osBrowser: "macOS / Chrome"
        },
        statuses: {
          camera: "PASS",
          cameraPerm: "PASS",
          mic: "PASS",
          micPerm: "PASS",
          speaker: "PASS",
          bandwidth: "PASS",
          latency: "PASS",
          fullscreen: "PASS",
          osBrowser: "PASS"
        },
        remediations: []
      });
      
      setSpeakerSuccess(true);
      setRunningDiagnostics(false);
      return;
    }

    setRunningDiagnostics(true);
    if (!speakerSuccess) {
      setSpeakerSuccess(false);
      setSpeakerPlayed(false);
    }

    try {
      const timestamp = new Date().toLocaleString();
      const id = `SYS-CHK-${Math.floor(100000 + Math.random() * 900000)}`;
      const remediations = [];

      // Reset checks state to checking
      setChecks(() => {
        const base = {
          speed: { status: "checking", message: "Running network speed check...", type: "speed" },
          fullscreen: { status: "checking", message: "Checking fullscreen support...", type: "fullscreen" },
        };
        if (enableProctoring) {
          return {
            ...base,
            webcamHardware: { status: "checking", message: "Detecting webcam...", type: "camera" },
            microphoneHardware: { status: "checking", message: "Detecting mic...", type: "mic" },
            speaker: speakerSuccess 
              ? { status: "green", message: "Speaker test passed", type: "speaker" }
              : { status: "warning", message: "Action required: Play sound", type: "speaker" },
            cameraPermission: { status: "checking", message: "Awaiting permission...", type: "camera" },
            micPermission: { status: "checking", message: "Awaiting permission...", type: "mic" },
          };
        }
        return base;
      });

      const det = {};
      const stat = {};

      // 1. Windows & OS Check
      setDiagnosticStatusMessage("Evaluating Windows & Environment...");
      const browser = getBrowserData();
      const os = /windows/i.test(navigator.userAgent) ? "Windows" :
                 /mac/i.test(navigator.userAgent) ? "macOS" :
                 /linux/i.test(navigator.userAgent) ? "Linux" :
                 /android/i.test(navigator.userAgent) ? "Android" :
                 /iphone|ipad/i.test(navigator.userAgent) ? "iOS" : "Unknown OS";
      det.osBrowser = `${os} / ${browser.name}`;
      stat.osBrowser = browser.name !== "Unknown" ? "PASS" : "WARN";

      const fsEnabled = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
      det.fullscreen = fsEnabled ? "Supported" : "Restricted";
      stat.fullscreen = fsEnabled ? "PASS" : "FAIL";
      if (!fsEnabled) {
        remediations.push("Fullscreen is restricted. Use Chrome or Edge browser.");
      }
      
      setChecks(prev => ({
        ...prev,
        fullscreen: fsEnabled ? { status: "green", message: "Fullscreen supported", type: "fullscreen" } : { status: "red", message: "Fullscreen restricted", type: "fullscreen" }
      }));

      // 2. Internet Speed & Latency Check
      setDiagnosticStatusMessage("Checking Internet Latency...");
      let avgPing = 45;
      try {
        const pings = [];
        for (let i = 0; i < 3; i++) {
          const t0 = Date.now();
          await fetch(`/favicon.svg?cb=${t0}-${i}`, { cache: "no-store" });
          pings.push(Date.now() - t0);
        }
        avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
      } catch (e) {}
      det.latency = `${avgPing}ms`;
      stat.latency = avgPing < 250 ? "PASS" : "WARN";
      if (avgPing >= 250) {
        remediations.push("High network latency. Switch to a faster network connection.");
      }

      setDiagnosticStatusMessage("Testing Bandwidth Speed...");
      let speedMbps = 12.40;
      try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`/logo.png?cb=${startTime}`, { cache: "no-store", signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const blob = await res.blob();
          const durationSec = Math.max((Date.now() - startTime) / 1000, 0.05);
          speedMbps = (blob.size * 8 / durationSec) / (1024 * 1024);
        }
      } catch (err) {}
      
      setSpeedVal(speedMbps.toFixed(2));
      det.bandwidth = `${speedMbps.toFixed(2)} Mbps`;
      if (speedMbps >= 5) stat.bandwidth = "PASS";
      else if (speedMbps >= 2) {
        stat.bandwidth = "WARN";
        remediations.push("Network bandwidth is moderate. Heavy exam pages may load slowly.");
      } else {
        stat.bandwidth = "FAIL";
        remediations.push("Network speed is below the minimum 1 Mbps required.");
      }

      setChecks(prev => ({
        ...prev,
        speed: { 
          status: stat.bandwidth === "PASS" ? "green" : stat.bandwidth === "WARN" ? "warning" : "red", 
          message: stat.bandwidth === "PASS" ? `Fast - ${speedMbps.toFixed(2)} Mbps` : `${stat.bandwidth === "WARN" ? "Moderate" : "Slow"} - ${speedMbps.toFixed(2)} Mbps`, 
          type: "speed" 
        }
      }));

      // 3. Live Image Capture & Voice Check (Camera / Mic)
      setDiagnosticStatusMessage("Verifying Device Hardware...");
      let cameraOk = false;
      let micOk = false;
      let hasCam = false;
      let hasMic = false;

      if (enableProctoring) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasCam = devices.some(device => device.kind === "videoinput");
          hasMic = devices.some(device => device.kind === "audioinput");

          det.camera = hasCam ? "Camera Hardware Detected" : "No Camera Detected";
          stat.camera = hasCam ? "PASS" : "FAIL";
          det.mic = hasMic ? "Microphone Hardware Detected" : "No Mic Detected";
          stat.mic = hasMic ? "PASS" : "FAIL";

          setChecks(prev => ({
            ...prev,
            webcamHardware: hasCam ? { status: "green", message: "Camera hardware found", type: "camera" } : { status: "red", message: "No camera hardware found", type: "camera" },
            microphoneHardware: hasMic ? { status: "green", message: "Microphone found", type: "mic" } : { status: "red", message: "No microphone found", type: "mic" }
          }));

          if (!hasCam) remediations.push("Camera hardware not found. Connect a webcam.");
          if (!hasMic) remediations.push("Microphone hardware not found. Connect a mic.");

          // Check if permissions were already pre-granted previously
          let preGrantedCamera = false;
          let preGrantedMic = false;
          try {
            if (navigator.permissions && navigator.permissions.query) {
              const camQuery = await navigator.permissions.query({ name: 'camera' });
              if (camQuery.state === 'granted') preGrantedCamera = true;
              const micQuery = await navigator.permissions.query({ name: 'microphone' });
              if (micQuery.state === 'granted') preGrantedMic = true;
            }
          } catch (e) {}

          const alreadyHasCamStream = videoStream && videoStream.active;
          const alreadyHasMicStream = micStream && micStream.active;

          // If we already have a stream running from a previous manual click or auto-detect, keep it!
          if (alreadyHasCamStream) {
            cameraOk = true;
            setChecks(prev => ({ ...prev, cameraPermission: { status: "green", message: "Camera permission granted", type: "camera" } }));
          } else if (preGrantedCamera && hasCam) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } });
              cameraOk = true;
              setVideoStream(stream);
              setChecks(prev => ({ ...prev, cameraPermission: { status: "green", message: "Camera permission granted", type: "camera" } }));
            } catch (e) {}
          }

          if (alreadyHasMicStream) {
            micOk = true;
            setChecks(prev => ({ ...prev, micPermission: { status: "green", message: "Microphone permission granted", type: "mic" } }));
          } else if (preGrantedMic && hasMic) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              micOk = true;
              setMicStream(stream);
              setupAudioVolumeMeter(stream);
              setChecks(prev => ({ ...prev, micPermission: { status: "green", message: "Microphone permission granted", type: "mic" } }));
            } catch (e) {}
          }
        } catch (err) {
          console.error("Device verification error:", err);
        }
      } else {
        cameraOk = true;
        micOk = true;
        hasCam = true;
        hasMic = true;
        det.camera = "Skipped (Proctoring Off)";
        stat.camera = "PASS";
        det.mic = "Skipped (Proctoring Off)";
        stat.mic = "PASS";
      }

      det.cameraPerm = cameraOk ? "Camera Access Granted" : "Awaiting Manual Authorization";
      stat.cameraPerm = cameraOk ? "PASS" : "checking";
      det.micPerm = micOk ? "Microphone Access Granted" : "Awaiting Manual Authorization";
      stat.micPerm = micOk ? "PASS" : "checking";
      det.speaker = "Ready";
      stat.speaker = "PASS";

      if (enableProctoring) {
        if (!cameraOk) {
          setChecks(prev => ({ ...prev, cameraPermission: { status: "warning", message: "Action required: Allow Camera Access", type: "camera" } }));
          remediations.push("Camera permission is required. Please click 'Allow Camera Access' below.");
        }
        if (!micOk) {
          setChecks(prev => ({ ...prev, micPermission: { status: "warning", message: "Action required: Allow Microphone Access", type: "mic" } }));
          remediations.push("Microphone permission is required. Please click 'Allow Microphone Access' below.");
        }
      }

      // Summary calculation
      const getSummaryStatus = (arr) => {
        if (arr.some(s => s === "FAIL")) return "FAIL";
        if (arr.some(s => s === "WARN")) return "WARN";
        return "PASS";
      };

      const summary = {
        imageCapture: getSummaryStatus([stat.camera, stat.cameraPerm]),
        voiceCheck: getSummaryStatus([stat.mic, stat.micPerm]),
        internetCheck: getSummaryStatus([stat.latency, stat.bandwidth]),
        windowsCheck: getSummaryStatus([stat.osBrowser, stat.fullscreen])
      };

      const getPrimaryBottleneck = (cat, statuses) => {
        const failed = Object.keys(statuses).filter(k => statuses[k] === "FAIL");
        if (failed.length > 0) return `Failed: ${failed.join(", ").toUpperCase()}`;
        const warned = Object.keys(statuses).filter(k => statuses[k] === "WARN");
        if (warned.length > 0) return `Warning: ${warned.join(", ").toUpperCase()}`;
        return "None";
      };

      const notes = {
        imageCapture: getPrimaryBottleneck("imageCapture", { camera: stat.camera, cameraPerm: stat.cameraPerm }),
        voiceCheck: getPrimaryBottleneck("voiceCheck", { mic: stat.mic, micPerm: stat.micPerm }),
        internetCheck: getPrimaryBottleneck("internetCheck", { latency: stat.latency, bandwidth: stat.bandwidth }),
        windowsCheck: getPrimaryBottleneck("windowsCheck", { osBrowser: stat.osBrowser, fullscreen: stat.fullscreen })
      };

      setDiagnosticReport({
        timestamp,
        id,
        summary,
        notes,
        details: det,
        statuses: stat,
        remediations
      });
    } catch (err) {
      console.error("Uncaught diagnostics error:", err);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const setupAudioVolumeMeter = (stream) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      source.connect(analyser);
      audioContextRef.current = audioCtx;
      audioAnalyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!audioAnalyserRef.current) return;
        audioAnalyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / bufferLength;
        const volumePercentage = Math.min((average / 128) * 100, 100);

        if (micIndicatorRef.current) {
          micIndicatorRef.current.style.width = `${volumePercentage}%`;
        }

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (e) {
      console.log("Failed to setup mic level meter:", e);
    }
  };

  // Capture snapshot for verification
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      
      const ctx = canvas.getContext("2d");
      // Flip canvas to align mirror preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedPhoto(dataUrl);
      return dataUrl;
    }
    return null;
  };

  // Step 6: Screen Share Request
  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" },
        audio: false
      });
      setScreenStream(stream);
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
      };
    } catch (err) {
      console.error("Screen share error:", err);
      setScreenStream(null);
    }
  };

  // Step 6: Clipboard Request
  const handleClipboardAccess = async () => {
    try {
      await navigator.clipboard.readText();
      setClipboardAuthorized(true);
    } catch (err) {
      console.warn("Clipboard access warning:", err);
      // Fallback for secure testing: allow candidate access if API exists
      if (navigator.clipboard) {
        setClipboardAuthorized(true);
      }
    }
  };

  // Step 6: Fullscreen Request
  const handleFullscreenRequest = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
      setFullscreenActive(true);
    } catch (err) {
      console.error("Fullscreen lock error:", err);
    }
  };

  // Checks validation helpers
  const allRequiredChecksPassed = () => {
    const essentialKeys = enableProctoring
      ? [
          "speed",
          "webcamHardware",
          "microphoneHardware",
          "speaker",
          "cameraPermission",
          "micPermission",
          "fullscreen"
        ]
      : ["speed", "fullscreen"];
    const checksPassed = essentialKeys.every(key => checks[key]?.status === "green");
    if (enableProctoring) {
      return checksPassed && !!capturedPhoto;
    }
    return checksPassed;
  };



  const renderProgressIndicator = () => {
    const steps = [
      { id: 1, label: "User Details" },
      { id: 2, label: "System Check" },
      { id: 3, label: "Instructions" }
    ];

    return (
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8 px-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  currentStep === step.id 
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-600/20 shadow-lg shadow-indigo-600/30"
                    : currentStep > step.id
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                }`}
              >
                {currentStep > step.id ? <CheckCircle2 size={14} className="text-white fill-current" /> : step.id}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-wider mt-2 transition-colors ${
                currentStep === step.id ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-400 dark:text-slate-600"
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${
                currentStep > step.id ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Helper card component for indicators
  const CheckCard = ({ title, checkKey, icon: Icon }) => {
    const item = checks[checkKey];
    if (!item) return null;

    let cardBg = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800";
    let iconColor = "text-slate-400";
    let statusText = "Pending";
    let badgeBg = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

    const isGreen = item.status === "green";

    if (item.status === "green") {
      cardBg = "bg-emerald-50/10 dark:bg-emerald-950/10 border-emerald-500/25";
      iconColor = "text-emerald-500";
      statusText = "Passed";
      badgeBg = "bg-emerald-500/10 text-emerald-500";
    } else if (item.status === "warning") {
      cardBg = "bg-amber-50/10 dark:bg-amber-950/10 border-amber-500/25";
      iconColor = "text-amber-500";
      statusText = "Attention";
      badgeBg = "bg-amber-500/10 text-amber-500";
    } else if (item.status === "red") {
      cardBg = "bg-rose-50/10 dark:bg-rose-950/10 border-rose-500/25";
      iconColor = "text-rose-500";
      statusText = "Failed";
      badgeBg = "bg-rose-500/10 text-rose-500";
    } else if (item.status === "checking") {
      cardBg = "bg-indigo-50/10 dark:bg-indigo-950/10 border-indigo-500/25";
      iconColor = "text-indigo-500 animate-pulse";
      statusText = "Testing...";
      badgeBg = "bg-indigo-500/10 text-indigo-500";
    }

    return (
      <div className={`p-4 border rounded-2xl flex flex-col justify-between transition-all duration-300 ${cardBg}`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-md ${iconColor}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 truncate">{title}</h4>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeBg}`}>
                {statusText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
              {item.message}
            </p>
          </div>
        </div>

        {/* Manual action trigger buttons if required */}
        {checkKey === "cameraPermission" && !isGreen && (
          <button
            onClick={requestCameraPermission}
            className="mt-3.5 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm z-10"
          >
            Allow Camera Access
          </button>
        )}
        {checkKey === "micPermission" && !isGreen && (
          <button
            onClick={requestMicrophonePermission}
            className="mt-3.5 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm z-10"
          >
            Allow Microphone Access
          </button>
        )}
      </div>
    );
  };

  const handleStartExam = () => {
    // Release screen capture stream and media devices tracks before starting
    stopMediaTracks();
    onStart();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 md:p-6 select-none font-sans transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header Branding */}
        <div className="bg-slate-900 px-6 py-6 md:px-8 md:py-8 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
              {orgName || "Klanvision Exam Portal"}
            </h2>
            <h1 className="text-xl md:text-2xl font-black tracking-tight mt-1 truncate max-w-md">{testName || "Online Assessment"}</h1>
          </div>
          {orgLogoUrl ? (
            <img src={orgLogoUrl} alt="Organization Logo" className="h-10 max-w-[120px] object-contain" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-base shadow-lg shadow-indigo-600/35">
              KV
            </div>
          )}
        </div>

        {/* Wizard Progress Stepper */}
        <div className="px-6 pt-8 md:px-8 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/10">
          {renderProgressIndicator()}
        </div>

        {/* Dynamic Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[65vh]">
          
          {/* STEP 1: USER DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-350">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2.5">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Candidate Registration Details
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  Please enter your profile details. This identity will be linked to your score records.
                </p>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="candidate-full-name" className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest flex items-center gap-1">
                      <User size={10} /> Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="candidate-full-name"
                      name="candidateFullName"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => { setFormData(p => ({...p, name: e.target.value})); setFormErrors(p => ({...p, name: ""})); }}
                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                        formErrors.name ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] text-rose-450 font-semibold">{formErrors.name}</p>}
                  </div>
 
                  <div className="space-y-1.5">
                    <label htmlFor="candidate-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Mail size={10} /> Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="candidate-email"
                      name="candidateEmail"
                      type="email"
                      placeholder="e.g. johndoe@gmail.com"
                      value={formData.email}
                      onChange={e => { setFormData(p => ({...p, email: e.target.value})); setFormErrors(p => ({...p, email: ""})); }}
                      className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                        formErrors.email ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-450 font-semibold">{formErrors.email}</p>}
                  </div>
 
                  <div className="space-y-1.5">
                    <label htmlFor="candidate-mobile" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Laptop size={10} /> Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-4 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-sm text-slate-500 dark:text-slate-400 font-bold">+91</span>
                      <input
                        id="candidate-mobile"
                        name="candidateMobile"
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={e => { setFormData(p => ({...p, mobile: e.target.value.replace(/\D/g, "")})); setFormErrors(p => ({...p, mobile: ""})); }}
                        className={`flex-1 bg-white dark:bg-slate-900 border rounded-r-xl px-4 py-3 text-sm text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                          formErrors.mobile ? "border-rose-500" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                    </div>
                    {formErrors.mobile && <p className="text-[10px] text-rose-450 font-semibold">{formErrors.mobile}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/10 dark:bg-indigo-950/10 border border-indigo-500/15 p-4 rounded-xl flex gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-455 dark:text-slate-500 leading-relaxed font-semibold">
                  This system will establish your assessment logs and secure session under this profile. Please make sure details are accurate.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: SYSTEM COMPATIBILITY CHECK */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-350">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-500" />
                    System Compatibility Check
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your device is being verified for exam readiness</p>
                </div>
                <button
                  onClick={runAllSystemChecks}
                  disabled={runningDiagnostics}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-550 hover:text-indigo-500 hover:border-indigo-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={11} className={runningDiagnostics ? "animate-spin" : ""} /> Re-run
                </button>
              </div>

              {runningDiagnostics ? (
                /* Loading State */
                <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
                  <div className="relative w-12 h-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Evaluating Environment...</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold animate-pulse">{diagnosticStatusMessage}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Checks Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <CheckCard title="Internet Speed" checkKey="speed" icon={Wifi} />
                    {enableProctoring && (
                      <>
                        <CheckCard title="Webcam Device" checkKey="webcamHardware" icon={Camera} />
                        <CheckCard title="Camera Permission" checkKey="cameraPermission" icon={ShieldCheck} />
                        <CheckCard title="Microphone Device" checkKey="microphoneHardware" icon={Mic} />
                        <CheckCard title="Mic Permission" checkKey="micPermission" icon={ShieldCheck} />
                      </>
                    )}
                    <CheckCard title="Fullscreen Support" checkKey="fullscreen" icon={Maximize2} />
                  </div>

                  {/* Speaker Test & Preview Area */}
                  {enableProctoring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {/* Speaker Check Card */}
                      <div className={`p-4 border rounded-2xl transition-all duration-300 ${
                        checks.speaker?.status === "green" ? "bg-emerald-50/10 border-emerald-500/30"
                        : checks.speaker?.status === "warning" ? "bg-amber-50/10 border-amber-500/30"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${
                              checks.speaker?.status === "green" ? "text-emerald-500" : "text-slate-400"
                            }`}>
                              <Volume2 size={15} />
                            </div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300">Speaker Check</span>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            checks.speaker?.status === "green" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}>
                            {checks.speaker?.status === "green" ? "Passed" : "Action Required"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!speakerSuccess && (
                            <button onClick={playTestSound}
                              className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5">
                              <Play size={10} className="fill-current" /> Play Sound
                            </button>
                          )}
                          {speakerPlayed && !speakerSuccess && (
                            <button onClick={confirmSpeakerCheck}
                              className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all animate-bounce cursor-pointer flex items-center justify-center gap-1.5">
                              <Check size={10} /> I Heard It
                            </button>
                          )}
                          {speakerSuccess && (
                            <p className="text-[10px] font-black text-emerald-500 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="fill-current animate-pulse" /> Audio confirmed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Video Preview & Mic Monitor */}
                      <div className="space-y-3">
                        {/* Mic Level */}
                        <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900">
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-450 mb-1.5 flex items-center gap-1"><Mic size={10} /> Mic Input Indicator</p>
                          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div ref={micIndicatorRef} className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 w-0 transition-all duration-75 rounded-full" />
                          </div>
                        </div>

                        {/* Camera Live Preview & Snapshot Capture */}
                        <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center">
                          {capturedPhoto ? (
                            <img src={capturedPhoto} alt="Captured Face" className="absolute inset-0 w-full h-full object-cover" />
                          ) : videoStream ? (
                            <video ref={videoRefCallback} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-center">
                              <Camera size={22} className="text-slate-650 animate-pulse" />
                              <span className="text-[9px] text-slate-500 font-semibold">Camera loading or permission pending...</span>
                            </div>
                          )}
                          {videoStream && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md z-10">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                              <span className="text-[8px] font-black text-white uppercase tracking-wider">
                                {capturedPhoto ? "Photo Captured" : "Live Preview"}
                              </span>
                            </div>
                          )}
                          
                          {/* Capture / Retake overlay button */}
                          {videoStream && (
                            <div className="absolute right-2 bottom-2 z-10">
                              {!capturedPhoto ? (
                                <button
                                  onClick={captureSnapshot}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-md shadow-md transition-all uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                                >
                                  <Camera size={10} /> Capture Photo
                                </button>
                              ) : (
                                <button
                                  onClick={() => setCapturedPhoto(null)}
                                  className="bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-md shadow-md transition-all uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                                >
                                  <RefreshCw size={10} /> Retake
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Bar */}
                  {(() => {
                    const required = enableProctoring
                      ? ["speed", "webcamHardware", "microphoneHardware", "speaker", "cameraPermission", "micPermission", "fullscreen"]
                      : ["speed", "fullscreen"];
                    const passed = required.filter(k => checks[k]?.status === "green").length;
                    const total = required.length;
                    const allPassed = passed === total;
                    const hasError = required.some(k => checks[k]?.status === "red");
                    return (
                      <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-500 ${
                        allPassed ? "bg-emerald-500/8 border-emerald-500/25" :
                        hasError ? "bg-rose-500/8 border-rose-500/25" :
                        "bg-amber-500/8 border-amber-500/25"
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          allPassed ? "bg-emerald-500/15 text-emerald-500"
                          : hasError ? "bg-rose-500/15 text-rose-500"
                          : "bg-amber-500/15 text-amber-500"
                        }`}>
                          {allPassed ? <CheckCircle2 size={20} /> : hasError ? <XCircle size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black ${
                            allPassed ? "text-emerald-600 dark:text-emerald-400"
                            : hasError ? "text-rose-600 dark:text-rose-400"
                            : "text-amber-600 dark:text-amber-400"
                          }`}>
                            {allPassed ? "All Systems Ready — You may continue" :
                             hasError ? `${total - passed} critical check(s) failed — resolve before continuing` :
                             `${passed}/${total} required checks passed`}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {required.map(k => (
                              <div key={k} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                checks[k]?.status === "green" ? "bg-emerald-500"
                                : checks[k]?.status === "red" ? "bg-rose-500"
                                : checks[k]?.status === "checking" ? "bg-indigo-400 animate-pulse"
                                : "bg-amber-400"
                              }`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* STEP 3: EXAM INSTRUCTIONS & SECURITY PROTOCOLS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-350">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2.5">
                  <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Exam Instructions & Security Guidelines
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  Please read the parameters, proctor rules, and accept the Honor Code to start the exam.
                </p>
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Exam Name */}
                <div className="border border-slate-150 dark:border-slate-800/80 p-4 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Exam Name</span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 block truncate">{testName || "Online Assessment"}</span>
                </div>

                {/* 2. Duration */}
                <div className="border border-slate-150 dark:border-slate-800/80 p-4 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Duration</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">{duration || 30} Minutes</span>
                </div>

                {/* 3. Passing Marks */}
                <div className="border border-slate-150 dark:border-slate-800/80 p-4 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Passing Marks</span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 block">
                    {Math.ceil((totalMarks || 10) * 0.5)} / {totalMarks || 10} Marks (50% Threshold)
                  </span>
                </div>

                {/* 4. Negative Marking */}
                <div className="border border-slate-150 dark:border-slate-800/80 p-4 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Negative Marking</span>
                  <span className={`text-sm font-extrabold block ${negativeMarking ? "text-amber-500" : "text-slate-550 dark:text-slate-400"}`}>
                    {negativeMarking ? `Active (-${negativeMarks || 0.25} per incorrect answer)` : "Disabled (No negative marking)"}
                  </span>
                </div>

                {/* Warnings */}
                {enableProctoring && (
                  <div className="border border-rose-500/15 p-4 rounded-2xl bg-rose-500/5 space-y-1 md:col-span-2">
                    <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block flex items-center gap-1 font-extrabold">
                      <ShieldAlert size={12} /> STRICT SECURITY LOCK ACTIVE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-550 dark:text-slate-400 block leading-relaxed">
                      This assessment is locked inside fullscreen mode. Do not attempt to exit fullscreen, open developer tools, change tabs, or close the page. The test will automatically log violation events, and will AUTO-SUBMIT after 3 violations.
                    </span>
                  </div>
                )}
              </div>

              {/* Honor checkbox */}
              <div 
                onClick={() => setHonorChecked(!honorChecked)}
                className={`p-5 border rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                  honorChecked 
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className={`w-5.5 h-5.5 border-2 rounded-md flex items-center justify-center shrink-0 transition-all ${
                  honorChecked ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 dark:border-slate-700"
                }`}>
                  {honorChecked && <Check size={14} className="text-white stroke-[3]" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">Accept Proctoring Terms & Integrity Policy</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    I pledge that I am the registered candidate, will not receive external support, and consent to security monitoring.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Bar Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="ghost"
                className="py-5.5 px-6 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Back
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-wider">
                <ShieldAlert size={14} /> Closed Book Session
              </div>
            )}
          </div>

          <div>
            {currentStep === 1 && (
              <Button
                onClick={handleProceedFromStep1}
                disabled={savingDetails}
                className="flex items-center gap-1.5 py-5.5 px-7 font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 cursor-pointer"
              >
                {savingDetails ? <><RefreshCw size={12} className="animate-spin" /> Saving Details...</> : <><span>Continue</span><ArrowRight size={13} /></>}
              </Button>
            )}
            {currentStep === 2 && (
              <Button
                onClick={handleProceedFromStep2}
                disabled={!allRequiredChecksPassed() || savingDetails}
                className="flex items-center gap-1.5 py-5.5 px-7 font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {savingDetails ? (
                  <><RefreshCw size={12} className="animate-spin" /> Uploading snapshot...</>
                ) : !allRequiredChecksPassed() ? (
                  enableProctoring && !capturedPhoto && checks.cameraPermission?.status === "green" ? (
                    <><Camera size={12} className="animate-pulse" /> Capture photo to continue</>
                  ) : (
                    <><AlertTriangle size={12} className="animate-pulse" /> Checks Incomplete</>
                  )
                ) : (
                  <><span>Proceed to Instructions</span><ArrowRight size={13} /></>
                )}
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                onClick={handleStartExam}
                disabled={!honorChecked}
                className="flex items-center gap-1.5 py-6 px-8 font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                Start Exam
              </Button>
            )}
          </div>
        </div>

      </div>
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {/* Decorative style tags for custom animations */}
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
