import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './Pricing.css';

const tiers = [
  {
    name: 'Fact-Checker',
    price: 'Free',
    description: 'Essential tools for independent verification.',
    features: ['100 media scans/month', 'Basic forensic summaries', 'Community support', 'Standard resolution'],
    buttonText: 'Start Verifying',
    highlighted: false
  },
  {
    name: 'Newsroom',
    price: '$99',
    period: '/month',
    description: 'Advanced intelligence for editorial teams.',
    features: ['Unlimited media scans', 'Deep-dive AI analysis', 'Priority API access', 'High-res extraction', 'Team collaboration'],
    buttonText: 'Upgrade to Newsroom',
    highlighted: true
  },
  {
    name: 'Enterprise API',
    price: 'Custom',
    description: 'Scalable integration for platforms.',
    features: ['Dedicated infrastructure', 'Custom AI model tuning', 'SLA guarantees', '24/7 dedicated support'],
    buttonText: 'Contact Sales',
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <div className="pricing-grid">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          className={`pricing-card premium-card ${tier.highlighted ? 'highlighted' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <div className="card-header">
            <h3>{tier.name}</h3>
            <div className="price-container">
              <span className="price">{tier.price}</span>
              {tier.period && <span className="period">{tier.period}</span>}
            </div>
            <p>{tier.description}</p>
          </div>
          <div className="card-features">
            <ul>
              {tier.features.map((feat, i) => (
                <li key={i}><Check size={18} className="check-icon"/> {feat}</li>
              ))}
            </ul>
          </div>
          <button className={`pricing-btn ${tier.highlighted ? 'primary' : 'secondary'}`}>
            {tier.buttonText}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
