import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, ShieldAlert, FileText, Volume2, X } from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';
import './VerdictPanel.css';

export default function VerdictPanel({ result }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (!result) return null;

  const { verdict, confidenceScore, summary, suspiciousRegions = [], techniques = [], recommendations } = result;

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 0.9; // Slightly slower for 'forensic' feel
    utterance.pitch = 0.8; // Lower pitch for authority
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getVerdictDetails = (v) => {
    switch (v) {
      case 'MANIPULATED':
      case 'LIKELY MANIPULATED':
        return { icon: ShieldAlert, color: 'var(--color-danger)', text: v };
      case 'AUTHENTIC':
      case 'LIKELY AUTHENTIC':
        return { icon: CheckCircle, color: 'var(--color-success)', text: v };
      default:
        return { icon: HelpCircle, color: 'var(--color-warning)', text: 'INCONCLUSIVE' };
    }
  };

  const { icon: Icon, color, text } = getVerdictDetails(verdict);

  return (
    <div className="verdict-panel">
      <div className="verdict-header" style={{ borderColor: color }}>
        <div className="verdict-title">
          <Icon size={32} color={color} />
          <h2 style={{ color }}>{text}</h2>
        </div>
      </div>

      <div className="verdict-grid">
        <div className="gauge-container card">
          <h3>AI Confidence</h3>
          <ConfidenceGauge score={confidenceScore} verdict={verdict} />
        </div>

        <div className="summary-container card">
          <div className="summary-header">
            <h3>Forensic Summary</h3>
            <button 
              className={`voice-btn ${isSpeaking ? 'active' : ''}`} 
              onClick={handleListen}
              title={isSpeaking ? "Stop Reading" : "Listen to Analysis"}
            >
              {isSpeaking ? <X size={14} /> : <Volume2 size={14} />}
              <span>{isSpeaking ? "STOP" : "LISTEN"}</span>
            </button>
          </div>
          <p className="summary-text">{summary}</p>
          
          {techniques.length > 0 && (
            <div className="techniques-detected">
              <h4>Detected Traits:</h4>
              <div className="tags">
                {techniques.map((tech, idx) => (
                  <span key={idx} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {suspiciousRegions.length > 0 && (
        <div className="regions-container card">
          <h3><AlertTriangle size={18} /> Flagged Regions</h3>
          <ul className="regions-list">
            {suspiciousRegions.map((region, idx) => (
              <li key={idx} className={`region-item severity-${region.severity}`}>
                <div className="region-header">
                  <span className="region-name">{region.region}</span>
                  <span className="severity-badge">{region.severity}</span>
                </div>
                <p className="region-desc">{region.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && (
        <div className="recommendations-container card">
          <h3><FileText size={18} /> Next Steps for Analyst</h3>
          <p>{recommendations}</p>
        </div>
      )}
    </div>
  );
}
