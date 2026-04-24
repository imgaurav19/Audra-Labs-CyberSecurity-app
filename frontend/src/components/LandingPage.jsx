import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, BrainCircuit, Globe, Lock, ArrowRight, ScanSearch, Menu } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Pricing from './Pricing';
import Team from './Team';
import Footer from './Footer';
import Carousel from './Carousel';
import './LandingPage.css';

export default function LandingPage({ toolComponent }) {
  const [isManualOpen, setIsManualOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const globalHubs = [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop', // NYC
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1467226632440-65f0b49574f9?q=80&w=800&auto=format&fit=crop', // Singapore
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop'  // Chicago
  ];
  const [scaleIdx, setScaleIdx] = React.useState(0);
  const dashCount = 20;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setScaleIdx(prev => (prev + 1) % globalHubs.length);
    }, 12000); // Rotate every 12s
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('audra_auth');
    window.location.reload();
  };

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / height;
      const idx = Math.min(dashCount - 1, Math.floor(progress * dashCount));
      setActiveIdx(idx);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="landing-container">
      {/* Top Navigation */}
      {/* Top Navigation */}
      <div className="landing-top-nav">
        <div className="nav-left">
          <div className="audra-logo-mini">A/L</div>
        </div>

        <div className="nav-right">
          <div className="search-container">
            <ScanSearch size={16} className="search-icon" />
            <input 
              ref={searchRef}
              type="text" 
              placeholder="Search Archives... (⌘K)" 
              className="tactical-search"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
          <button className="menu-btn" onClick={() => setIsManualOpen(true)}>
            <Menu size={18} />
            <span className="menu-label">MENU</span>
          </button>
          <button className="sign-out-btn" onClick={handleSignOut}>
            SIGN OUT <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Side Scroll Indicator */}
      <div className="landing-side-nav">
        {Array.from({ length: dashCount }).map((_, i) => (
          <div 
            key={i} 
            className={`landing-nav-dash ${activeIdx === i ? 'active' : ''}`}
            onClick={() => {
              const height = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: (i / dashCount) * height, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
      {/* 01: The Reveal */}
      <SectionWrapper className="section-centered hero-section" id="section-01">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <ScanSearch size={80} className="hero-icon" />
          <h1 className="text-hero">Audra Labs</h1>
          <div className="audra-bookmark">Forensic Intelligence Platform</div>
          <p className="text-subtitle mt-2">Zero-Knowledge Generative Media Analysis.</p>
        </motion.div>
      </SectionWrapper>

      {/* 02: The Mission */}
      <SectionWrapper className="section-centered" id="section-02">
        <h2 className="text-title">The Mission</h2>
        <p className="text-body-large mt-2 max-w-800">
          In an era of synthetic media, seeing is no longer believing. We equip journalists, independent investigators, and global fact-checkers with military-grade AI to unmask sophisticated digital manipulation before it goes viral.
        </p>
        <p className="text-body-large mt-2 max-w-800">
          Our goal is to restore the "Noise-to-Signal" ratio in the global information ecosystem. By democratizing access to high-end forensic tools, we empower the guardians of truth to verify reality in real-time.
        </p>
      </SectionWrapper>

      {/* 03: The Threat */}
      <SectionWrapper className="two-col" id="section-03">
        <div className="col-content">
          <h2 className="text-title">The Threat</h2>
          <p className="text-body-large">
            Deepfakes, splicing, and AI-generated misinformation are proliferating at scale. Traditional verification methods—often relying on slow human oversight—cannot keep up with the exponential growth of generative models.
          </p>
          <p className="text-body-large mt-2">
            This "Generative Misinformation" threat bypasses standard filters, spreading across encrypted channels and social networks faster than corrections can be made. Audra Labs provides the defensive layer needed to stop this cycle.
          </p>
        </div>
        <div className="col-visual threat-visual">
          <div className="threat-img-container">
            <img 
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
              alt="The Threat - Digital Manipulation"
              className="threat-img"
            />
            <div className="threat-overlay"></div>
            <div className="threat-label">THREAT DETECTED</div>
          </div>
        </div>
      </SectionWrapper>

      {/* 03.5: Intelligence Feed */}
      <SectionWrapper className="bg-alt" id="section-intel">
        <div className="section-centered">
          <div className="tactical-label">GLOBAL INTELLIGENCE FEED</div>
          <h2 className="text-title">Active Counter-Measures</h2>
          <div className="intel-feed-container premium-card mt-3">
             <div className="intel-row">
               <span className="intel-time">[08:42:15]</span>
               <span className="intel-status status-alert">ALERT</span>
               <span className="intel-msg">Synthetic video detected in Southeast Asian election cycle. Deepfake suppressed.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[08:31:04]</span>
               <span className="intel-status status-verify">VERIFY</span>
               <span className="intel-msg">Reuters Fact Check: Satellite imagery confirmed authentic via metadata hash.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[08:15:22]</span>
               <span className="intel-status status-scan">SCAN</span>
               <span className="intel-msg">Batch scan complete: 4,200 assets analyzed. Neural signatures: 0.04% variance.</span>
             </div>
             <div className="intel-row">
               <span className="intel-time">[07:58:49]</span>
               <span className="intel-status status-alert">ALERT</span>
               <span className="intel-msg">Coordinated generative misinformation campaign identified in Eastern Europe.</span>
             </div>
          </div>
        </div>
      </SectionWrapper>


      {/* 05: Step 1 - Ingest */}
      <SectionWrapper className="two-col-reverse" id="section-05">
        <div className="col-visual ingest-visual">
          <img 
            src="https://picsum.photos/seed/audra_ingest_7/800/500" 
            alt="Forensic Ingest" 
            className="step-visual-img"
          />
        </div>
        <div className="col-content">
          <h3 className="step-label">Step 01</h3>
          <h2 className="text-title">Ingest</h2>
          <p className="text-body-large">
            Secure, drag-and-drop ingestion of images and video. We support high-resolution inputs and ensure local hashing before transmission.
          </p>
        </div>
      </SectionWrapper>

      {/* 06: Step 2 - Analyze */}
      <SectionWrapper className="two-col" id="section-06">
        <div className="col-content">
          <h3 className="step-label">Step 02</h3>
          <h2 className="text-title">Analyze</h2>
          <p className="text-body-large">
            The neural network scans the media pixel-by-pixel, extracting metadata and performing Error Level Analysis (ELA) to find hidden inconsistencies.
          </p>
        </div>
        <div className="col-visual analyze-visual">
          <div className="analysis-graph-container">
            <img 
              src="https://picsum.photos/seed/audra_analysis_9/800/500" 
              alt="Neural Analysis" 
              className="step-visual-img"
            />
            <div className="scanning-beam"></div>
            <div className="data-overlay-pulse">
              <Activity size={40} className="pulse-icon-mini" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 07: Step 3 - Verdict */}
      <SectionWrapper className="two-col-reverse" id="section-07">
        <div className="col-visual verdict-visual">
          <div className="sample-verdict-card premium-card">
            <div className="verdict-card-header">
               <ShieldCheck size={24} className="glow-icon" />
               <span>FORENSIC VERDICT: MANIPULATED</span>
            </div>
            <div className="verdict-score-row">
              <span className="score-value">94.8%</span>
              <span className="score-label">CONFIDENCE SCORE</span>
            </div>
            <img 
              src="https://picsum.photos/seed/audra_verdict_7/600/350" 
              alt="Sample Forensic Report" 
              className="sample-report-img"
            />
          </div>
        </div>
        <div className="col-content">
          <h3 className="step-label">Step 03</h3>
          <h2 className="text-title">The Verdict</h2>
          <p className="text-body-large">
            A definitive, plain-English forensic report. Clear confidence scores, highlighted suspicious regions, and actionable next steps.
          </p>
        </div>
      </SectionWrapper>

      {/* Tactical Divider */}
      <div className="section-divider">
        <div className="divider-line"></div>
        <div className="divider-tag">DETECTION VECTORS</div>
        <div className="divider-line"></div>
      </div>

      {/* 07.5: Carousel Showcase */}
      <SectionWrapper className="section-centered bg-alt" id="section-showcase" style={{ padding: '2rem 0 4rem 0', maxWidth: '100%' }}>
        <div style={{ padding: '0 2rem', width: '100%', maxWidth: '1400px', textAlign: 'left', marginBottom: '1rem', margin: '0 auto' }}>
          <h2 className="text-title" style={{ fontSize: '2.5rem' }}>Detection Vectors</h2>
          <p className="text-body-large">Explore the intelligence engine's capabilities.</p>
        </div>
        <Carousel />
      </SectionWrapper>

      {/* 08: Interactive Lab (The App) */}
      <SectionWrapper className="lab-section" id="section-08">
        <div className="lab-header section-centered">
          <h2 className="text-title">Interactive Lab</h2>
          <p className="text-body-large">Test the intelligence engine live.</p>
        </div>
        <div className="lab-container">
          {toolComponent}
        </div>
      </SectionWrapper>

      {/* 09: Scalability */}
      <SectionWrapper className="two-col" id="section-09">
        <div className="col-content">
          <Globe size={40} className="section-icon mb-1" />
          <h2 className="text-title">Global Scale</h2>
          <p className="text-body-large">
            Built on a serverless architecture designed for high-throughput newsrooms. Analyze thousands of images per hour with zero latency degradation.
          </p>
        </div>
         <div className="col-visual scale-visual">
            <img 
              src={globalHubs[scaleIdx]} 
              alt="Global Intelligence" 
              className="step-visual-img"
              key={scaleIdx}
            />
            <div className="grid-overlay"></div>
            <div className="scanning-beam"></div>
         </div>
      </SectionWrapper>

      {/* 10: Pricing */}
      <SectionWrapper className="section-centered bg-alt" id="section-10">
        <h2 className="text-title">Pricing</h2>
        <p className="text-body-large">Transparent tiers for verification at any scale.</p>
        <Pricing />
      </SectionWrapper>

      {/* 11: Team */}
      <SectionWrapper className="section-centered" id="section-11">
        <h2 className="text-title">The Operatives</h2>
        <p className="text-body-large">Meet the intelligence behind the platform.</p>
        <Team />
      </SectionWrapper>

      {/* 12: Integrity */}
      <SectionWrapper className="two-col-reverse" id="section-12">
        <div className="col-visual lock-visual">
           <Lock size={120} strokeWidth={1} className="lock-icon" />
        </div>
        <div className="col-content">
          <h2 className="text-title">Zero-Knowledge</h2>
          <p className="text-body-large">
            We don't train on your data. All uploaded media is processed in memory and immediately discarded. Your journalistic integrity remains uncompromised.
          </p>
        </div>
      </SectionWrapper>

      {/* 13: Case Studies */}
      <SectionWrapper className="section-centered" id="section-13">
        <div className="tactical-label">OPERATIONAL PARTNERS</div>
        <h2 className="text-title">Trusted By Global Newsrooms</h2>
        <div className="trusted-logos-marquee mt-4">
          <div className="marquee-content">
            <div className="logo-placeholder">Reuters Fact Check</div>
            <div className="logo-placeholder">AP News</div>
            <div className="logo-placeholder">Bellingcat</div>
            <div className="logo-placeholder">AFP Fact Check</div>
            <div className="logo-placeholder">Full Fact</div>
            <div className="logo-placeholder">BBC Verify</div>
            {/* Duplicate for infinite loop */}
            <div className="logo-placeholder">Reuters Fact Check</div>
            <div className="logo-placeholder">AP News</div>
            <div className="logo-placeholder">Bellingcat</div>
            <div className="logo-placeholder">AFP Fact Check</div>
            <div className="logo-placeholder">Full Fact</div>
            <div className="logo-placeholder">BBC Verify</div>
          </div>
        </div>
      </SectionWrapper>

      {/* 14: Final Verdict (CTA) */}
      <SectionWrapper className="section-centered footer-section" id="section-14">
        <div className="cta-cinematic-bg">
          <div className="scanning-beam-horizontal"></div>
          <div className="forensic-grid-pattern"></div>
        </div>
        <div className="cta-content-wrapper">
          <ShieldCheck size={80} className="section-icon mb-2 glow-icon" />
          <h2 className="text-title display-large">Ready for the truth?</h2>
          <p className="text-body-large mb-3">Join the global network of truth-seekers and journalists.</p>
          <button 
            className="cta-button-premium mt-3"
            onClick={() => document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' })}
          >
            START INVESTIGATING <ArrowRight size={20} />
          </button>
        </div>
      </SectionWrapper>

      {/* Footer */}
      {/* Floating Manual Trigger */}
      <div className="landing-floating-controls">
        <button 
          className="manual-trigger-btn"
          onClick={() => setIsManualOpen(true)}
          title="Open Operational Manual"
        >
          <span className="manual-label">OPERATIONAL MANUAL</span>
          <div className="manual-dot"></div>
        </button>
      </div>

      {/* Notion-Style Sidebar */}
      {isManualOpen && (
        <div className="manual-overlay" onClick={() => setIsManualOpen(false)}>
          <motion.div 
            className="manual-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="manual-close" onClick={() => setIsManualOpen(false)}>✕</button>
            <div className="notion-style-content">
              <div className="ns-header">
                <span className="ns-emoji">📄</span>
                <h2 className="ns-title">Audra Labs: Operational Manual</h2>
              </div>
              <div className="ns-body">
                <h3>01: How It Works</h3>
                <p>Audra Labs utilizes multi-modal neural networks to analyze media assets in real-time. Our engine scans for temporal inconsistencies, lighting deviations, and GAN-specific neural signatures.</p>
                <ul>
                  <li><strong>Ingest:</strong> Secure drag-and-drop or encrypted URL import.</li>
                  <li><strong>Scan:</strong> Pixel-by-pixel Error Level Analysis (ELA).</li>
                  <li><strong>Verdict:</strong> Verifiable forensic report with confidence scoring.</li>
                </ul>
                
                <h3>02: Data Security & Privacy</h3>
                <p><strong>ZERO DATA LEAK POLICY:</strong> We operate on a zero-knowledge architecture. All uploaded media is processed in volatile memory and immediately purged upon session termination.</p>
                <ul>
                  <li>No assets are stored on our servers post-analysis.</li>
                  <li>No user data is used for model training.</li>
                  <li>All transmissions are secured via TLS 1.3 & AES-256.</li>
                </ul>
                
                <h3>03: Terms & Conditions</h3>
                <p>By accessing the Audra Labs terminal, you agree to utilize these forensic tools for verification and truth-seeking purposes only. Commercial exploitation of generative detection results is subject to enterprise licensing.</p>
                
                <h3>04: Privacy Policy</h3>
                <p>We do not track operative identities. Your IP address and metadata are stripped at the edge layer. We collect only anonymized telemetry to optimize detection accuracy across the network.</p>
                
                <div className="ns-footer">
                  <p>Clearance: Class-3 Operative</p>
                  <p>Terminal: Node-07 [Active]</p>
                  <p>© 2024 Audra Labs · Forensic Intelligence</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
