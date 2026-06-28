import React from 'react';
import { User, Code, Briefcase, ShieldCheck } from 'lucide-react';

export default function CertificateReplica({ data }) {
  const name = data?.name || "Moopuri Kiran Kumar";
  const role = data?.role || data?.domain || "Web Development Internship";
  const startDate = "May 15, 2024";
  const endDate = "July 15, 2024";
  const certId = data?.certificate_number || data?.certificateNumber || "KV-INTERN-2024-0758";
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '1.414 / 1',
      backgroundColor: '#fbfaf8',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      fontFamily: "'Playfair Display', Georgia, serif",
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5%',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Montserrat:wght@400;600;700;800&display=swap');
        .cert-bg-watermark {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: repeating-radial-gradient(circle at 50% 50%, #C9A84C 0, #C9A84C 1px, transparent 1px, transparent 100%);
          background-size: 40px 40px;
          z-index: 0;
        }
        .cert-inner-border {
          position: absolute;
          inset: 15px;
          border: 2px solid #C9A84C;
          z-index: 1;
          pointer-events: none;
        }
        .cert-outer-border {
          position: absolute;
          inset: 0;
          border: 8px solid #060c1a;
          box-shadow: inset 0 0 0 2px #C9A84C;
          z-index: 10;
          pointer-events: none;
        }
        .cert-corner-tl {
          position: absolute;
          top: 0; left: 0;
          width: 25%; height: 60%;
          background: linear-gradient(135deg, #060c1a, #0a1228);
          clip-path: polygon(0 0, 100% 0, 0 100%);
          z-index: 12;
          border-right: 3px solid #C9A84C;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }
        .cert-ribbon-bl {
          position: absolute;
          bottom: 0; left: 5%;
          width: 12%; height: 45%;
          background: #060c1a;
          z-index: 11;
          border-left: 2px solid #C9A84C;
          border-right: 2px solid #C9A84C;
        }
        .cert-ribbon-bl::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; width: 100%; height: 30px;
          background: #fbfaf8;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
        }
        .cert-seal-tr {
          position: absolute;
          top: 5%; right: 5%;
          width: 18%; aspect-ratio: 1;
          background: radial-gradient(circle, #C9A84C, #8B6914);
          border-radius: 50%;
          z-index: 15;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          border: 2px dashed #fff;
        }
        .cert-seal-tr::before {
          content: 'CERTIFIED INTERNSHIP';
          position: absolute;
          color: #060c1a; font-weight: 900; font-size: 0.6vw;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
        }
        .cert-seal-tr::after {
          content: 'K';
          position: absolute;
          color: #fff; font-size: 3vw; font-weight: 900;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        .cert-content {
          position: relative;
          z-index: 5;
          text-align: center;
          padding-top: 4%;
          display: flex; flex-direction: column; height: 100%;
        }
        .cert-title {
          font-size: 4vw;
          font-weight: 900;
          letter-spacing: 0.4vw;
          color: #060c1a;
          margin: 0;
          text-transform: uppercase;
        }
        .cert-subtitle {
          font-size: 1.5vw;
          color: #C9A84C;
          letter-spacing: 0.6vw;
          margin-top: -0.5vw;
          font-weight: 700;
        }
        .cert-presented {
          background: #060c1a;
          color: #C9A84C;
          display: inline-block;
          padding: 0.4vw 2vw;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8vw;
          font-weight: 700;
          letter-spacing: 0.2vw;
          margin: 3% auto;
          position: relative;
        }
        .cert-presented::before, .cert-presented::after {
          content: '';
          position: absolute;
          top: 50%; transform: translateY(-50%) rotate(45deg);
          width: 0.8vw; height: 0.8vw;
          background: #C9A84C;
        }
        .cert-presented::before { left: -0.4vw; }
        .cert-presented::after { right: -0.4vw; }
        
        .cert-name {
          font-family: 'Great Vibes', cursive;
          font-size: 5.5vw;
          color: #C9A84C;
          margin: 0;
          line-height: 1;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .cert-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85vw;
          color: #333;
          max-width: 70%;
          margin: 3% auto;
          line-height: 1.6;
        }
        
        .cert-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 0 5%;
          padding-bottom: 2%;
        }
        
        .cert-sign-col {
          display: flex; flex-direction: column; align-items: center;
          font-family: 'Montserrat', sans-serif;
        }
        .cert-sign-icon {
          background: #060c1a;
          color: #C9A84C;
          border-radius: 50%;
          width: 2.5vw; height: 2.5vw;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.5vw;
        }
        .cert-sign-role { font-size: 0.7vw; font-weight: 800; color: #060c1a; }
        .cert-sign-name { font-size: 0.75vw; color: #C9A84C; font-weight: 600; margin-bottom: 0.2vw; }
        .cert-signature { font-family: 'Great Vibes', cursive; font-size: 1.8vw; color: #002b5e; }
        
        .cert-qr-box {
          border: 1px solid #C9A84C;
          border-radius: 8px;
          padding: 1vw;
          background: #fff;
          display: flex; flex-direction: column; align-items: center;
        }
        .cert-qr-title { font-size: 0.6vw; color: #C9A84C; font-weight: 700; margin-bottom: 0.3vw; }
        .cert-qr-id { font-size: 0.75vw; font-weight: 800; color: #060c1a; margin-bottom: 0.8vw; }
        .cert-qr-img { width: 4.5vw; height: 4.5vw; background: #eee; }
      `}</style>
      
      <div className="cert-outer-border" />
      <div className="cert-inner-border" />
      <div className="cert-bg-watermark" />
      
      <div className="cert-corner-tl">
        <div style={{ position: 'absolute', top: '15%', left: '15%', color: '#fff', fontFamily: 'Montserrat' }}>
          <img src="/logo.png" alt="Klanvision" style={{ width: '8vw', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }} />
        </div>
      </div>
      
      <div className="cert-ribbon-bl">
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '8vw', height: '8vw', borderRadius: '50%', background: 'radial-gradient(circle, #C9A84C, #8B6914)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#060c1a', fontSize: '0.6vw', fontWeight: 900 }}>
          EXCELLENCE<br/>THROUGH<br/>LEARNING
        </div>
      </div>
      
      <div className="cert-seal-tr" />
      
      <div className="cert-content">
        <h1 className="cert-title">CERTIFICATE</h1>
        <div className="cert-subtitle">OF INTERNSHIP</div>
        
        <div className="cert-presented">PROUDLY PRESENTED TO</div>
        
        <h2 className="cert-name">{name}</h2>
        
        <div className="cert-desc">
          This is to certify that <strong>{name}</strong> has successfully completed the<br/>
          <strong style={{ color: '#C9A84C' }}>{role}</strong> at Klanvision from<br/>
          <strong style={{ color: '#C9A84C' }}>{startDate} to {endDate}</strong>.<br/><br/>
          During this internship, he/she demonstrated exceptional dedication,<br/>
          strong technical skills and a proactive attitude.<br/>
          We wish him/her all the best for future endeavors.
        </div>
        
        <div className="cert-footer">
          <div className="cert-sign-col">
            <div className="cert-sign-icon"><User size={16} /></div>
            <div className="cert-sign-role">DIRECTOR</div>
            <div className="cert-sign-name">Anke Shilpa</div>
            <div className="cert-signature">Anke Shilpa</div>
          </div>
          
          <div className="cert-sign-col">
            <div className="cert-sign-icon"><Code size={16} /></div>
            <div className="cert-sign-role">TECHNICAL LEAD</div>
            <div className="cert-sign-name">Nagaraju</div>
            <div className="cert-signature">Nagaraju</div>
          </div>
          
          <div className="cert-sign-col">
            <div className="cert-sign-icon"><Briefcase size={16} /></div>
            <div className="cert-sign-role">INTERNSHIP MANAGER</div>
            <div className="cert-sign-name">Rama Krishna</div>
            <div className="cert-signature">Rama Krishna</div>
          </div>
          
          <div className="cert-qr-box">
            <div className="cert-qr-title">★ CERTIFICATE NUMBER ★</div>
            <div className="cert-qr-id">{certId}</div>
            <div className="cert-qr-img">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://klanvision.com/verify/${certId}`} alt="QR" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ background: '#060c1a', color: '#C9A84C', fontSize: '0.5vw', padding: '0.3vw 0.8vw', borderRadius: 4, marginTop: '0.5vw', fontWeight: 700 }}>
              SCAN TO VERIFY<br/>AUTHENTICITY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
