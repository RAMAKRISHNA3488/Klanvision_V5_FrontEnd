// ============================================================
// VerificationPortal.jsx
// Luxury Enterprise Certificate Verification Portal
// Animated particle network background | Deep navy + gold
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Search, ArrowRight, Lock, Home,
  Calendar, User, BookOpen, Briefcase, Award, Globe,
  Database, CheckCircle, CheckCircle2, AlertCircle, FileText, Building, Download, Eye, MapPin, ChevronRight, X, Phone, Mail, Fingerprint, Code, Landmark, Hash, RefreshCw, AudioLines, Volume2, VolumeX
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import Particles from './Particles';
import CertificateReplica from './CertificateReplica';
import { api, API_BASE_URL } from '../../utils/api';
import { useSEO } from '../../hooks/useSEO';
import TextType from './TextType';

// ─────────────────────────────────────────────────────────────
// PREMIUM IMAGE LOADER (Matches reference exactly)
// ─────────────────────────────────────────────────────────────
const PremiumImageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(prev => Math.max(prev, newProgress));
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 10px', background: 'transparent' }}>

      {/* 1. Shield Emblem with Radiating Waves */}
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>

        {/* Radiating Waves */}
        <motion.div animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.8)' }} />
        <motion.div animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.8)' }} />
        <motion.div animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.6, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.8)' }} />

        {/* Orbiting Green Ring */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px dashed rgba(74,222,128,0.4)', borderTopColor: '#4ade80', zIndex: 1 }}>
          <div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }} />
        </motion.div>

        {/* Shield Image Container */}
        <div style={{ position: 'relative', width: 90, height: 105, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
          {/* Shield Image */}
          <img
            src="/images/shield.png"
            alt="Shield"
            style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 5, filter: 'drop-shadow(0 0 15px rgba(74,222,128,0.5))', transform: 'scale(2.5)' }}
          />
        </div>
      </div>

      {/* 2. Text Content */}
      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 12px 0', textAlign: 'center' }}>
        <span style={{ color: 'white' }}>Verifying </span>
        <span style={{ color: '#4ade80' }}>Certificate...</span>
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', maxWidth: 360, margin: '0 0 28px 0', lineHeight: 1.5 }}>
        Please wait while we verify your certificate details with our secure system.
      </p>

      {/* 3. Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 420, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(74,222,128,0.2)' }}>
          <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: 5, boxShadow: '0 0 8px rgba(74,222,128,0.5)' }} />
        </div>
        <span style={{ color: '#4ade80', fontSize: 15, fontWeight: 600, width: 36 }}>{progress}%</span>
      </div>

      {/* 4. Secure Connection text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <ShieldCheck size={16} color="#4ade80" />
        <span style={{ color: '#4ade80', fontSize: 13 }}>Secure connection established</span>
      </div>

      {/* 5. Bottom Icons Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', maxWidth: 600, position: 'relative' }}>
        {/* Connecting Dashed Line */}
        <div style={{ position: 'absolute', top: 18, left: 50, right: 50, height: 1, borderTop: '2px dashed rgba(74,222,128,0.3)', zIndex: 0 }} />

        {/* Icon 1: Retrieving Data */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, flex: 1 }}>
          <motion.div animate={{ scale: [0.95, 1.05, 0.95], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(74,222,128,0.4)', '0 0 0px transparent'] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#021a11', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={16} color="#4ade80" />
          </motion.div>
          <span style={{ color: 'white', fontSize: 11, textAlign: 'center' }}>Retrieving<br />Data</span>
        </div>

        {/* Icon 2: Verifying Authenticity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, flex: 1 }}>
          <motion.div animate={{ scale: [0.95, 1.05, 0.95], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(74,222,128,0.4)', '0 0 0px transparent'] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#021a11', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#4ade80" />
          </motion.div>
          <span style={{ color: 'white', fontSize: 11, textAlign: 'center' }}>Verifying<br />Authenticity</span>
        </div>

        {/* Icon 3: Checking Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, flex: 1 }}>
          <motion.div animate={{ scale: [0.95, 1.05, 0.95], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(74,222,128,0.4)', '0 0 0px transparent'] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#021a11', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <FileText size={16} color="#4ade80" />
            <CheckCircle2 size={10} color="#4ade80" style={{ position: 'absolute', bottom: 6, right: 6, background: '#021a11', borderRadius: '50%' }} />
          </motion.div>
          <span style={{ color: 'white', fontSize: 11, textAlign: 'center' }}>Checking<br />Details</span>
        </div>

        {/* Icon 4: Finalizing Verification */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, flex: 1 }}>
          <motion.div animate={{ scale: [0.95, 1.05, 0.95], boxShadow: ['0 0 0px transparent', '0 0 10px rgba(74,222,128,0.4)', '0 0 0px transparent'] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#021a11', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fingerprint size={16} color="#4ade80" />
          </motion.div>
          <span style={{ color: 'white', fontSize: 11, textAlign: 'center' }}>Finalizing<br />Verification</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ANIMATED CANVAS BACKGROUND
// Particle network + floating shield glyphs — security theme
// ─────────────────────────────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Particle factory ──────────────────────────────────
    const PARTICLE_COUNT = 90;
    const CONNECTION_DIST = 160;
    const GOLD_COLORS = ['#C9A84C', '#D4B54E', '#E8C84A', '#F0D060', '#B8943C'];

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2.5 + 1,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      alpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2,   // phase offset for pulsing
      isNode: Math.random() > 0.8,            // 20% are "security nodes" (bigger)
    }));

    // ── Floating shield glyphs ────────────────────────────
    const GLYPHS = Array.from({ length: 7 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 28 + 14,
      alpha: Math.random() * 0.07 + 0.02,
      speed: (Math.random() - 0.5) * 0.22,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.004,
    }));

    function drawShield(cx, cy, size, alpha, rot) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.8, -size * 0.5);
      ctx.lineTo(size * 0.8, size * 0.1);
      ctx.quadraticCurveTo(size * 0.8, size * 0.9, 0, size);
      ctx.quadraticCurveTo(-size * 0.8, size * 0.9, -size * 0.8, size * 0.1);
      ctx.lineTo(-size * 0.8, -size * 0.5);
      ctx.closePath();
      ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // ── Lock / data icons (floating) ──────────────────────
    const LOCKS = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 16 + 8,
      alpha: Math.random() * 0.06 + 0.02,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));

    function drawLock(cx, cy, size, alpha) {
      ctx.save();
      ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
      ctx.lineWidth = 1;
      // Shackle
      ctx.beginPath();
      ctx.arc(cx, cy - size * 0.6, size * 0.4, Math.PI, 0);
      ctx.stroke();
      // Body
      ctx.strokeRect(cx - size * 0.5, cy - size * 0.3, size, size * 0.85);
      ctx.restore();
    }

    // ── Hexagonal subtle grid ────────────────────────────
    function drawHexGrid() {
      const hexSize = 70;
      const h = hexSize * Math.sqrt(3);
      ctx.strokeStyle = 'rgba(201,168,76,0.025)';
      ctx.lineWidth = 0.5;
      for (let row = -1; row < canvas.height / h + 2; row++) {
        for (let col = -1; col < canvas.width / (hexSize * 1.5) + 2; col++) {
          const x = col * hexSize * 1.5;
          const y = row * h + (col % 2 === 0 ? 0 : h / 2);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + hexSize * Math.cos(angle);
            const py = y + hexSize * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    // ── Main draw loop ───────────────────────────────────
    let frame = 0;
    function draw() {
      animId = requestAnimationFrame(draw);
      frame++;

      // Solid background matching the user's requested #000612 color
      ctx.fillStyle = '#000612';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Hexagonal grid
      drawHexGrid();

      // Center soft glow
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.35;
      const glowR = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width * 0.45);
      glowR.addColorStop(0, 'rgba(201,168,76,0.06)');
      glowR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating shield glyphs
      GLYPHS.forEach(g => {
        g.y += g.speed;
        g.rot += g.rotV;
        if (g.y > canvas.height + g.size * 2) g.y = -g.size * 2;
        if (g.y < -g.size * 2) g.y = canvas.height + g.size * 2;
        drawShield(g.x, g.y, g.size, g.alpha, g.rot);
      });

      // Floating lock icons
      LOCKS.forEach(l => {
        l.x += l.vx; l.y += l.vy;
        if (l.x < 0 || l.x > canvas.width) l.vx *= -1;
        if (l.y < 0 || l.y > canvas.height) l.vy *= -1;
        drawLock(l.x, l.y, l.size, l.alpha);
      });

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.pulse += 0.025;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Pulsing size for node particles
        const pulsedR = p.isNode ? p.r * (1.2 + 0.5 * Math.sin(p.pulse)) : p.r;
        const pulsedAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        // Outer glow ring for node particles
        if (p.isNode) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedR * 5);
          glowGrad.addColorStop(0, `rgba(201,168,76,${pulsedAlpha * 0.3})`);
          glowGrad.addColorStop(1, 'rgba(201,168,76,0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulsedR * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(pulsedAlpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.28;
            // Data pulse travelling along connection
            const pulseProgress = ((frame * 0.008 + i * 0.3) % 1);
            const px = particles[i].x + (particles[j].x - particles[i].x) * pulseProgress;
            const py = particles[i].y + (particles[j].y - particles[i].y) * pulseProgress;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Moving pulse dot on connection
            if (opacity > 0.1) {
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(240,208,96,${opacity * 2})`;
              ctx.fill();
            }
          }
        }
      }

      // Scanning line effect (slow horizontal sweep — like a security scanner)
      const scanY = (frame * 0.4) % (canvas.height + 120) - 60;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'rgba(201,168,76,0)');
      scanGrad.addColorStop(0.5, 'rgba(201,168,76,0.035)');
      scanGrad.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);
    }

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// PREMIUM SHIELD LOGO SVG
// ─────────────────────────────────────────────────────────────
function ShieldLogo() {
  return (
    <svg width="58" height="64" viewBox="0 0 58 64" fill="none">
      <defs>
        <linearGradient id="shGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E070" />
          <stop offset="40%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="shBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1c1a16" />
          <stop offset="100%" stopColor="#0a0908" />
        </linearGradient>
        <filter id="shGlow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M29 2 L55 12 L55 34 C55 50 42 61 29 63 C16 61 3 50 3 34 L3 12 Z"
        fill="url(#shBg)" stroke="url(#shGold)" strokeWidth="2.2" filter="url(#shGlow)" />
      <path d="M29 7 L50 16 L50 34 C50 47 39 56 29 59 C19 56 8 47 8 34 L8 16 Z"
        fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8" />
      <text x="29" y="41" textAnchor="middle" fill="url(#shGold)"
        fontSize="20" fontWeight="900" fontFamily="Georgia,serif" filter="url(#shGlow)">V</text>
      <ellipse cx="9" cy="36" rx="4" ry="2.2" transform="rotate(-38 9 36)" fill="#C9A84C" opacity="0.75" />
      <ellipse cx="7" cy="42" rx="4" ry="2.2" transform="rotate(-25 7 42)" fill="#C9A84C" opacity="0.75" />
      <ellipse cx="7" cy="48" rx="4" ry="2.2" transform="rotate(-12 7 48)" fill="#C9A84C" opacity="0.75" />
      <ellipse cx="49" cy="36" rx="4" ry="2.2" transform="rotate(38 49 36)" fill="#C9A84C" opacity="0.75" />
      <ellipse cx="51" cy="42" rx="4" ry="2.2" transform="rotate(25 51 42)" fill="#C9A84C" opacity="0.75" />
      <ellipse cx="51" cy="48" rx="4" ry="2.2" transform="rotate(12 51 48)" fill="#C9A84C" opacity="0.75" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ANIMATED SHIELD (result states)
// ─────────────────────────────────────────────────────────────
function AnimatedShield({ verified, invalid }) {
  return (
    <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid transparent',
          background: 'linear-gradient(#080808, #080808) padding-box, linear-gradient(360deg, #C9A84C, transparent, #C9A84C) border-box',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.12, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          position: 'absolute', inset: 10, borderRadius: '50%',
          border: `2px solid ${verified ? '#10B981' : invalid ? '#EF4444' : '#C9A84C'}`,
        }}
      />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <svg width="78" height="90" viewBox="0 0 90 105" fill="none">
          <defs>
            <linearGradient id="asBg"><stop offset="0%" stopColor="#1a5c2a" /><stop offset="100%" stopColor="#0a2d14" /></linearGradient>
            <linearGradient id="asGold"><stop offset="0%" stopColor="#F0D060" /><stop offset="50%" stopColor="#C9A84C" /><stop offset="100%" stopColor="#8B6914" /></linearGradient>
            <filter id="asGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path d="M45 3 L85 18 L85 48 C85 72 65 92 45 102 C25 92 5 72 5 48 L5 18 Z" fill="url(#asBg)" stroke="url(#asGold)" strokeWidth="2.5" filter="url(#asGlow)" />
          <path d="M45 10 L78 23 L78 48 C78 68 62 86 45 95 C28 86 12 68 12 48 L12 23 Z" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8" />
          <g fill="#C9A84C" opacity="0.75">
            <ellipse cx="18" cy="58" rx="5" ry="3" transform="rotate(-40 18 58)" />
            <ellipse cx="14" cy="65" rx="5" ry="3" transform="rotate(-30 14 65)" />
            <ellipse cx="12" cy="73" rx="5" ry="3" transform="rotate(-20 12 73)" />
            <ellipse cx="72" cy="58" rx="5" ry="3" transform="rotate(40 72 58)" />
            <ellipse cx="76" cy="65" rx="5" ry="3" transform="rotate(30 76 65)" />
            <ellipse cx="78" cy="73" rx="5" ry="3" transform="rotate(20 78 73)" />
          </g>
          {verified ? (
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }}
              d="M30 52 L42 64 L62 42" stroke="#F0D060" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#asGlow)" />
          ) : invalid ? (
            <><line x1="32" y1="40" x2="58" y2="66" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
              <line x1="58" y1="40" x2="32" y2="66" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" /></>
          ) : (
            <motion.path animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              d="M45 35 L45 58 M45 65 L45 68" stroke="#C9A84C" strokeWidth="5" strokeLinecap="round" fill="none" />
          )}
        </svg>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PREMIUM 3D-STYLE SHIELD BADGE (For Valid Result)
// ─────────────────────────────────────────────────────────────
function PremiumShieldBadge() {
  return (
    <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {/* Glow behind the shield */}
      <div style={{ position: 'absolute', inset: 40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 70%)', filter: 'blur(15px)' }} />

      {/* SVG for the shield and laurels */}
      <svg width="280" height="280" viewBox="0 0 200 200" style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E070" />
            <stop offset="30%" stopColor="#C9A84C" />
            <stop offset="70%" stopColor="#8B6914" />
            <stop offset="100%" stopColor="#F5E070" />
          </linearGradient>
          <linearGradient id="shieldGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3D23" />
            <stop offset="100%" stopColor="#041F10" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Subtle background circles */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />

        {/* Pedestal base */}
        <ellipse cx="100" cy="170" rx="45" ry="10" fill="url(#shieldGold)" filter="url(#dropShadow)" />
        <ellipse cx="100" cy="165" rx="45" ry="10" fill="#111" />
        <ellipse cx="100" cy="160" rx="35" ry="8" fill="url(#shieldGold)" />
        <ellipse cx="100" cy="155" rx="35" ry="8" fill="#111" />

        {/* Laurel Leaves (Simplified elegant curves) */}
        <path d="M40 145 C20 115 20 80 35 60" fill="none" stroke="url(#shieldGold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M160 145 C180 115 180 80 165 60" fill="none" stroke="url(#shieldGold)" strokeWidth="3" strokeLinecap="round" />
        {/* Leaf details */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <ellipse cx={32 + i * 3} cy={125 - i * 15} rx="6" ry="3" transform={`rotate(${30 - i * 15} ${32 + i * 3} ${125 - i * 15})`} fill="url(#shieldGold)" />
            <ellipse cx={168 - i * 3} cy={125 - i * 15} rx="6" ry="3" transform={`rotate(${-30 + i * 15} ${168 - i * 3} ${125 - i * 15})`} fill="url(#shieldGold)" />
          </g>
        ))}

        {/* Shield Body */}
        <path d="M100 25 L155 45 L155 95 C155 135 125 160 100 175 C75 160 45 135 45 95 L45 45 Z" fill="url(#shieldGreen)" stroke="url(#shieldGold)" strokeWidth="6" filter="url(#dropShadow)" strokeLinejoin="round" />

        {/* Inner Gold Border */}
        <path d="M100 35 L145 52 L145 95 C145 128 120 150 100 162 C80 150 55 128 55 95 L55 52 Z" fill="none" stroke="url(#shieldGold)" strokeWidth="2" strokeLinejoin="round" />

        {/* Checkmark */}
        <path d="M75 100 L92 115 L125 75" fill="none" stroke="url(#shieldGold)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" filter="url(#dropShadow)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TRUST BADGE
// ─────────────────────────────────────────────────────────────
function TrustBadge({ icon: Icon, imgSrc, imgAnim = 'spin', title, desc, delay, glowColor = '201,168,76', link }) {
  let animProps = { rotate: [0, 4, -4, 0] };
  let transProps = { duration: 6, repeat: Infinity, ease: 'easeInOut', delay };

  if (imgSrc) {
    if (imgAnim === 'database') {
      animProps = { scale: [1, 1.1, 1], y: [0, -4, 0] };
      transProps = { duration: 2, repeat: Infinity, ease: 'easeInOut', delay };
    } else if (imgAnim === 'protection') {
      animProps = { scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] };
      transProps = { duration: 3, repeat: Infinity, ease: 'easeInOut', delay };
    } else if (imgAnim === 'authenticate') {
      animProps = { scale: [1, 1.12, 1, 1.12, 1], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)', 'brightness(1.4)', 'brightness(1)'] };
      transProps = { duration: 4, repeat: Infinity, ease: 'easeInOut', delay };
    } else if (imgAnim === 'global') {
      animProps = { scale: [1, 1.18, 1] };
      transProps = { duration: 3, repeat: Infinity, ease: 'easeInOut', delay };
    } else {
      animProps = { rotateY: [0, 360] };
      transProps = { duration: 10, repeat: Infinity, ease: 'linear' };
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -10, scale: 1.02,
        background: '#0F172A',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        transition: { duration: 0.12, ease: 'easeOut' }
      }}
      transition={{ delay, duration: 0.6 }}
      className="clay-card clay-card-interactive"
      style={{
        flex: '1 1 200px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        padding: '36px 24px',
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.12s ease'
      }}
    >
      {/* Top color accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `rgb(${glowColor})`, borderRadius: '20px 20px 0 0' }} />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
        style={{
          marginBottom: 24,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 130,
          height: 130,
          perspective: 1000,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${glowColor},0.4) 0%, transparent 70%)`,
            boxShadow: `0 0 35px rgba(${glowColor},0.25)`
          }}
        />
        <motion.div
          animate={animProps}
          transition={transProps}
          style={{ position: 'relative', zIndex: 2, transformStyle: 'preserve-3d' }}
        >
          {imgSrc ? (
            <img src={imgSrc} alt={title} style={{ width: 110, height: 110, objectFit: 'contain', filter: `drop-shadow(0 0 16px rgba(${glowColor},0.7))` }} />
          ) : (
            <Icon size={64} strokeWidth={1.2} color="#F5E070" style={{ filter: `drop-shadow(0 0 14px rgba(${glowColor},0.8))` }} />
          )}
        </motion.div>
      </motion.div>
      <h3 style={{ fontSize: 14, fontFamily: "'Avenir Next Demi Bold", fontWeight: 800, color: '#F0D060', letterSpacing: '1.2px', marginBottom: 12, textTransform: 'uppercase', textShadow: '0 0 12px rgba(240,208,96,0.8), 0 0 20px rgba(201,168,76,0.6)' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, flexGrow: 1 }}>{desc}</p>

      {/* Read More button */}
      <div
        style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        className="read-more-wrap"
        onClick={(e) => {
          e.stopPropagation();
          if (link) window.location.href = link;
        }}
      >
        <span style={{ color: `rgb(${glowColor})`, fontWeight: 700, fontSize: 13, fontFamily: "'Poppins',sans-serif", letterSpacing: '0.3px' }}>Read More</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `rgb(${glowColor})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px rgba(${glowColor},0.5)`,
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// DETAIL ROW
// ─────────────────────────────────────────────────────────────
function CertificateTypeDisplay({ rawType, color = '#F8961E' }) {
  const [showAll, setShowAll] = useState(false);
  const types = typeof rawType === 'string' ? rawType.split(',').map(t => t.trim()).filter(Boolean) : [];
  const visibleTypes = showAll ? types : types.slice(0, 2);
  const hasMore = types.length > 2;

  if (types.length === 0) return <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>N/A</span>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {visibleTypes.map((type, i) => (
        <span key={i} style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, color: color, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, border: `1px solid ${color}35` }}>
          {type}
        </span>
      ))}
      {hasMore && !showAll && (
        <motion.span
          whileHover={{ scale: 1.1, color: '#FFFFFF' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
          style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', color: '#A78BFA', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800, border: '1px solid rgba(139, 92, 246, 0.3)', cursor: 'pointer' }}
        >
          +{types.length - 2} more
        </motion.span>
      )}
      {hasMore && showAll && (
        <motion.span
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); setShowAll(false); }}
          style={{ color: '#64748B', fontSize: 10, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          show less
        </motion.span>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, color = '#C9A84C' }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: {
          y: 0,
          scale: 1,
          background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.4) 100%)',
          borderColor: 'rgba(201,168,76,0.1)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 0 0px rgba(0,0,0,0)'
        },
        hover: {
          y: -5,
          scale: 1.03,
          background: `linear-gradient(135deg, rgba(2,6,23,0.9) 0%, ${color}25 100%)`,
          borderColor: `${color}80`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.3), 0 12px 30px -10px ${color}60`
        }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={{
            rest: { background: 'rgba(201,168,76,0.1)', color: '#C9A84C', scale: 1, rotate: 0 },
            hover: { background: `${color}30`, color: color, scale: 1.15, rotate: 10 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ display: 'flex', padding: '6px', borderRadius: '8px' }}
        >
          <Icon size={16} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          variants={{ rest: { color: 'rgba(255,255,255,0.5)' }, hover: { color: color } }}
          style={{ fontSize: 11, letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 600 }}
        >
          {label}
        </motion.div>
      </div>
      <div style={{ fontSize: 13, color: 'white', fontWeight: 600, paddingLeft: 38, position: 'relative', zIndex: 2 }}>
        {value}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function VerificationPortal({ certificateNumber }) {
  const [certId, setCertId] = useState(certificateNumber || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeImageTab, setActiveImageTab] = useState('participation');
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const portalRef = useRef(null);

  // ── Viewport Zoom Scaling (Mobile = exact desktop look, scaled down) ──
  useEffect(() => {
    const DESIGN_WIDTH = 1280;
    const applyZoom = () => {
      if (!portalRef.current) return;
      const vw = window.innerWidth;
      if (vw < DESIGN_WIDTH) {
        portalRef.current.style.zoom = (vw / DESIGN_WIDTH).toFixed(4);
      } else {
        portalRef.current.style.zoom = '';
      }
    };
    applyZoom();
    window.addEventListener('resize', applyZoom);
    return () => window.removeEventListener('resize', applyZoom);
  }, []);

  // Web Speech API Voice Assistant
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const script = 'Welcome to the Klanvision Certificate Verification Portal. Enter your Certificate Number and click "Verify Certificate" to instantly authenticate your certificate. Thank you for choosing Klanvision.';

  const hasAutoplayedRef = useRef(false);

  useEffect(() => {
    // Preload voices so they are ready when we need them
    const preloadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    preloadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = preloadVoices;
    }

    // Attempt autoplay on mount
    const tryAutoplay = () => {
      if (window.hasPlayedWelcomeThisLoad) return; // Strictly one time per page load
      if (hasAutoplayedRef.current) return;
      if (!window.speechSynthesis.speaking) {
        toggleAudio();
        hasAutoplayedRef.current = true;
        window.hasPlayedWelcomeThisLoad = true;
      }
    };

    // Try automatically after a short delay (may be blocked by browser on hard refresh)
    // On mobile, setTimeout autoplay is always blocked, which falsely marks it as played.
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let timer;
    if (!isMobile) {
      timer = setTimeout(() => {
        tryAutoplay();
      }, 1000);
    }

    // Workaround: Trigger audio on the very first user interaction
    const unlockAudio = () => {
      // Unlock iOS/Android speech synthesis engine with an empty utterance
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      window.speechSynthesis.speak(unlockUtterance);

      if (!hasAutoplayedRef.current) {
        tryAutoplay();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('scroll', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('scroll', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('scroll', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ambient Drone Audio Context (Native synthesis)
  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const startAmbientMusic = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      if (oscillatorsRef.current.length > 0) return; // already playing

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.05; // Very soft volume
      masterGain.connect(ctx.destination);

      // Warm, peaceful frequencies (C Major 9 chord for a luxury corporate ambient feel)
      const frequencies = [130.81, 196.00, 246.94, 293.66, 329.63];

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500 + (i * 100);

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0; // Start muted, fade in

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();

        // Beautiful 3-second fade in
        oscGain.gain.setTargetAtTime(0.2, ctx.currentTime, 1.5);

        oscillatorsRef.current.push({ osc, oscGain });
      });
    } catch (e) { console.error("Audio API not supported", e); }
  };

  const stopAmbientMusic = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    oscillatorsRef.current.forEach(({ osc, oscGain }) => {
      // 1.5 second fade out
      oscGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => {
        try { osc.stop(); osc.disconnect(); } catch (e) { }
      }, 1500);
    });
    oscillatorsRef.current = [];
  };

  const speakText = (textToSpeak) => {
    window.speechSynthesis.cancel(); // clear queue
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Prevent Chrome Garbage Collection bug from silently failing long text
    window.speechUtterance = utterance;

    let voices = window.speechSynthesis.getVoices();

    // STRICT RULE: ONLY female voices. No generic fallbacks.
    let femaleVoice = voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.name.includes('Google US English')) ||
      voices.find(v => v.name.includes('Jenny') || v.name.includes('Aria')) ||
      voices.find(v => v.name.includes('Samantha') || v.name.includes('Tessa') || v.name.includes('Karen')) ||
      voices.find(v => v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.name.toLowerCase().match(/catherine|susan|linda|hazel|victoria|kyoko|amelia|elsa/));

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else if (isMobile) {
      // On mobile, voices are often unnamed or default to a good system voice. 
      // We allow the default voice to speak rather than failing silently.
      let mobileFallback = voices.find(v => v.lang && v.lang.includes('en')) || voices[0];
      if (mobileFallback) {
        utterance.voice = mobileFallback;
      }
    } else {
      // STRICT RULE: If absolutely no female voice is installed, do not speak. Never use a male voice.
      window.speechSynthesis.cancel();
      return;
    }

    // Normal Chrome speed for consistency across all browsers
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      startAmbientMusic();
    };
    utterance.onresume = () => {
      setIsPlayingAudio(true);
      startAmbientMusic();
    };
    utterance.onpause = () => {
      setIsPlayingAudio(false);
      stopAmbientMusic();
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      stopAmbientMusic();
    };
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error:", e);
      setIsPlayingAudio(false);
      stopAmbientMusic();
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      stopAmbientMusic();
      setIsPlayingAudio(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        startAmbientMusic();
        setIsPlayingAudio(true);
      } else {
        speakText(script);
      }
    }
  };

  useSEO({
    title: data
      ? `Verified: ${data.name} – ${data.role} | Klanvision`
      : error ? 'Invalid Certificate | Klanvision'
        : 'Certificate Verification Portal | Klanvision',
    description: 'Verify your Klanvision internship certificates online. Instant, secure credential validation.',
    canonical: certificateNumber ? `/verify/${certificateNumber}` : '/verify',
  });

  const verify = async (id) => {
    if (!id.trim()) return;
    setLoading(true); setError(''); setData(null);

    // Smooth scroll to the result section when verification starts
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const res = await api.verifyCertificate(id);
      // Wait 5 seconds to show the premium loading animation
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (res.verified) {
        setData(res.certificate);

        // Safely determine and set the active tab for the images based on the fetched data
        if (res.certificate.is_custom && res.certificate.files) {
          const files = res.certificate.files;
          if (files.professional) setActiveImageTab('professional');
          else if (files.participation) setActiveImageTab('participation');
          else if (files.business) setActiveImageTab('business');
          else if (files.apricate) setActiveImageTab('apricate');
          else if (files.photo) setActiveImageTab('photo');
          else setActiveImageTab('participation');
        } else {
          setActiveImageTab('participation');
        }

        speakText("Congratulations. Your certificate has been successfully verified and authenticated. Thank you for using the Klanvision Certificate Verification Portal.");
      } else {
        setError('Certificate invalid or not found');
        speakText("We are unable to verify the certificate number you entered. Please check the certificate number and try again. Thank you.");
      }
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setError(err.message || 'Certificate verification failed');
      speakText("We are unable to verify the certificate number you entered. Please check the certificate number and try again. Thank you.");
    } finally { setLoading(false); }
  };

  const isVerified = !loading && !!data;
  const isInvalid = !loading && !!error;
  const mockData = data || {};

  const formatVerificationDate = (isoString) => {
    try {
      const d = isoString ? new Date(isoString) : new Date();
      const dateStr = d.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' (IST)';
      return { dateStr, timeStr };
    } catch (e) {
      return { dateStr: 'Date Error', timeStr: 'Time Error' };
    }
  }

  const { dateStr: verifiedDateStr, timeStr: verifiedTimeStr } = mockData ? formatVerificationDate(mockData.last_verified_at) : { dateStr: '', timeStr: '' };

  return (
    <div className="admin-portal-wrapper" ref={portalRef} style={{
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: 'white', position: 'relative', overflowX: 'hidden',
      background: '#000612',
      transformOrigin: 'top left',
    }}>

      {/* Animated canvas background (fixed, full page) */}
      <AnimatedBackground />

      {/* ── AI Voice Assistant UI ── */}
      <div style={{ position: 'fixed', top: 12, right: 10, zIndex: 9999 }}>
        <motion.button
          onClick={toggleAudio}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'relative',
            width: 58, height: 58,
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isPlayingAudio ? '0 0 30px rgba(201, 168, 76, 0.4)' : '0 10px 25px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
        >
          {/* Animated Glow when playing */}
          <AnimatePresence>
            {isPlayingAudio && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'absolute', inset: -8,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Soundwaves Animation */}
          {isPlayingAudio && (
            <motion.div style={{ position: 'absolute', bottom: -14, display: 'flex', gap: 4, height: 14, alignItems: 'flex-end' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div key={i}
                  animate={{ height: [4, 14, 4] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  style={{ width: 3, background: '#C9A84C', borderRadius: 2 }}
                />
              ))}
            </motion.div>
          )}

          {/* Icon */}
          <div style={{ position: 'relative', zIndex: 1, color: '#F0D060' }}>
            {isPlayingAudio ? <AudioLines size={26} /> : <VolumeX size={26} />}
          </div>
        </motion.button>
      </div>

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <div className="admin-portal-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── TOP HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="verify-header-motion"
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '30px 52px 0',
            maxWidth: 1280, margin: '0 auto',
          }}
        >
          {/* Premium Company Logo */}
          <div
            onClick={() => window.location.href = 'https://www.klanvision.com'}
            className="verify-header-logo"
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '-120px', marginTop: '-10px' }}
          >
            <img
              src="/images/Certify.png"
              alt="Certify Verification Logo"
              style={{ height: 130, objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </div>

          {/* Security Badge Image */}
          <div className="verify-header-lock" style={{ display: 'flex', alignItems: 'center', marginRight: '-120px' }}>
            <img
              src="/images/Lock.png"
              alt="Secure Verification"
              style={{ height: 180, objectFit: 'contain', transform: 'scale(1.2)' }}
            />
          </div>
        </motion.div>

        {/* ── MAIN TITLE ── */}
        <div className="verify-title-area" style={{ textAlign: 'center', padding: '0 24px', maxWidth: 1100, margin: '-170px auto 0', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '-230px', marginTop: '200px', position: 'relative', zIndex: 2 }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Animated Flowing Circles (Ripple Effect) */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [0.8, 3.5], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 1.33, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(201, 168, 76, 0.5)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
              ))}

              <img
                src="/images/Security.png"
                alt="Security"
                style={{
                  height: '120px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 10,
                  filter: 'drop-shadow(0 0 15px rgba(201,168,76,0.4))'
                }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.75 }}
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <img
              src="/images/certificate.png"
              alt="Certificate Verification Title"
              style={{ width: '100%', maxWidth: '800px', height: 'auto', objectFit: 'contain', margin: '0 auto' }}
            />
          </motion.div>
        </div>

        {/* ── GLASSMORPHISM SEARCH PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.65 }}
          className="verify-search-panel"
          style={{ padding: '0px 24px 56px', maxWidth: 1200, margin: '-200px auto 0', position: 'relative', zIndex: 10 }}
        >
          {/* Animated Flowing Border Wrapper */}
          <div style={{
            position: 'relative',
            borderRadius: 18,
            padding: '2px', // The width of the animated border
            overflow: 'hidden',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.05)',
          }}>
            {/* Rotating Gradient for the flowing line */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, #FFD700 90%, transparent 100%)',
                zIndex: 0,
              }}
            />

            {/* Inner Content Box */}
            <div className="verify-search-inner" style={{
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(145deg, #2a2a2a 0%, #0a0a0a 45%, #000000 100%)',
              borderRadius: 16,
              padding: '30px 50px',
              boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.15), inset 0 -5px 15px rgba(0,0,0,0.8)',
            }}>
              <TextType
                text="Enter Certificate Number to Verify..."
                as="p"
                typingSpeed={130}
                loop={false}
                style={{
                  textAlign: 'center', margin: '0 0 24px',
                  fontSize: 17, fontWeight: 500,
                  color: 'white', letterSpacing: '0.8px',
                  fontFamily: "'Inter', 'Montserrat', sans-serif",
                }}
              />

              <div className="verify-search-row" style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 800, margin: '0 auto' }}>
                {/* Input */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(255,215,0,0.4)',
                  borderRadius: 12, overflow: 'hidden',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ padding: '0 14px 0 20px', color: '#FFD700', flexShrink: 0, display: 'flex' }}>
                    <Search size={20} />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value.toUpperCase())}
                    placeholder="KV-XXX-XXXX-XXXX-XXXXXX"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      padding: '18px 14px', fontSize: 16, fontWeight: 700,
                      color: 'white', fontFamily: "'Outfit', sans-serif", letterSpacing: '2px',
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && verify(certId)}
                  />
                </div>

                {/* Gold button */}
                <motion.button
                  whileHover={{ background: 'linear-gradient(90deg, #FFDF00, #D4AF37)', boxShadow: '0 0 30px rgba(255,215,0,0.6)', scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => verify(certId)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '18px 32px',
                    background: 'linear-gradient(90deg, #D4AF37, #FFDF00)',
                    border: 'none',
                    borderRadius: 12,
                    cursor: loading ? 'wait' : 'pointer',
                    color: '#111',
                    fontWeight: 900, fontSize: 14, letterSpacing: '2px',
                    fontFamily: "'Outfit', sans-serif",
                    whiteSpace: 'nowrap', transition: 'all 0.3s', flexShrink: 0,
                    boxShadow: '0 6px 20px rgba(255,215,0,0.4)',
                  }}
                >
                  {loading
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><RefreshCw size={18} color="#111" /></motion.div>
                    : <>VERIFY CERTIFICATE
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#111', borderRadius: '50%', width: '26px', height: '26px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
                          <ArrowRight size={16} strokeWidth={3.5} />
                        </div>
                      </motion.div>
                    </>
                  }
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            RESULTS
        ══════════════════════════════════════════════ */}
        <div ref={resultRef} style={{ scrollMarginTop: '120px' }}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loader"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', position: 'relative', zIndex: 10, background: 'radial-gradient(circle at center, rgba(10,20,30,0.8) 0%, rgba(2,6,15,0) 80%)' }}
              >
                <PremiumImageLoader />
              </motion.div>
            )}

            {isVerified && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
                style={{ maxWidth: 1200, margin: '0 auto 52px', padding: '0 24px' }}
              >
                <div className="verify-result-card" style={{
                  position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(2, 26, 17, 0.8), rgba(1, 15, 11, 0.9))',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: 24, padding: '36px 48px',
                  marginBottom: 32,
                  boxShadow: '0 0 50px rgba(74,222,128,0.15), inset 0 0 60px rgba(74,222,128,0.05)',
                  backdropFilter: 'blur(20px)',
                }}>
                  {/* Static Inner Ambient Glow */}
                  <div
                    style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: '100%', height: '100%',
                      background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.15) 0%, transparent 60%)',
                      pointerEvents: 'none', zIndex: 0
                    }}
                  />
                  <div className="verify-valid-banner" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 120, width: '100%' }}>
                    <div className="verify-shield-container">
                      {/* Slow, elegant attractive circles */}
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, width: 0, height: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {[200, 240, 280, 320].map((size, index) => (
                          <motion.div
                            key={size}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: index % 2 === 0 ? 360 : -360 }}
                            transition={{
                              scale: { duration: 1.5, delay: index * 0.2, ease: "easeOut" },
                              opacity: { duration: 1.5, delay: index * 0.2 },
                              rotate: { duration: 40 + index * 10, repeat: Infinity, ease: "linear" }
                            }}
                            style={{
                              position: 'absolute',
                              width: size, height: size,
                              borderRadius: '50%',
                              border: '1px dashed rgba(255, 215, 0, 0.2)'
                            }}
                          >
                            {/* 5 Shiny Gold Dots per circle */}
                            {[0, 72, 144, 216, 288].map((angle) => (
                              <div key={angle} style={{ position: 'absolute', inset: 0, transform: `rotate(${angle + (index * 25)}deg)` }}>
                                <div style={{
                                  position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
                                  width: 4, height: 4, borderRadius: '50%', background: '#ffd700',
                                  boxShadow: '0 0 8px #ffd700, 0 0 15px #ffea00'
                                }} />
                              </div>
                            ))}
                          </motion.div>
                        ))}
                      </div>

                      {/* Shield Image */}
                      <img src="/images/shield.png" alt="Valid Shield" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(74,222,128,0.5))', transform: 'scale(3.5)', zIndex: 1, position: 'relative' }} />
                    </div>
                    <div className="verify-valid-text" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
                          background: 'rgba(74,222,128,0.12)', padding: '8px 16px', borderRadius: 20,
                          border: '1px solid rgba(74,222,128,0.2)'
                        }}>
                        <div style={{ background: '#4ade80', borderRadius: '50%', padding: 2, display: 'flex' }}>
                          <CheckCircle size={12} color="#021a11" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>VERIFICATION RESULT</span>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="verify-valid-heading-row">
                        <span className="verify-valid-heading" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, color: '#4ade80', marginRight: 12, fontFamily: "Georgia, 'Times New Roman', serif" }}>VALID</span>
                        <span className="verify-valid-heading" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, color: 'white', fontFamily: "Georgia, 'Times New Roman', serif" }}>CERTIFICATE</span>
                      </motion.div>

                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', marginTop: 12, marginBottom: 36, lineHeight: 1.5 }}>
                        This certificate is authentic, valid and issued by<br />an authorized institution.
                      </motion.p>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="verify-meta-strip"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                          <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed rgba(74,222,128,0.4)', borderRightColor: 'transparent' }} />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.2)' }} />

                            <div style={{ position: 'relative', width: 50, height: 50, borderRadius: '50%', background: '#021a11', border: '1px solid rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 0 15px rgba(74,222,128,0.3), inset 0 0 10px rgba(74,222,128,0.2)' }}>
                              <Calendar size={24} color="#4ade80" strokeWidth={1.5} />
                              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: '0.5px', marginBottom: 6 }}>VERIFIED ON</div>
                            <div style={{ fontSize: 14, color: 'white', marginBottom: 2 }}>{verifiedDateStr}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{verifiedTimeStr}</div>
                          </div>
                        </div>

                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                          <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '2px solid rgba(74,222,128,0.2)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 4, border: '2px dashed rgba(74,222,128,0.5)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />

                            <div style={{ position: 'relative', width: 48, height: 48, background: '#021a11', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: 'inset 0 0 15px rgba(74,222,128,0.5)' }}>
                              <motion.div animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                                <ShieldCheck size={24} color="#4ade80" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.8))' }} />
                              </motion.div>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: '0.5px', marginBottom: 6 }}>VERIFIED BY</div>
                            <div style={{ fontSize: 14, color: 'white', whiteSpace: 'nowrap', marginBottom: 2 }}>Certify Verification</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>System</div>
                          </div>
                        </div>

                        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                          <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Pulsing Ripple Rings */}
                            <motion.div animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #4ade80' }} />
                            <motion.div animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.25, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #4ade80' }} />

                            {/* Biometric Core */}
                            <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: '#021a11', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 2, boxShadow: '0 0 20px rgba(74,222,128,0.4), inset 0 0 15px rgba(74,222,128,0.2)' }}>
                              <Fingerprint size={36} color="#4ade80" strokeWidth={1.5} style={{ opacity: 0.9 }} />
                              {/* Sweeping Laser Scanner */}
                              <motion.div animate={{ top: ['-20%', '120%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, height: 3, background: '#4ade80', boxShadow: '0 0 12px 4px rgba(74,222,128,0.8)' }} />
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', letterSpacing: '0.5px', marginBottom: 6 }}>STATUS</div>
                            <div style={{ fontSize: 16, fontWeight: 500, color: '#4ade80' }}>Active</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
                    marginBottom: 32, width: '100%'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', opacity: 0.8 }}>
                      <div style={{ width: '100%', maxWidth: 250, height: 1, background: 'linear-gradient(90deg, transparent, #FFDF00)' }} />
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFDF00', boxShadow: '0 0 8px 2px rgba(255, 223, 0, 0.8)' }} />
                    </div>

                    <h3 className="verify-section-heading" style={{
                      margin: 0,
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: '1.5px',
                      color: '#ffffff',
                      fontFamily: "'Inter', sans-serif",
                      textShadow: '0 4px 15px rgba(0,0,0,0.8)'
                    }}>
                      CERTIFICATE DETAILS
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', opacity: 0.8 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFDF00', boxShadow: '0 0 8px 2px rgba(255, 223, 0, 0.8)' }} />
                      <div style={{ width: '100%', maxWidth: 250, height: 1, background: 'linear-gradient(270deg, transparent, #FFDF00)' }} />
                    </div>
                  </div>

                  <div className="cert-details-grid">
                    <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
                      <div className="cert-info-grid">
                        <DetailRow icon={Hash} label="Certificate Number" value={mockData.certificate_number || mockData.certificateNumber} color="#48CAE4" />
                        <DetailRow icon={User} label="Candidate Name" value={mockData.name} color="#FF6B6B" />
                        <DetailRow icon={BookOpen} label="Certificate Name" value={mockData.role || mockData.domain} color="#6BCB77" />
                        <DetailRow icon={Calendar} label="Issue Date" value={mockData.certificate_date || mockData.certificateDate} color="#FFD93D" />
                        <DetailRow icon={Code} label="Technical Lead" value={mockData.metadata?.technical_lead || mockData.technicalLead || mockData.technical_lead} color="#9D4EDD" />
                        <DetailRow icon={User} label="Project Manager" value={mockData.metadata?.internship_manager || mockData.internshipManager || mockData.internship_manager} color="#F72585" />
                        <DetailRow icon={Landmark} label="Issued By" value={mockData.metadata?.issued_by || 'Klanvision'} color="#00F5D4" />
                        <DetailRow icon={MapPin} label="Location" value={mockData.metadata?.location || ''} color="#F94144" />
                        <DetailRow icon={Briefcase} label="CERTIFICATE TYPE" color="#F8961E" value={
                          <CertificateTypeDisplay rawType={mockData.metadata?.certificate_type || mockData.domain || ''} color="#F8961E" />
                        } />
                        <DetailRow icon={CheckCircle2} label="Status" value={mockData.status || 'Verified'} color="#FF9F1C" />
                      </div>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                      {/* CSS Keyframes for the elegant rotating border animation */}
                      <style>{`
                        @keyframes borderRotate {
                          0%   { background-position: 0% 50%; }
                          50%  { background-position: 100% 50%; }
                          100% { background-position: 0% 50%; }
                        }
                        @keyframes borderPulse {
                          0%, 100% { box-shadow: 0 0 8px 2px rgba(201,168,76,0.3), 0 0 18px 4px rgba(139,92,246,0.12); }
                          50%      { box-shadow: 0 0 14px 4px rgba(245,158,11,0.4), 0 0 28px 8px rgba(236,72,153,0.15); }
                        }
                        .premium-border-glow {
                          position: relative;
                          border-radius: 18px;
                          padding: 3px;
                          background: linear-gradient(
                            135deg,
                            #C9A84C,
                            #F59E0B,
                            #F5E070,
                            #EC4899,
                            #F59E0B,
                            #C9A84C
                          );
                          background-size: 400% 400%;
                          animation: borderRotate 3.5s ease infinite, borderPulse 3.5s ease-in-out infinite;
                          transition: all 0.3s ease-in-out;
                        }
                      `}</style>
                      <div className="premium-border-glow" style={{
                        width: '100%',
                        maxWidth: (activeImageTab === 'photo' && (mockData?.status?.toLowerCase() === 'completed' || mockData?.status?.toLowerCase() === 'verified')) ? '220px' : '480px',
                        height: (activeImageTab === 'photo' && (mockData?.status?.toLowerCase() === 'completed' || mockData?.status?.toLowerCase() === 'verified')) ? '270px' : '330px'
                      }}>
                        <motion.div
                          layout
                          transition={{ duration: 0.3 }}
                          style={{
                            borderRadius: 13, overflow: 'hidden',
                            width: '100%',
                            height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#040b19'
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              if (mockData?.status?.toLowerCase() !== 'completed' && mockData?.status?.toLowerCase() !== 'verified') {
                                return (
                                  <motion.img
                                    key="pending-verification"
                                    initial={false}
                                    animate={{ opacity: 1, scale: 1, zIndex: 10 }}
                                    transition={{ duration: 0.3 }}
                                    src="/images/Pending_Verification.png"
                                    alt="Pending Verification"
                                    style={{
                                      position: 'absolute',
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                      pointerEvents: 'none',
                                      padding: '16px'
                                    }}
                                  />
                                );
                              }

                              const availableTabs = mockData.is_custom
                                ? Object.keys(mockData.files || {}).filter(k => mockData.files[k])
                                : ['participation', 'professional', 'photo'];
                              const finalTabs = availableTabs.length ? availableTabs : ['participation', 'professional', 'photo'];

                              return finalTabs.map(tabId => {
                                const isActive = activeImageTab === tabId;
                                return (
                                  <motion.img
                                    key={tabId}
                                    initial={false}
                                    animate={{
                                      opacity: isActive ? 1 : 0,
                                      scale: isActive ? 1 : 0.95,
                                      zIndex: isActive ? 10 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                    src={
                                      mockData.is_custom
                                        ? `${API_BASE_URL}/certifications/${mockData.id}/document/${tabId}?v=2`
                                        : (tabId === 'participation' ? '/images/Participate.png' : tabId === 'professional' ? '/images/Professional.png' : '/images/Kiran_Image.png')
                                    }
                                    alt={tabId}
                                    style={{
                                      position: 'absolute',
                                      width: '100%',
                                      height: '100%',
                                      objectFit: tabId === 'photo' ? 'cover' : 'fill',
                                      pointerEvents: isActive ? 'auto' : 'none'
                                    }}
                                  />
                                );
                              });
                            })()}
                          </div>
                        </motion.div>
                      </div>

                      {(mockData?.status?.toLowerCase() === 'completed' || mockData?.status?.toLowerCase() === 'verified') && (
                        <>
                          <div className="verify-tabs-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, background: 'rgba(0,0,0,0.4)', padding: '6px 8px', borderRadius: 30, border: '1px solid rgba(201,168,76,0.3)', justifyContent: 'center' }}>
                            {(() => {
                              let tabs = [];
                              if (mockData.is_custom) {
                                if (mockData.files?.professional) tabs.push({ id: 'professional', label: 'Professional' });
                                if (mockData.files?.participation) tabs.push({ id: 'participation', label: 'Participate' });
                                if (mockData.files?.business) tabs.push({ id: 'business', label: 'Certificate' });
                                if (mockData.files?.apricate) tabs.push({ id: 'apricate', label: 'Appreciate' });
                                if (mockData.files?.photo) tabs.push({ id: 'photo', label: 'Candidate photo' });
                              } else {
                                tabs = [
                                  { id: 'participation', label: 'Participate' },
                                  { id: 'professional', label: 'Professional' },
                                  { id: 'photo', label: 'Candidate photo' }
                                ];
                              }

                              return tabs.map(tab => (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveImageTab(tab.id)}
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: 24,
                                    border: 'none',
                                    background: activeImageTab === tab.id ? 'linear-gradient(135deg, #C9A84C, #F5E070)' : 'transparent',
                                    color: activeImageTab === tab.id ? '#000' : '#C9A84C',
                                    fontWeight: 700,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: activeImageTab === tab.id ? '0 4px 10px rgba(201,168,76,0.4)' : 'none'
                                  }}
                                >
                                  {tab.label}
                                </button>
                              ));
                            })()}
                          </div>
                          <div style={{ visibility: activeImageTab === 'photo' ? 'hidden' : 'visible' }}>
                            <motion.a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const url = mockData.is_custom ? `${API_BASE_URL}/certifications/${mockData.id}/document/${activeImageTab}?download=true` : (activeImageTab === 'participation' ? '/images/Participate.png' : '/images/Professional.png');

                                if (mockData.is_custom) {
                                  const iframe = document.createElement('iframe');
                                  iframe.style.display = 'none';
                                  iframe.src = url;
                                  document.body.appendChild(iframe);
                                  setTimeout(() => iframe.remove(), 5000);
                                } else {
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${activeImageTab}_certificate.png`;
                                  document.body.appendChild(a);
                                  a.click();
                                  a.remove();
                                }
                              }}
                              whileHover={{ scale: 1.05, background: 'rgba(201,168,76,0.15)', borderColor: '#C9A84C' }}
                              whileTap={{ scale: 0.95 }}
                              style={{

                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                padding: '12px 28px',
                                borderRadius: '30px',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(201,168,76,0.5)',
                                color: '#C9A84C', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                              }}
                            >
                              <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <Download size={18} strokeWidth={2.5} />
                              </motion.div>
                              Download Certificate
                            </motion.a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>

                {certificateNumber && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                    style={{ textAlign: 'center', marginTop: 24 }}>
                    <button onClick={() => window.location.href = '/verify'}
                      style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '10px 26px', borderRadius: 30, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                      ← Verify Another Certificate
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {isInvalid && (
              <motion.div key="error"
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: 800, margin: '0 auto 52px', textAlign: 'center', position: 'relative', zIndex: 10 }}
              >
                {/* Animated Soft Error Glow */}
                <motion.div
                  animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.98, 1.05, 0.98] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', inset: '-10%',
                    background: 'radial-gradient(circle, rgba(255, 191, 0, 0.22) 0%, rgba(218, 165, 32, 0.12) 50%, transparent 70%)',
                    filter: 'blur(40px)', zIndex: -1
                  }}
                />

                <motion.div
                  animate={{
                    boxShadow: ['0 15px 35px rgba(255,191,0,0.15), inset 0 1px 3px rgba(255,255,255,0.06)', '0 15px 50px rgba(255,191,0,0.35), inset 0 1px 3px rgba(255,255,255,0.06)', '0 15px 35px rgba(255,191,0,0.15), inset 0 1px 3px rgba(255,255,255,0.06)']
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ y: -4, boxShadow: '0 25px 60px rgba(255,191,0,0.5), inset 0 2px 10px rgba(255,255,255,0.08)' }}
                  style={{
                    position: 'relative',
                    borderRadius: 24, // Silky smooth large rounded corners
                    padding: 0,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: '#040914', // Very dark base
                    border: '1px solid rgba(255,215,0,0.15)', // Premium subtle gold border
                  }}
                >
                  {/* The Image */}
                  <img
                    src="/images/Invaild.png"
                    alt="Invalid Certificate"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transform: 'scale(1.01)', // Slight scale ensures no background bleeding on edges
                      borderRadius: 24,
                    }}
                  />

                  {/* Inner edge shadow to blend the image seamlessly (silky smooth edges) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 24,
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.65)',
                    pointerEvents: 'none'
                  }} />

                  {/* Premium Glass Reflection Sweep */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 30%, transparent 50%)',
                    borderRadius: 24,
                    pointerEvents: 'none'
                  }} />

                  {/* Animated Shine Line */}
                  <motion.div
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
                    style={{
                      position: 'absolute',
                      top: 0, bottom: 0, width: '30%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.08), transparent)',
                      transform: 'skewX(-20deg)',
                      pointerEvents: 'none'
                    }}
                  />
                </motion.div>

                {/* Buttons Over the Image */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ position: 'absolute', bottom: 20, left: 50, zIndex: 20, textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <motion.button
                      whileHover={{ scale: 1.03, background: 'rgba(255,215,0,0.05)', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setError('');
                        setCertId('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(() => inputRef.current?.focus(), 300);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        background: '#040914',
                        border: '1.5px solid rgba(255,215,0,0.5)', borderRadius: 10,
                        color: 'white', fontWeight: 600, fontSize: 13,
                        fontFamily: "'Outfit', sans-serif", letterSpacing: '0.5px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    >
                      <RefreshCw size={15} strokeWidth={2} />
                      Try Again
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, background: 'linear-gradient(90deg, #FFDF00, #D4AF37)', boxShadow: '0 8px 20px rgba(255,215,0,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => window.location.href = 'https://www.klanvision.com'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        background: 'linear-gradient(90deg, #D4AF37, #FFDF00)',
                        border: 'none', borderRadius: 10,
                        color: '#111', fontWeight: 700, fontSize: 13,
                        fontFamily: "'Outfit', sans-serif", letterSpacing: '0.5px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255,215,0,0.2)'
                      }}
                    >
                      <Home size={15} strokeWidth={2.5} />
                      Go to Home
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════════════════
            TRUST BADGES
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 1200, margin: '16px auto 64px', padding: '0 24px' }}
        >
          <div className="trust-badges-container">
            <TrustBadge imgSrc="/images/Authenticate.png" imgAnim="authenticate" glowColor="34,197,94" title="100% AUTHENTIC" desc="All certificates are verified against our secure, encrypted database." delay={0} link="/verify-authentic" />
            <TrustBadge imgSrc="/images/Protection.png" imgAnim="protection" glowColor="0,229,255" title="DATA PROTECTION" desc="Your data is safe with us. We never share your information." delay={0.1} link="/verify-protection" />
            <TrustBadge imgSrc="/images/database.png" imgAnim="database" glowColor="245,158,11" title="TRUSTED DATABASE" desc="Real-time verification from an authorized and secure source." delay={0.2} link="/verify-database" />
            <TrustBadge imgSrc="/images/global.png" imgAnim="global" glowColor="59,130,246" title="GLOBALLY ACCEPTED" desc="Our certificates are recognized by leading institutions worldwide." delay={0.3} link="/verify-global" />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer className="admin-portal-footer" style={{ background: '#000612', padding: '100px 40px 40px', position: 'relative', overflow: 'hidden' }}>
          {/* Particles Background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Particles
              particleColors={["#ffffff", "#F0D060"]}
              particleCount={300}
              particleSpread={10}
              speed={0.03}
              particleBaseSize={80}
              moveParticlesOnHover
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>

          {/* Attractive Top Glow Line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #F0D060, transparent)', zIndex: 2, boxShadow: '0 0 25px rgba(240,208,96,0.9)' }} />

          <div className="verify-footer-grid">

            {/* Left */}
            <div style={{ flex: '1.5', minWidth: 300 }}>
              <div className="footer-logo-container" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <img src="/images/footer_logo.png" alt="Footer Logo" style={{ height: 90, maxWidth: 300, objectFit: 'contain' }} />
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 260 }}>
                  Certify Verification ensures the authenticity and integrity of every certificate.<br />Verify with confidence.
                </div>
              </div>
            </div>

            {/* Divider 1 */}
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} className="footer-divider" />

            {/* Quick Links */}
            <div style={{ flex: '1', minWidth: 150 }}>
              <h4 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 20, marginTop: 0 }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Home', href: 'https://www.klanvision.com' },
                  { label: 'Services', href: '/#services' },
                  { label: 'Portfolio', href: '/#portfolio' },
                  { label: 'About', href: '/#about' },
                  { label: 'Contact', href: '/#contact' },
                  { label: 'Careers', href: '/careers' }
                ].map((link, i) => (
                  <a key={i} href={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider 2 */}
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} className="footer-divider" />

            {/* Middle (Need Help) */}
            <div style={{ flex: '1', minWidth: 200 }}>
              <h4 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 20, marginTop: 0 }}>Need Help?</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  <Mail size={16} color="#C9A84C" /> support@klanvision.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  <Phone size={16} color="#C9A84C" /> +91 7032362358
                </div>
              </div>
            </div>

            {/* Divider 3 */}
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} className="footer-divider" />

            {/* Right (Follow Us) */}
            <div style={{ flex: '1', minWidth: 150 }}>
              <h4 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 20, marginTop: 0 }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { Icon: FaFacebook, url: 'https://www.facebook.com/profile.php?id=61574478992387' },
                  { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/klan-vision-823191358' },
                  { Icon: FaTwitter, url: 'https://twitter.com/KlanSmteam' },
                  { Icon: FaInstagram, url: 'https://www.instagram.com/klanvision?utm_source=qr&igsh=MXU4ZWxuMWxlc2Ziag%3D%3D' }
                ].map(({ Icon, url }, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s' }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            <Lock size={12} color="#C9A84C" /> © 2025 Klanvision Verification. All Rights Reserved.
          </div>
        </footer>
      </div>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .cert-details-grid  { grid-template-columns: 1fr 1fr !important; }
        .verify-footer-grid { 
          display: flex;
          justify-content: space-between;
          gap: 30px;
          flex-wrap: wrap;
        }
        .footer-divider {
          width: 1px;
          background: rgba(255,255,255,0.15);
          align-self: stretch;
          min-height: 100px;
        }
        @media (max-width: 900px) {
          .cert-details-grid   { grid-template-columns: 1fr 1fr !important; }
          .verify-footer-grid  { 
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            align-items: start;
            text-align: center;
            gap: 10px;
          }
          .verify-footer-grid > div { min-width: 0 !important; }
          .footer-divider { display: none !important; }
          
          /* First Column: Logo + Text Left Align */
          .verify-footer-grid > div:nth-child(1) { text-align: left !important; }
          .footer-logo-container {
            flex-direction: row !important;
            align-items: center !important;
            text-align: left !important;
          }

          /* Third Column: Center Need Help */
          .verify-footer-grid > div:nth-child(5) {
            display: flex;
            flex-direction: column;
            align-items: center !important;
          }
          .verify-footer-grid > div:nth-child(5) > div {
            align-items: center !important;
          }

          /* Fourth Column: Center Follow Us Icons */
          .verify-footer-grid > div:nth-child(7) > div:last-child {
            justify-content: center !important;
          }
        }
        input::placeholder { color: rgba(255,255,255,0.22); letter-spacing: 1px; }
        input:focus        { outline: none; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        img {
          pointer-events: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* GUARANTEED MOBILE PORTRAIT STICKY FOOTER */
        @media (max-width: 768px) and (orientation: portrait) {
          .admin-portal-wrapper {
            display: flex !important;
            flex-direction: column !important;
            min-height: 100dvh !important;
          }
          .admin-portal-content {
            display: flex !important;
            flex-direction: column !important;
            min-height: 100dvh !important;
            flex-grow: 1 !important;
          }
          .admin-portal-footer {
            margin-top: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
