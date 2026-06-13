import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronLeft, ArrowRight, Code2, Database, ShieldCheck, Smartphone, Monitor, Server, Cpu, Layers, TrendingUp, Cloud, Share2, RefreshCw, FileCheck, Terminal, Palette, PenTool, BarChart, Search } from 'lucide-react';
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
  },
  {
    id: 7,
    title: "Cyber Security & Ethical Hacking",
    type: "Internship",
    location: "Remote / On-site",
    description: "Learn fundamentals of network security, penetration testing, vulnerability assessment, and ethical hacking methodologies.",
    icon: <ShieldCheck size={24} />,
    color: "#EF4444",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 8,
    title: "Internet of Things (IoT)",
    type: "Internship",
    location: "Remote",
    description: "Explore sensor integration, microcontroller programming, IoT protocols, and building connected smart systems.",
    icon: <Cpu size={24} />,
    color: "#10B981",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 9,
    title: "Software Development",
    type: "Internship",
    location: "Remote",
    description: "Gain hands-on experience in software design patterns, system architectures, and core software development cycles.",
    icon: <Code2 size={24} />,
    color: "#3B82F6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 10,
    title: "Embedded Systems",
    type: "Internship",
    location: "Remote",
    description: "Design firmware, program microcontrollers, and work with low-level interfaces and real-time operating systems.",
    icon: <Cpu size={24} />,
    color: "#EC4899",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 11,
    title: "VLSI",
    type: "Internship",
    location: "Remote",
    description: "Delve into digital system design, HDL modeling (Verilog/VHDL), and IC design methodologies.",
    icon: <Layers size={24} />,
    color: "#8B5CF6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 12,
    title: "SQL",
    type: "Internship",
    location: "Remote",
    description: "Master relational database management, complex queries optimization, database design, and indexing.",
    icon: <Database size={24} />,
    color: "#F59E0B",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 13,
    title: "Power BI",
    type: "Internship",
    location: "Remote",
    description: "Build interactive business intelligence dashboards, perform data transformation (Power Query), and analyze data models.",
    icon: <BarChart size={24} />,
    color: "#FACC15",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 14,
    title: "Cloud Computing",
    type: "Internship",
    location: "Remote",
    description: "Learn cloud deployment architectures, serverless computing, virtual networks, and managing AWS/Azure infrastructures.",
    icon: <Cloud size={24} />,
    color: "#06B6D4",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 15,
    title: "Blockchain Technology",
    type: "Internship",
    location: "Remote",
    description: "Explore decentralized ledger technologies, smart contracts development, consensus protocols, and Web3 applications.",
    icon: <Share2 size={24} />,
    color: "#F97316",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 16,
    title: "DevOps",
    type: "Internship",
    location: "Remote",
    description: "Practice continuous integration and continuous deployment (CI/CD), containerization with Docker, and Kubernetes orchestration.",
    icon: <RefreshCw size={24} />,
    color: "#EF4444",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 17,
    title: "Software Testing",
    type: "Internship",
    location: "Remote",
    description: "Understand software quality assurance, manual testing strategies, bug reporting, and lifecycle processes.",
    icon: <FileCheck size={24} />,
    color: "#10B981",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 18,
    title: "Automation Testing",
    type: "Internship",
    location: "Remote",
    description: "Develop automated testing scripts using Selenium, Playwright, or Cypress to validate modern web applications.",
    icon: <Terminal size={24} />,
    color: "#3B82F6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 19,
    title: "Big Data",
    type: "Internship",
    location: "Remote",
    description: "Work with distributed data processing systems like Hadoop and Spark to process and analyze massive datasets.",
    icon: <Database size={24} />,
    color: "#8B5CF6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 20,
    title: "C Programming",
    type: "Internship",
    location: "Remote",
    description: "Master the foundations of computer science, memory management, pointers, and low-level data structures.",
    icon: <Code2 size={24} />,
    color: "#EC4899",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 21,
    title: "C++ Programming",
    type: "Internship",
    location: "Remote",
    description: "Explore object-oriented programming concepts, STL container designs, and high-performance application development.",
    icon: <Code2 size={24} />,
    color: "#F59E0B",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 22,
    title: "Digital Marketing",
    type: "Internship",
    location: "Remote",
    description: "Learn SEO optimization, content strategies, campaign analytics, and social media marketing concepts.",
    icon: <TrendingUp size={24} />,
    color: "#06B6D4",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 23,
    title: "Data Science",
    type: "Internship",
    location: "Remote",
    description: "Analyze raw datasets, implement machine learning models, and communicate insights with mathematical precision.",
    icon: <Database size={24} />,
    color: "#F97316",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 24,
    title: "Android Development",
    type: "Internship",
    location: "Remote",
    description: "Build robust native Android applications using Kotlin, Java, and modern Android SDK components.",
    icon: <Smartphone size={24} />,
    color: "#10B981",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 25,
    title: "Frontend Web Development",
    type: "Internship",
    location: "Remote",
    description: "Craft responsive and interactive web interfaces using modern HTML, CSS, JavaScript, and user-centric layouts.",
    icon: <Monitor size={24} />,
    color: "#3B82F6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 26,
    title: "Python Programming",
    type: "Internship",
    location: "Remote",
    description: "Develop scripts, automate tasks, build web scrapers, and explore library integrations in Python.",
    icon: <Code2 size={24} />,
    color: "#8B5CF6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 27,
    title: "Java Programming",
    type: "Internship",
    location: "Remote",
    description: "Understand enterprise application development, OOP principles, and build cross-platform applications.",
    icon: <Code2 size={24} />,
    color: "#EC4899",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 28,
    title: "Machine Learning",
    type: "Internship",
    location: "Remote",
    description: "Design predictive models, train supervised and unsupervised algorithms, and perform feature engineering.",
    icon: <Cpu size={24} />,
    color: "#F59E0B",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 29,
    title: "Artificial Intelligence",
    type: "Internship",
    location: "Remote",
    description: "Explore neural networks, deep learning frameworks, natural language processing, and advanced cognitive systems.",
    icon: <Cpu size={24} />,
    color: "#06B6D4",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 30,
    title: "UI/UX Design",
    type: "Internship",
    location: "Remote",
    description: "Design user personas, wireframes, high-fidelity prototypes, and perform usability testing strategies.",
    icon: <Palette size={24} />,
    color: "#F97316",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 31,
    title: "Data Analytics",
    type: "Internship",
    location: "Remote",
    description: "Interpret complex data patterns, build descriptive dashboards, and clean data for business decision making.",
    icon: <BarChart size={24} />,
    color: "#EF4444",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 32,
    title: "React.js Web Development",
    type: "Internship",
    location: "Remote",
    description: "Build component-driven single page applications (SPAs) with state management, hooks, and routing.",
    icon: <Code2 size={24} />,
    color: "#3B82F6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 33,
    title: "MERN Stack Web Development",
    type: "Internship",
    location: "Remote",
    description: "Deliver end-to-end applications using MongoDB, Express.js, React.js, and Node.js.",
    icon: <Code2 size={24} />,
    color: "#10B981",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 34,
    title: ".NET Web Development",
    type: "Internship",
    location: "Remote",
    description: "Build secure, enterprise-grade backend APIs and web applications using C# and ASP.NET Core framework.",
    icon: <Code2 size={24} />,
    color: "#8B5CF6",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 35,
    title: "Figma Web Development",
    type: "Internship",
    location: "Remote",
    description: "Bridge UI mockups and web code by translating high-fidelity Figma components into structured HTML/CSS.",
    icon: <PenTool size={24} />,
    color: "#EC4899",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 36,
    title: "Figma App Development",
    type: "Internship",
    location: "Remote",
    description: "Design and prototype mobile application layouts, user flows, and transitions using advanced Figma components.",
    icon: <Smartphone size={24} />,
    color: "#F59E0B",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 37,
    title: "Full Stack Web Development",
    type: "Internship",
    location: "Remote",
    description: "Take ownership of frontend UI, server architecture, database modeling, and api endpoints connection.",
    icon: <Code2 size={24} />,
    color: "#06B6D4",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
  },
  {
    id: 38,
    title: "Backend Web Development",
    type: "Internship",
    location: "Remote",
    description: "Build reliable and scalable server architectures, handle request routing, security authorization, and data storage.",
    icon: <Server size={24} />,
    color: "#F97316",
    redirectUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfFmCcUpYHsZJ4SYIChNPlBnVNJZVnCS2bSJSZaqHCNPbTIPQ/viewform"
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
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setJobs(jobListings);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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

      {/* Search & Filter Controls */}
      <section className="container" style={{ marginBottom: 40, marginTop: -40, position: 'relative', zIndex: 4 }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-main)',
          borderRadius: 24,
          padding: '24px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          boxShadow: 'var(--card-shadow)'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['All', 'Full-Time', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: selectedType === type ? '#7C3AED' : 'rgba(255,255,255,0.05)',
                  color: selectedType === type ? 'white' : 'var(--text-muted)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {type === 'All' ? 'All Openings' : type === 'Full-Time' ? 'Full-Time Jobs' : 'Internships'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 350 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 12,
                border: '1px solid var(--border-main)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
        </div>
      </section>

      {/* Job Listings Grid */}
      <section className="container" style={{ position: 'relative', zIndex: 3 }}>
        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: 24, boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>No career openings found</h3>
            <p>Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                  href={job.redirectUrl || `/apply?job=${encodeURIComponent(job.title)}`}
                  target={job.redirectUrl ? "_blank" : "_self"}
                  rel={job.redirectUrl ? "noopener noreferrer" : undefined}
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
        )}
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
