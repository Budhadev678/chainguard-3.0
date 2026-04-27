// ChainGuard 3.0 — What-If Scenario Lab
import React, { useState } from 'react';
import { runWhatIf } from '../../services/api';
import { FlaskConical, Send, Loader2, Lightbulb, Bot } from 'lucide-react';

const PRESETS = [
  "What if the Suez Canal closes for 3 weeks?",
  "What if our top semiconductor supplier goes bankrupt?",
  "What if a Category 4 hurricane hits the Gulf of Mexico?",
  "What if diesel prices spike 50% globally?",
  "What if Chennai port faces a 2-week workers' strike?",
  "What if US-China tariffs increase to 40%?",
];

export default function WhatIfPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (q) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await runWhatIf(question);
      setResults(prev => [{ query: question, ...res }, ...prev]);
    } catch (e) {
      setResults(prev => [{ query: question, success: false, response: 'Failed to analyze. Check API connection.' }, ...prev]);
    }
    setLoading(false);
    setQuery('');
  };

  return (
    <div className="whatif-panel">
      <div className="wi-header">
        <FlaskConical size={20} />
        <div>
          <h2 className="wi-title">What-If Scenario Lab</h2>
          <p className="wi-subtitle">Ask any supply chain scenario — AI simulates 1,000 outcomes in seconds</p>
        </div>
      </div>

      <div className="wi-input-area">
        <input
          className="input wi-input"
          placeholder='Try: "What if the Suez Canal closes for 3 weeks?"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={() => handleSubmit()} disabled={loading || !query.trim()}>
          {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          Analyze
        </button>
      </div>

      <div className="wi-presets">
        <Lightbulb size={13} />
        <span>Try these:</span>
        {PRESETS.map((p, i) => (
          <button key={i} className="wi-preset-btn" onClick={() => { setQuery(p); handleSubmit(p); }}>
            {p.slice(0, 45)}{p.length > 45 ? '...' : ''}
          </button>
        ))}
      </div>

      <div className="wi-results">
        {results.map((r, i) => (
          <div key={i} className="wi-result animate-slide-up glass-card">
            <div className="wi-result-query">💬 {r.query}</div>
            <div className="wi-result-badge">
              <Bot size={13} />
              <span>{r.source === 'gemini' ? 'Gemini AI Analysis' : 'AI Simulation'}</span>
            </div>
            <div className="wi-result-text">{r.response}</div>
          </div>
        ))}
      </div>

      <style>{`
        .whatif-panel { padding: 20px; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .wi-header { display: flex; align-items: center; gap: 12px; color: var(--accent-cyan); }
        .wi-title { font-size: 1.1rem; font-weight: 800; color: var(--text-bright); }
        .wi-subtitle { font-size: 0.75rem; color: var(--text-muted); }
        .wi-input-area { display: flex; gap: 8px; }
        .wi-input { flex: 1; }
        .wi-presets {
          display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
          font-size: 0.7rem; color: var(--text-muted);
        }
        .wi-preset-btn {
          background: rgba(59,130,246,0.06); border: 1px solid var(--border-primary);
          border-radius: 20px; padding: 4px 10px; font-size: 0.68rem;
          color: var(--text-secondary); cursor: pointer; font-family: var(--font-sans);
          transition: all var(--transition-fast);
        }
        .wi-preset-btn:hover { background: var(--accent-blue-dim); color: var(--accent-blue); border-color: var(--accent-blue); }
        .wi-results { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .wi-result { padding: 16px; }
        .wi-result-query { font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: var(--text-bright); }
        .wi-result-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.68rem; font-weight: 600; color: var(--accent-purple);
          background: rgba(139,92,246,0.1); padding: 2px 10px;
          border-radius: 20px; margin-bottom: 8px;
        }
        .wi-result-text { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.7; white-space: pre-wrap; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
