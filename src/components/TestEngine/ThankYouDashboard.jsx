import React, { useEffect, useState, useRef } from "react";
import { 
  ShieldCheck, Lock, CheckCircle2, FileText, BarChart3, Mail, 
  Award, Download, LogOut, ArrowRight, ShieldAlert, Info, Shield, Loader2
} from "lucide-react";
import { Button } from "../ui/button";

export function ThankYouDashboard({ attemptId, answeredCount, totalQuestions, testName, candidateName, candidateEmail, onExit }) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const canvasRef = useRef(null);

  const [downloading, setDownloading] = useState("idle");

  const handleDownload = () => {
    setDownloading("loading");
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/images/session_summary.png";
      link.download = "session_summary.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading("success");
      setTimeout(() => setDownloading("idle"), 3000);
    }, 800);
  };

  const handleEmailConfirmation = () => {
    const subject = encodeURIComponent(`🎓 Exam Submission Confirmation - ${candidateName || "Candidate"}`);
    const body = encodeURIComponent(
      `Hello Klanvision Team,\n\n` +
      `This email serves as my exam submission confirmation.\n\n` +
      `-- Exam Submission Metrics --\n` +
      `- Candidate Name: ${candidateName || "N/A"}\n` +
      `- Candidate Email: ${candidateEmail || "N/A"}\n` +
      `- Assessment Name: ${testName || "Exam Session"}\n` +
      `- Reference ID: ${attemptId || "N/A"}\n` +
      `- Questions Answered: ${answeredCount || 0} of ${totalQuestions || 0}\n` +
      `- Submission Time: ${currentTime}\n\n` +
      `-- Company Slogan --\n` +
      `Design for excellence. Built for performance.\n\n` +
      `Best regards,\n` +
      `${candidateName || "Candidate"}`
    );
    window.location.href = `mailto:klanphs.solutions@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleContactSupport = (e) => {
    if (e) e.preventDefault();
    const subject = encodeURIComponent(`🆘 Support Request - ${candidateName || "Candidate"}`);
    const body = encodeURIComponent(
      `Hello Klanvision Support Team,\n\n` +
      `I am writing to request support regarding my exam session.\n\n` +
      `[Please write your query/issue here]\n\n` +
      `-- Session Context --\n` +
      `- Candidate Name: ${candidateName || "N/A"}\n` +
      `- Candidate Email: ${candidateEmail || "N/A"}\n` +
      `- Reference ID: ${attemptId || "N/A"}\n\n` +
      `-- Company Slogan --\n` +
      `Design for excellence. Built for performance.`
    );
    window.location.href = `mailto:klanphs.solutions@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleExit = () => {
    window.location.href = "https://www.klanvision.com";
  };

  useEffect(() => {
    setMounted(true);
    // Format submission time
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }) + `, ${now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })}`;
    setCurrentTime(formatted);
  }, []);

  // ── Achievement Constellation Engine ──
  // Concept: floating glowing orbs drift slowly through space, connected by
  // faint constellation lines when close. Periodic success-pulse rings emanate
  // from the centre. Subtle aurora bands flow across the background.
  // Mood: calm · technical · triumphant — perfect for "Exam Submitted".
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0; // global time counter

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // ── Site colour palette ──
    const ORBS = [
      { color: "#818CF8", glow: "rgba(129,140,248," },  // indigo
      { color: "#00F2FE", glow: "rgba(0,242,254,"   },  // cyan
      { color: "#A78BFA", glow: "rgba(167,139,250," },  // violet
      { color: "#34D399", glow: "rgba(52,211,153,"  },  // emerald
      { color: "#F472B6", glow: "rgba(244,114,182," },  // pink
      { color: "#60A5FA", glow: "rgba(96,165,250,"  },  // sky
    ];

    // ── Celebratory Firecracker/Firework Engine ──
    class FireworkParticle {
      constructor(x, y, color, speedScale = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const baseSpeed = Math.random() * 5.0 + 2.0;
        this.vx = Math.cos(angle) * baseSpeed * speedScale;
        this.vy = Math.sin(angle) * baseSpeed * speedScale;
        this.gravity = Math.random() * 0.06 + 0.04;
        this.drag = Math.random() * 0.03 + 0.94;
        this.alpha = 1;
        this.decay = Math.random() * 0.024 + 0.016;
        this.size = Math.random() * 1.8 + 0.8;
        this.shimmerFreq = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        if (this.alpha <= 0) return;
        
        let currentAlpha = this.alpha;
        if (this.alpha < 0.7) {
          currentAlpha = this.alpha * (Math.sin(Date.now() * this.shimmerFreq) * 0.4 + 0.6);
        }
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.2) {
          ctx.lineWidth = this.size;
          ctx.strokeStyle = this.color;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - (this.vx * 1.8), this.y - (this.vy * 1.8));
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class Firework {
      constructor(x, y, isLarge = false) {
        this.x = x;
        this.y = y;
        this.particles = [];
        const fireworkColors = [
          "#FFD700", // gold
          "#FFFFFF", // spark white
          "#FF5722", // orange
          "#00F2FE", // cyan
          "#A78BFA", // violet
          "#F472B6", // pink
        ];
        
        const numParticles = isLarge ? 160 : (Math.floor(Math.random() * 20) + 55);
        const speedScale = isLarge ? 2.3 : 1.0;
        for (let i = 0; i < numParticles; i++) {
          const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
          this.particles.push(new FireworkParticle(this.x, this.y, color, speedScale));
        }
      }
      update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);
      }
      get done() {
        return this.particles.length === 0;
      }
      draw() {
        this.particles.forEach(p => p.draw());
      }
    }

    let fireworks = [];

    // Trackers for three sequential large shots distributed across the top of the page (above header text)
    let firstShotSpawned = false;
    let secondShotSpawned = false;
    let thirdShotSpawned = false;
    let activeSequentialFirework = null;
    let sequentialDelayCounter = 0;
    const DELAY_BETWEEN_SHOTS = 40; // ~0.65s delay between shots

    // Helper to get coordinates flanking the central dashboard box or header
    // 70% Top side, 30% Beside the "EXAM SUBMITTED SUCCESSFULLY!" header
    const getFramingCoords = () => {
      const rand = Math.random();
      let rx, ry;
      if (rand < 0.7) {
        // 70% chance: Top Side
        rx = Math.random() * (canvas.width * 0.7) + (canvas.width * 0.15);
        ry = Math.random() * (canvas.height * 0.15) + (canvas.height * 0.05);
      } else {
        // 30% chance: Beside the Header
        const isLeft = Math.random() > 0.5;
        if (isLeft) {
          // Left beside header
          rx = Math.random() * (canvas.width * 0.15) + (canvas.width * 0.1);
        } else {
          // Right beside header
          rx = Math.random() * (canvas.width * 0.15) + (canvas.width * 0.75);
        }
        ry = Math.random() * (canvas.height * 0.12) + (canvas.height * 0.22);
      }
      return { x: rx, y: ry };
    };

    // ── Animation loop ──
    const animate = () => {
      // Deep dark clear — clean each frame
      ctx.fillStyle = "rgba(2,5,18,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- SEQUENTIAL THREE LARGE SHOTS (Top of page, above EXAM SUBMITTED SUCCESSFULLY!) ---
      if (!firstShotSpawned && t >= 20) {
        const fw = new Firework(canvas.width * 0.25, canvas.height * 0.1, true); // Left-top
        fireworks.push(fw);
        activeSequentialFirework = fw;
        firstShotSpawned = true;
      }
      
      if (firstShotSpawned && !secondShotSpawned) {
        if (activeSequentialFirework && activeSequentialFirework.done) {
          sequentialDelayCounter++;
          if (sequentialDelayCounter >= DELAY_BETWEEN_SHOTS) {
            const fw = new Firework(canvas.width * 0.75, canvas.height * 0.1, true); // Right-top
            fireworks.push(fw);
            activeSequentialFirework = fw;
            secondShotSpawned = true;
            sequentialDelayCounter = 0;
          }
        }
      }
      
      if (secondShotSpawned && !thirdShotSpawned) {
        if (activeSequentialFirework && activeSequentialFirework.done) {
          sequentialDelayCounter++;
          if (sequentialDelayCounter >= DELAY_BETWEEN_SHOTS) {
            const fw = new Firework(canvas.width * 0.5, canvas.height * 0.08, true); // Center-top
            fireworks.push(fw);
            activeSequentialFirework = fw;
            thirdShotSpawned = true;
            sequentialDelayCounter = 0;
          }
        }
      }

      // --- REGULAR PERIODIC BLASTS (Only after the 3 sequential shots are complete) ---
      if (thirdShotSpawned && activeSequentialFirework && activeSequentialFirework.done) {
        if (t % 240 === 0) {
          const coords = getFramingCoords();
          fireworks.push(new Firework(coords.x, coords.y, false));
        }
      }

      // Fireworks (top layer)
      fireworks = fireworks.filter(f => !f.done);
      fireworks.forEach(f => { f.update(); f.draw(); });

      t++;
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`min-h-screen relative bg-[#020512] text-slate-100 font-sans px-4 py-8 md:px-8 flex flex-col items-center justify-between transition-opacity duration-500 overflow-x-hidden ${mounted ? "opacity-100" : "opacity-0"}`}>
      
      {/* Canvas Firecracker background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HEADER NAVIGATION (Exact Copy from candidate details header) ── */}
      <header className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#1E295D]/20 pb-5 mb-5 transition-all duration-300">
        <div className="flex items-center gap-4 -ml-4">
          <img
            src="/images/Transparent_Logo.png"
            alt="Klanvision Logo"
            onClick={() => window.location.href = "https://www.klanvision.com"}
            className="w-[80px] h-[80px] object-contain drop-shadow-[0_0_12px_rgba(124,58,237,0.5)] cursor-pointer"
          />
          <img
            src="/images/slogan.png"
            alt="Klanvision Slogan"
            className="h-[42px] w-auto object-contain"
          />
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {/* Header Item 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10.5 h-10.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Outfit'] font-black tracking-wide text-[13px] text-white uppercase">Enterprise Security</div>
              <div className="font-['Outfit'] font-semibold text-[#8B9BB4] text-[10.5px] mt-0.5">Your data is encrypted and 100% protected</div>
            </div>
          </div>
          {/* Header Item 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10.5 h-10.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Outfit'] font-black tracking-wide text-[13px] text-white uppercase">Private &amp; Confidential</div>
              <div className="font-['Outfit'] font-semibold text-[#8B9BB4] text-[10.5px] mt-0.5">Assessment logs are secure and private</div>
            </div>
          </div>
          {/* Header Item 3 */}
          <div className="flex items-center gap-3">
            <div className="w-10.5 h-10.5 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Outfit'] font-black tracking-wide text-[13px] text-white uppercase">Trusted by Top Companies</div>
              <div className="font-['Outfit'] font-semibold text-[#8B9BB4] text-[10.5px] mt-0.5">Built for performance. Designed for excellence.</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center py-10 gap-8 z-10">
        
        {/* Success Header Status */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Satisfaction Image replacing standard green tick — Very Big Size */}
          <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
            <div className="absolute inset-0 rounded-full border border-emerald-500/25 animate-[ping_4s_ease-in-out_infinite] opacity-50" />
            <div className="absolute inset-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]" />
            
            {/* Breathing/scaling animation wrapper */}
            <div className="w-32 h-32 rounded-full flex items-center justify-center z-10 animate-[pulse_3s_ease-in-out_infinite]">
              <img
                src="/images/stat_satisfaction.png"
                alt="Satisfaction Check"
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            <h2 className="text-[28px] md:text-[34px] font-black uppercase tracking-wider font-['Outfit']">
              EXAM SUBMITTED <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">SUCCESSFULLY!</span>
            </h2>
            <p className="text-[13px] md:text-sm text-slate-400 font-medium">
              Your examination session has been completed and submitted securely.
            </p>
          </div>
        </div>

        {/* Info Rows & Receipt Card */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          
          {/* Main Stats Receipt Box */}
          <div className="clay-card rounded-3xl p-6 md:p-8 divide-y divide-slate-800/60 shadow-2xl">
            
            {/* Reference ID */}
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center clay-pill">
                  <FileText className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-300 font-['Outfit']">Reference ID</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-100 select-all font-mono">{attemptId || "attempt-1783624787241-55"}</span>
            </div>

            {/* Submission Time */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center clay-pill">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-300 font-['Outfit']">Submission Time</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-100">{currentTime || "7 October 2026, 1:32:09 AM"}</span>
            </div>

            {/* Proctoring Security Status */}
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center clay-pill">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-300 font-['Outfit']">Proctoring Security</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-black text-[11px] uppercase tracking-wider font-['Outfit'] clay-pill bg-emerald-950/60 border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                Secure Record Synchronized
              </div>
            </div>

          </div>

          {/* Green alert ribbon */}
          <div className="flex items-start gap-4 clay-card clay-card-emerald p-5">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5" />
            <div className="text-left font-['Outfit']">
              <h4 className="text-[13.5px] font-extrabold text-white">Thank you for completing your assessment.</h4>
              <p className="text-[11.5px] text-emerald-100/90 mt-0.5 leading-relaxed font-medium">
                Your responses have been securely recorded and will be reviewed as per the evaluation process.
              </p>
            </div>
          </div>

        </div>

        {/* What Happens Next Block */}
        <div className="w-full max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-400 font-['Outfit'] whitespace-nowrap">What Happens Next?</span>
            <div className="h-px bg-[#1A2244] w-full" />
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 items-center">
            {/* Step 1 */}
            <div className="bg-[#070D1F]/30 border border-[#1A2244]/60 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <h5 className="text-[11.5px] font-extrabold text-slate-200">1. Review</h5>
                <p className="text-[9.5px] text-slate-500 mt-0.5">Your responses will be reviewed</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#070D1F]/30 border border-[#1A2244]/60 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/25 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4.5 h-4.5 text-[#00F2FE]" />
              </div>
              <div>
                <h5 className="text-[11.5px] font-extrabold text-slate-200">2. Evaluation</h5>
                <p className="text-[9.5px] text-slate-500 mt-0.5">Assessment will be evaluated</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#070D1F]/30 border border-[#1A2244]/60 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/25 flex items-center justify-center shrink-0">
                <Mail className="w-4.5 h-4.5 text-[#A78BFA]" />
              </div>
              <div>
                <h5 className="text-[11.5px] font-extrabold text-slate-200">3. Results</h5>
                <p className="text-[9.5px] text-slate-500 mt-0.5">Results will be sent to your email</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#070D1F]/30 border border-[#1A2244]/60 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <Award className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <h5 className="text-[11.5px] font-extrabold text-slate-200">4. Certification</h5>
                <p className="text-[9.5px] text-slate-500 mt-0.5">Eligible candidates receive certification</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── DATA SECURITY BANNER (Matching the exact screenshot layout & text) ─── */}
        <div className="w-full max-w-3xl bg-gradient-to-r from-[#0C122C]/40 to-[#060A18]/40 border border-[#1A2244]/85 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md backdrop-blur-md">
          {/* Left: Shield Lock & Text */}
          <div className="flex items-center gap-4 text-left">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-200 font-['Outfit']">Your Data is Safe &amp; Secure</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[340px] font-medium font-sans">
                We ensure the highest standards of security and privacy.<br />
                Your data will never be shared with third parties.
              </p>
            </div>
          </div>

          {/* Right: 3 side-by-side badges with vertical dividers */}
          <div className="flex items-center gap-6 shrink-0 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-[#1A2244] pt-4 lg:pt-0 lg:pl-6">
            
            {/* End-to-End Encryption */}
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div className="font-['Outfit']">
                <h6 className="text-[10px] font-black text-white leading-tight">End-to-End</h6>
                <p className="text-[8.5px] text-slate-400 font-semibold mt-0.5">Encryption</p>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#1A2244]" />

            {/* Secure Transmission */}
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <div className="font-['Outfit']">
                <h6 className="text-[10px] font-black text-white leading-tight">Secure</h6>
                <p className="text-[8.5px] text-slate-400 font-semibold mt-0.5">Transmission</p>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#1A2244]" />

            {/* Private & Confidential */}
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="font-['Outfit']">
                <h6 className="text-[10px] font-black text-white leading-tight">Private &amp;</h6>
                <p className="text-[8.5px] text-slate-400 font-semibold mt-0.5">Confidential</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer buttons row */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full md:w-auto h-12 flex items-center justify-center gap-2.5 font-extrabold uppercase tracking-wider text-[11px] font-['Outfit'] border-[#202750] !bg-[#050B1E] text-[#A5B4FC] hover:!text-white hover:!bg-[#0C122C] hover:border-slate-500 transition-all duration-300 rounded-xl px-6 hover:scale-[1.02] active:scale-[0.98]"
            disabled={downloading === "loading"}
          >
            {downloading === "loading" ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : downloading === "success" ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            ) : (
              <Download className="w-4.5 h-4.5 transition-transform group-hover:translate-y-0.5" />
            )}
            {downloading === "loading" ? "Downloading..." : downloading === "success" ? "Downloaded!" : "Download Session Summary"}
          </Button>

          <Button
            onClick={handleEmailConfirmation}
            variant="outline"
            className="w-full md:w-auto h-12 flex items-center justify-center gap-2.5 font-extrabold uppercase tracking-wider text-[11px] font-['Outfit'] border-[#202750] !bg-[#050B1E] text-[#A5B4FC] hover:!text-white hover:!bg-[#0C122C] hover:border-slate-500 transition-all duration-300 rounded-xl px-6 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="w-4.5 h-4.5" />
            Email Me Confirmation
          </Button>

          <Button
            onClick={handleExit}
            className="w-full md:w-auto group h-12 flex items-center justify-center gap-2.5 font-extrabold uppercase tracking-wider text-[11px] font-['Outfit'] bg-gradient-to-r from-indigo-600 to-[#2E6FF3] hover:from-indigo-700 hover:to-[#1754D7] text-white border-0 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl px-8"
          >
            Exit Exam Portal
            <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

      </div>

      {/* ── FOOTER SUPPORT LINK ── */}
      <div className="w-full max-w-3xl bg-[#070D1F]/40 border border-[#1A2244]/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:border-indigo-500/35 transition-all duration-500 backdrop-blur-md mt-8 z-10">
        
        {/* Left Side: Info Icon & Text */}
        <div className="flex items-center gap-4 text-left w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
            <Info className="w-5.5 h-5.5 animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-indigo-300 font-['Outfit'] tracking-wide">Need Help?</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>

        {/* Right Side: Action Link */}
        <button 
          onClick={handleContactSupport}
          className="group flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-indigo-400 hover:text-cyan-400 font-['Outfit'] transition-all duration-300 shrink-0 border border-indigo-500/10 hover:border-cyan-500/25 bg-[#0C122C]/40 px-4 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Mail className="w-4 h-4" />
          Contact Support
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

      </div>

    </div>
  );
}
