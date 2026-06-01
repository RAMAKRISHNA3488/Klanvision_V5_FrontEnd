import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronLeft, ArrowRight, Code2, Database, ShieldCheck, Smartphone, Monitor, Server } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const jobListings = [
  {
    id: 1,
    title: "DevSecOps Engineer",
    type: "Full-Time",
    location: "Remote / On-site",
    description: "Implement and manage security practices within the DevOps pipeline, ensuring secure CI/CD workflows.",
    icon: <ShieldCheck size={24} />,
    color: "#EF4444"
  },
  {
    id: 2,
    title: "Data Engineer",
    type: "Full-Time",
    location: "Remote",
    description: "Design and build robust data pipelines and architectures to support large-scale data processing.",
    icon: <Database size={24} />,
    color: "#F97316"
  },
  {
    id: 3,
    title: "Frontend Developer",
    type: "Full-Time",
    location: "Remote / On-site",
    description: "Craft pixel-perfect, responsive user interfaces using modern frameworks like React and Next.js.",
    icon: <Monitor size={24} />,
    color: "#0EA5E9"
  },
  {
    id: 4,
    title: "Backend Developer",
    type: "Full-Time",
    location: "Remote",
    description: "Develop high-performance server-side logic and integrate with various data storage solutions.",
    icon: <Server size={24} />,
    color: "#8B5CF6"
  },
  {
    id: 5,
    title: "Full Stack Developer",
    type: "Full-Time",
    location: "On-site",
    description: "Bridge the gap between frontend and backend while specializing in database optimization and management.",
    icon: <Code2 size={24} />,
    color: "#10B981"
  },
  {
    id: 6,
    title: "Mobile Application Developer",
    type: "Full-Time",
    location: "Remote / On-site",
    description: "Create seamless mobile experiences across iOS and Android platforms using React Native or Flutter.",
    icon: <Smartphone size={24} />,
    color: "#F43F5E"
  }
];

export default function CareersPage() {
  useSEO({
    title: 'Careers at Klanvision | Join Our Global Tech Team',
    description: 'Explore career opportunities at Klanvision. We are hiring Frontend Developers, Backend Developers, Full Stack, Mobile App, Data Engineers and DevSecOps engineers.',
    keywords: 'careers, jobs, Klanvision hiring, developer jobs, tech careers, remote jobs',
    canonical: '/careers',
  });
  const [jobs, setJobs] = useState(jobListings);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    setJobs(jobListings);
  }, []);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Careers Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '120px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1), transparent)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <a href="/" style={{ color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 24, letterSpacing: '1px' }}>
              <ChevronLeft size={16} /> BACK TO HOME
            </a>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
              Join the <span className="gradient-text">Future of Innovation</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
              At Klanvision, we are building the next generation of digital solutions. We are looking for passionate individuals to join our global team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings Grid */}
      <section className="container" style={{ marginTop: -50, position: 'relative', zIndex: 3 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredId(job.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="card"
              style={{
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-main)',
                borderTop: hoveredId === job.id ? `4px solid ${job.color}` : '4px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: `${job.color}15`, color: job.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {job.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {job.type}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                {job.description}
              </p>

              <motion.a
                href={`/apply?job=${encodeURIComponent(job.title)}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: job.color, fontWeight: 700, fontSize: 14,
                  textDecoration: 'none'
                }}
                whileHover={{ x: 5 }}
              >
                APPLY NOW <ArrowRight size={16} />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="container" style={{ marginTop: 100, textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="accent-bar" />
          <h2 style={{ fontWeight: 900, fontSize: 32, marginBottom: 20, color: 'var(--text-main)' }}>Why work at Klanvision?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {[
              { t: 'Innovation First', d: 'Work with the latest tech stacks and solve complex challenges.' },
              { t: 'Global Team', d: 'Collaborate with talented professionals from around the world.' },
              { t: 'Career Growth', d: 'Clear paths for advancement and continuous learning opportunities.' }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 10, color: 'var(--text-main)' }}>{item.t}</h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still curious? CTA */}
      <section className="container" style={{ textAlign: 'center', marginTop: 100 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ padding: '60px 40px', background: 'var(--bg-surface)', borderRadius: 32, boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-main)' }}
        >
          <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: 'var(--text-main)' }}>Don't see a perfect fit?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>We are always looking for talented people. Send us your resume and we'll keep you in mind.</p>
          <a href="/apply?job=General%20Application" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 40px', display: 'inline-block' }}>
            Send General Application
          </a>
        </motion.div>
      </section>
    </div>
  );
}
