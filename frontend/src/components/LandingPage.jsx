import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, BrainCircuit, Globe, Lock, ArrowRight, ScanSearch } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Pricing from './Pricing';
import Team from './Team';
import Footer from './Footer';
import Carousel from './Carousel';
import './LandingPage.css';

export default function LandingPage({ toolComponent }) {
  const [isManualOpen, setIsManualOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const dashCount = 20;

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

  return (
    <div className="landing-container">
      {/* Top Navigation / Sign Out */}
      <div className="landing-top-nav">
        <button className="sign-out-btn" onClick={handleSignOut}>
          SIGN OUT <ArrowRight size={14} />
        </button>
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
        <p className="text-body-large mt-2">
          In an era of synthetic media, seeing is no longer believing. We equip journalists and fact-checkers with military-grade AI to unmask digital manipulation.
        </p>
      </SectionWrapper>

      {/* 03: The Threat */}
      <SectionWrapper className="two-col" id="section-03">
        <div className="col-content">
          <h2 className="text-title">The Threat</h2>
          <p className="text-body-large">
            Deepfakes, splicing, and AI-generated misinformation are proliferating at scale. Traditional verification cannot keep up with generative models.
          </p>
        </div>
        <div className="col-visual threat-visual">
           <div className="abstract-glitch"></div>
        </div>
      </SectionWrapper>

      {/* 04: The Core */}
      <SectionWrapper className="section-centered" id="section-04">
        <BrainCircuit size={48} className="section-icon" />
        <h2 className="text-title">Powered by Gemini 1.5 Pro</h2>
        <p className="text-body-large max-w-800 mx-auto mt-2">
          Our core intelligence engine utilizes state-of-the-art multimodal reasoning to detect compression artifacts, lighting anomalies, and AI-generation signatures.
        </p>
      </SectionWrapper>

      {/* 05: Step 1 - Ingest */}
      <SectionWrapper className="two-col-reverse" id="section-05">
        <div className="col-visual ingest-visual">
          <div className="wireframe-box">Drop Media</div>
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
          <Activity size={100} className="pulse-icon" />
        </div>
      </SectionWrapper>

      {/* 07: Step 3 - Verdict */}
      <SectionWrapper className="section-centered" id="section-07">
        <h3 className="step-label">Step 03</h3>
        <h2 className="text-title">The Verdict</h2>
        <p className="text-body-large max-w-800 mx-auto mt-2">
          A definitive, plain-English forensic report. Clear confidence scores, highlighted suspicious regions, and actionable next steps.
        </p>
      </SectionWrapper>

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
           <div className="grid-overlay"></div>
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
        <h2 className="text-title">Trusted By</h2>
        <div className="trusted-logos mt-4">
          <div className="logo-placeholder">Reuters Fact Check</div>
          <div className="logo-placeholder">AP News</div>
          <div className="logo-placeholder">Bellingcat</div>
        </div>
      </SectionWrapper>

      {/* 14: Final Verdict (CTA) */}
      <SectionWrapper className="section-centered footer-section" id="section-14">
        <ShieldCheck size={64} className="section-icon mb-2" />
        <h2 className="text-title">Ready for the truth?</h2>
        <button 
          className="cta-button mt-3"
          onClick={() => document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' })}
        >
          Start Investigating <ArrowRight size={20} />
        </button>
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

        <button 
          className="lab-shortcut-btn"
          onClick={() => document.getElementById('section-08').scrollIntoView({ behavior: 'smooth' })}
          title="Go to Interactive Lab"
        >
          <span className="manual-label">OPEN LAB</span>
          <ArrowRight size={16} />
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
                <h2 className="ns-title">Audra Labs: Manual</h2>
              </div>
              <div className="ns-body">
                <p>Welcome to the <strong>Audra Labs</strong> Forensic Interface. This environment is designed for real-time detection of synthetic media and deepfake artifacts.</p>
                
                <h3>Operational Protocol</h3>
                <p>Ingest suspicious media into the <strong>Interactive Lab</strong>. Our system utilizes Gemini 1.5 Pro to conduct a multi-modal scan, generating a verifiable forensic report.</p>
                
                <h3>Key Security Tiers</h3>
                <ul>
                  <li><strong>Layer 01:</strong> Error Level Analysis (ELA) for compression artifacts.</li>
                  <li><strong>Layer 02:</strong> Lighting & Shadow consistency verification.</li>
                  <li><strong>Layer 03:</strong> Neural signature detection for known LLM/GenAI models.</li>
                </ul>
                
                <p><em>Note: All data is processed in a zero-knowledge environment. No assets are stored on our servers after the session expires.</em></p>
                
                <div className="ns-footer">
                  <p>Clearance: Class-3 Operative</p>
                  <p>Terminal: Node-07 [Active]</p>
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
