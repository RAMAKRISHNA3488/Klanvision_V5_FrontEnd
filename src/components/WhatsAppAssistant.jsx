import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// ── Configuration ──
const SERVICES = [
  "Web Development",
  "Mobile App Development",
  "AI Solutions & Automation",
  "Cloud & DevOps Services",
  "UI/UX Design",
  "E-Commerce Solutions",
  "Digital Marketing & SEO",
  "Custom Business Solutions"
];

const BUDGETS = [
  "₹10K – ₹25K",
  "₹25K – ₹50K",
  "₹50K – ₹1L",
  "₹1L+",
  "Prefer to Discuss"
];

const TIMELINES = [
  "Urgent (1–2 Weeks)",
  "1 Month",
  "2–3 Months",
  "Flexible Timeline"
];




export default function WhatsAppAssistant({ isOpen, onToggle, isVisible }) {
  const [step, setStep] = useState('GREETING');
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: ''
  });


  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initialize with personalized time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setMessages([
      { 
        id: 1, 
        text: `${greeting} 👋\nThank you for contacting Klanvision 🚀\n\nWe’re excited to help you transform your ideas into powerful digital solutions.\n\nOur AI Business Assistant will guide you through a few quick questions to better understand your project requirements 😊\n\nMay I know your full name?`, 
        sender: 'bot', 
        timestamp: new Date() 
      }
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addBotMessage = (text, options) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage = {
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s-]{10,}$/.test(phone);

  const handleSend = (textOverride) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    processFlow(text);
  };

  const processFlow = (input) => {
    switch (step) {
      case 'GREETING':
        setLeadData(prev => ({ ...prev, name: input }));
        setStep('ASK_EMAIL');
        addBotMessage(`Thank you, ${input} 😊\n\nTo proceed further, kindly provide your Business Email Address.\n\n📧 Example: example@company.com`);
        break;

      case 'ASK_EMAIL':
        if (validateEmail(input)) {
          setLeadData(prev => ({ ...prev, email: input }));
          setStep('ASK_PHONE');
          addBotMessage("Great Now, please provide your Mobile Number.\n\n📱 Example format: +91-**********\n\n⚠️ Both details are mandatory for consultation.");
        } else {
          addBotMessage("I'm sorry, that doesn't look like a valid email. Please enter a valid Business Email Address.");
        }
        break;

      case 'ASK_PHONE':
        if (validatePhone(input)) {
          setLeadData(prev => ({ ...prev, phone: input }));
          setStep('ASK_SERVICE');
          addBotMessage("Your details have been verified successfully. 👍\n\nPlease select the service you are interested in:", SERVICES);
        } else {
          addBotMessage("Invalid phone number format. Please try again.\n\nExample: +91-**********");
        }
        break;



      case 'ASK_SERVICE':
        setLeadData(prev => ({ ...prev, service: input }));
        setStep('ASK_BUDGET');
        addBotMessage("Excellent choice 🚀\n\nPlease select your estimated project budget:", BUDGETS);
        break;

      case 'ASK_BUDGET':
        setLeadData(prev => ({ ...prev, budget: input }));
        setStep('ASK_TIMELINE');
        addBotMessage("Great 👍\n\nPlease select your expected project timeline:", TIMELINES);
        break;

      case 'ASK_TIMELINE':
        const finalData = { ...leadData, timeline: input };
        setLeadData(finalData);
        setStep('COMPLETE');
        submitLead(finalData);
        addBotMessage(`Thank you, ${leadData.name} 😊\n\nYour inquiry has been successfully submitted to the Klanvision team 🚀\n\n📌 Our experts will review your requirements and contact you shortly regarding:\n\n✔ Technical Consultation\n✔ Business Strategy\n✔ Project Planning\n\nWe look forward to working with you ✨`);
        break;
    }
  };

  const submitLead = async (data) => {
    try {
      await fetch('https://formsubmit.co/ajax/sunnyok1433@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "Lead Source": "WhatsApp Assistant",
          "Name": data.name,
          "Email": data.email,
          "Phone": data.phone,
          "Service": data.service,
          "Budget": data.budget,
          "Timeline": data.timeline,
          _subject: `🟢 WhatsApp Lead - ${data.name}`,

          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (err) {
      console.error("Lead submission failed", err);
    }
  };

  const openWhatsApp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const message = `🚀 *New Project Inquiry - Klanvision*\n\n` +
      `👤 *Name:* ${leadData.name}\n` +
      `📧 *Email:* ${leadData.email}\n` +
      `📱 *Phone:* ${leadData.phone}\n` +
      `🛠️ *Service:* ${leadData.service}\n` +
      `💰 *Budget:* ${leadData.budget}\n` +
      `⏳ *Timeline:* ${leadData.timeline}\n\n` +
      `Hello Klanvision Team 👋, I would like to discuss my project requirements. Please assist me with the next steps. 😊`;
    
    const whatsappUrl = `https://wa.me/919380202408?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };



  return (
    <>
      {/* Floating Button (Right Bottom - Above Chatbot) */}
      <AnimatePresence>
        {isVisible && (
          <div style={{ position: 'fixed', bottom: '115px', right: '24px', zIndex: 10000 }}>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                rotate: [0, -10, 10, -10, 10, 0]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                scale: { duration: 0.5 },
                rotate: { duration: 0.5, Infinity, repeatDelay: 3 } 
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
                border: 'none', cursor: 'pointer', position: 'relative'
              }}
            >
              {isOpen ? <X size={28} /> : <FaWhatsapp size={32} />}
              {!isOpen && (
                <div style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
              )}
              
              {/* Notification Pulse */}
              {!isOpen && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid #25D366' }}
                />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="whatsapp-chat-popup"
            style={{
              position: 'fixed',
              bottom: '190px',
              right: '24px',
              width: '380px',
              maxWidth: 'calc(100vw - 48px)',
              height: '650px',
              maxHeight: 'calc(100vh - 250px)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              fontFamily: "'Inter', sans-serif",
              background: 'var(--bg-surface)',
              borderRadius: '28px',
              border: '1px solid var(--border-main)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              zIndex: 10001,
              backdropFilter: 'blur(10px)'
            }}
          >

            {/* Banner Header */}
            <div style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, #128C7E, #25D366)', 
              color: 'white', 
              display: 'flex', 
              flexDirection: 'column',
              gap: 12,
              position: 'relative'
            }}>
              <button onClick={onToggle} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7, padding: 8 }}><X size={22} /></button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src="/logo.png" alt="Klanvision" style={{ width: '80%', height: 'auto' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>Welcome to Klanvision</div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>We Build Future Digital Solutions</div>
                </div>
              </div>
              <div style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20, width: 'fit-content', alignSelf: 'flex-start' }}>
                Online | Typically replies instantly
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg-surface-soft)', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      maxWidth: '85%',
                      padding: '12px 18px',
                      borderRadius: msg.sender === 'user' ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                      background: msg.sender === 'user' ? '#DCF8C6' : 'white',
                      color: '#303030',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      whiteSpace: 'pre-wrap',
                      position: 'relative'
                    }}
                  >
                    {msg.text}
                    <div style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'right', marginTop: 4 }}>
                      {msg.timestamp.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST
                    </div>
                  </motion.div>
                  
                  {/* Options */}
                  {msg.options && step !== 'COMPLETE' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                      {msg.options.map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.05, background: '#128C7E', color: 'white', boxShadow: '0 5px 15px rgba(18, 140, 126, 0.3)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSend(opt)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '50px',
                            border: '1px solid #128C7E',
                            background: 'white',
                            color: '#128C7E',
                            fontSize: '12px',
                            fontWeight: 700,
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
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '12px 20px', background: 'white', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ Infinity, duration: 1, delay: 0 }} style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%' }} />
                </div>
              )}

              {step === 'COMPLETE' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => openWhatsApp(e)}

                  style={{
                    marginTop: 10,
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <FaWhatsapp size={22} /> CHAT ON WHATSAPP
                </motion.button>
              )}
            </div>

            {/* Input Area */}
            {step !== 'COMPLETE' && (
              <div style={{ padding: '24px', borderTop: '1px solid var(--border-main)', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message Klanvision..."
                    style={{ 
                      flex: 1, 
                      padding: '14px 22px', 
                      borderRadius: 50, 
                      border: '1.5px solid var(--border-main)', 
                      outline: 'none', 
                      fontSize: '14px', 
                      background: 'var(--bg-surface-soft)', 
                      color: 'var(--text-main)',
                      transition: '0.3s'
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(18, 140, 126, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSend()}
                    style={{ 
                      width: 48, height: 48, borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #25D366, #128C7E)', color: 'white', 
                      border: 'none', cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
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
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        @media (max-width: 1024px) {
          .whatsapp-chat-popup {
            width: 380px !important;
            height: 600px !important;
            bottom: 190px !important;
            right: 24px !important;
            border-radius: 28px !important;
          }
        }
        @media (max-width: 768px) {
          .whatsapp-chat-popup {
            width: 360px !important;
            height: 550px !important;
            right: 20px !important;
            bottom: 180px !important;
          }
        }
        @media (max-width: 480px) {
          .whatsapp-chat-popup {
            width: calc(100vw - 32px) !important;
            height: 500px !important;
            right: 16px !important;
            bottom: 180px !important;
            border-radius: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
