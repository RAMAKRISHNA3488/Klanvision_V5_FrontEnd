import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Code2, CheckCircle2, ChevronRight, Mail, Phone, Calendar, Target, Briefcase, IndianRupee } from 'lucide-react';

// ── Configuration ──
const SERVICES = [
  "Web Development",
  "Mobile App Development",
  "AI Solutions & Automation",
  "Cloud & DevOps Services",
  "UI/UX Design",
  "E-Commerce Solutions",
  "Digital Marketing & SEO",
  "Other Business Requirements"
];

const BUDGETS = [
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Prefer to Discuss with Team"
];

const TIMELINES = [
  "Urgent (1–2 Weeks)",
  "1 Month",
  "2–3 Months",
  "Flexible Timeline"
];

type Step = 'GREETING' | 'ASK_EMAIL' | 'ASK_PHONE' | 'ASK_SERVICE' | 'ASK_BUDGET' | 'ASK_TIMELINE' | 'COMPLETE';


type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
};

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

export default function AIAssistant({ isOpen, onToggle, isVisible }: AIAssistantProps) {
  const [step, setStep] = useState<Step>('GREETING');
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: ''
  });

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Welcome to Klanvision 👋\nWe help businesses transform ideas into powerful digital solutions 🚀\n\nI’m your AI Assistant, and I’ll guide you through a few quick questions to better understand your requirements.\n\nTo get started, may I know your full name?", 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setMessages([{ 
      id: 1, 
      text: `${greeting}! Welcome to Klanvision 👋\nWe help businesses transform ideas into powerful digital solutions 🚀\n\nI’m your AI Assistant, and I’ll guide you through a few quick questions to better understand your requirements.\n\nTo get started, may I know your full name?`, 
      sender: 'bot', 
      timestamp: new Date() 
    }]);
  }, []);

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        text,
        sender: 'bot',
        timestamp: new Date(),
        options
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[\d\s-]{10,}$/.test(phone);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Logic based on current step
    processFlow(text);
  };

  const processFlow = (input: string) => {
    switch (step) {
      case 'GREETING':
        setLeadData(prev => ({ ...prev, name: input }));
        setStep('ASK_EMAIL');
        addBotMessage(`Thank you, ${input} 😊\n\nTo provide you with a free consultation, please share your Business Email Address.`);
        break;

      case 'ASK_EMAIL':
        if (validateEmail(input)) {
          setLeadData(prev => ({ ...prev, email: input }));
          setStep('ASK_PHONE');
          addBotMessage("Great! Now, please provide your Mobile Number so we can reach out for a quick discussion.");
        } else {
          addBotMessage("I'm sorry, that doesn't look like a valid email address. Could you please try again?\n\nExample: ✔ example@company.com");
        }
        break;

      case 'ASK_PHONE':
        if (validatePhone(input)) {
          setLeadData(prev => ({ ...prev, phone: input }));
          setStep('ASK_SERVICE');
          addBotMessage("Perfect 👍\nPlease select the service you are interested in:", SERVICES);
        } else {
          addBotMessage("I'm sorry, that doesn't look like a valid phone number. Could you please try again?\n\nExample format: ✔ +91-**********");
        }
        break;



      case 'ASK_SERVICE':
        setLeadData(prev => ({ ...prev, service: input }));
        if (input === "Other Business Requirements") {
            addBotMessage("Thank you for sharing your requirement 😊\n\nFor customized business solutions and detailed discussions, our experts would be happy to assist you personally.\n\n📧 support@klanvision.com\n📞 +91 70323 62358\n\nOur team will contact you shortly with the best possible solution tailored to your business needs 🚀");
            setStep('COMPLETE');
        } else {
            setStep('ASK_BUDGET');
            addBotMessage("Excellent choice 🚀\n\nTo help us recommend the most suitable solution, please select your estimated project budget range:", BUDGETS);
        }
        break;

      case 'ASK_BUDGET':
        setLeadData(prev => ({ ...prev, budget: input }));
        setStep('ASK_TIMELINE');
        addBotMessage("Great 👍\n\nWhat is your expected project timeline?", TIMELINES);
        break;

      case 'ASK_TIMELINE':
        setLeadData(prev => ({ ...prev, timeline: input }));
        setStep('COMPLETE');
        submitLead({ ...leadData, timeline: input });
        addBotMessage(`Thank you for sharing your project details, ${leadData.name} 😊\n\n📌 Our team will carefully review your requirements and contact you shortly with:\n\n✔ Project Consultation\n✔ Technical Suggestions\n✔ Estimated Cost & Timeline\n✔ Best Suitable Technologies\n\nWe look forward to working with you and helping your business grow digitally 🚀\n\nHave a wonderful day ✨`);
        break;
    }
  };

  const submitLead = async (data: any) => {
    try {
      await fetch('https://formsubmit.co/ajax/sunnyok1433@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "Name": data.name,
          "Email": data.email,
          "Phone": data.phone,
          "Service": data.service,
          "Budget": data.budget,
          "Project Timeline": data.timeline,
          "Company Banner": "https://www.klanvision.com/logo.png", // Included for branding
          _subject: `🚀 New Advanced AI Lead - ${data.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (err) {
      console.error("Lead submission failed", err);
    }
  };


  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {isVisible && (
          <div className="ai-assistant-toggle">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
                border: 'none', cursor: 'pointer', position: 'relative'
              }}
            >
              {isOpen ? <X size={28} /> : <Bot size={32} />}
              {!isOpen && (
                <div style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--bg-main)' }} />
              )}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px dashed rgba(124, 58, 237, 0.6)' }}
              />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="ai-chat-sidebar"
            style={{
              width: '400px',
              maxWidth: '100vw',
              height: '100vh',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              fontFamily: "'Inter', sans-serif",
              background: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-main)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
              position: 'fixed',
              top: 0,
              right: 0,
              zIndex: 10001
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Klanvision AI Assistant</div>
                <div style={{ fontSize: 11, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%' }} /> Active Support
                </div>
              </div>
              <button onClick={onToggle} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}><X size={20} /></button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-surface-soft)' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      maxWidth: '85%',
                      padding: '12px 18px',
                      borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      background: msg.sender === 'user' ? '#4F46E5' : 'var(--bg-surface)',
                      color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                      fontSize: 14,
                      lineHeight: 1.6,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--border-main)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.text}
                  </motion.div>
                  
                  {/* Quick Reply Options */}
                  {msg.options && step !== 'COMPLETE' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {msg.options.map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.05, background: '#4F46E5', color: 'white' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOptionClick(opt)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '50px',
                            border: '1px solid #4F46E5',
                            background: 'transparent',
                            color: '#4F46E5',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-main)' }}>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%' }} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {step !== 'COMPLETE' && (
              <div style={{ padding: '20px', borderTop: '1px solid var(--border-main)', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    style={{ 
                      flex: 1, 
                      padding: '12px 18px', 
                      borderRadius: 50, 
                      border: '1.5px solid var(--border-main)', 
                      outline: 'none', 
                      fontSize: 14, 
                      background: 'var(--bg-surface-soft)', 
                      color: 'var(--text-main)' 
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSend()}
                    style={{ 
                      width: 44, height: 44, borderRadius: '50%', 
                      background: '#4F46E5', color: 'white', 
                      border: 'none', cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      boxShadow: '0 10px 15px rgba(79, 70, 229, 0.2)' 
                    }}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border-main); border-radius: 10px; }
        .ai-assistant-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
        }
      `}</style>
    </>
  );
}
