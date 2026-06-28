const fs = require('fs');
const files = [
  'c:/Users/Admin/Pictures/Kiran_personal_laptop/Desktop/KlanVision_Company_Website_Deployment/Frontend/src/components/AuthenticVerificationPage.jsx',
  'c:/Users/Admin/Pictures/Kiran_personal_laptop/Desktop/KlanVision_Company_Website_Deployment/Frontend/src/components/DataProtectionPage.jsx',
  'c:/Users/Admin/Pictures/Kiran_personal_laptop/Desktop/KlanVision_Company_Website_Deployment/Frontend/src/components/TrustedDatabasePage.jsx',
  'c:/Users/Admin/Pictures/Kiran_personal_laptop/Desktop/KlanVision_Company_Website_Deployment/Frontend/src/components/GlobalAcceptancePage.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Wrapper
  content = content.replace(/style={{ background: 'var\(--bg-main\)', minHeight: '100vh', color: 'white', fontFamily: "'Poppins', sans-serif" }}/g, 
    "style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', fontFamily: \"'Poppins', sans-serif\" }}");

  // Hero Background
  content = content.replace(/background: 'radial-gradient\\(circle at top right, #0F172A 0%, #020617 100%\\)'/g, 
    "background: 'var(--hero-bg)'");
    
  // Subtitles and labels using #94A3B8
  content = content.replace(/color: '#94A3B8'/g, "color: 'var(--text-muted)'");
  
  // Headers and general text using 'white'
  content = content.replace(/color: 'white'/g, "color: 'var(--text-main)'");
  
  // Button text
  content = content.replace(/color: '#020617'/g, "color: 'white'");
  
  // Section background var(--bg-surface) -> backgroundColor
  content = content.replace(/background: 'var\\(--bg-surface\\)'/g, "backgroundColor: 'var(--bg-surface)'");
  
  // Floating visuals background
  content = content.replace(/background: 'rgba\\(15, 23, 42, 0.8\\)'/g, "backgroundColor: 'var(--glass-bg)'");

  // Feature boxes background
  content = content.replace(/background: \`linear-gradient\\(145deg, rgba\\(15, 23, 42, 0.6\\) 0%, \\$\\{feature.color\\}15 100%\\)\`/g, 
    "backgroundColor: 'var(--bg-surface)', backgroundImage: `linear-gradient(145deg, transparent 0%, ${feature.color}15 100%)`");

  fs.writeFileSync(file, content);
});
console.log('Update complete');
