/**
 * WhatIfPanel — Natural language scenario testing powered by Gemini.
 */
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { runWhatIf, chatWithAI } from '../api';

const EXAMPLE_QUERIES = [
  "What if the Suez Canal closes for 3 weeks?",
  "What if our top supplier goes bankrupt?",
  "What if a 7-day port strike hits Chennai?",
  "Which shipments are most at risk this week?",
  "How much money did we save this month?",
];

export default function WhatIfPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(query) {
    const q = query || input.trim();
    if (!q) return;

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);

    try {
      // Use what-if for scenario questions, chat for general
      const isScenario = q.toLowerCase().startsWith('what if') || q.toLowerCase().includes('scenario');
      const result = isScenario ? await runWhatIf(q) : await chatWithAI(q);

      setMessages(prev => [...prev, {
        role: 'ai',
        content: result.response,
        source: result.source,
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Error connecting to AI service. Please check the backend is running.',
        source: 'error',
      }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="whatif-panel">
      <div className="wf-header">
        <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
        <span>AI Scenario Engine</span>
      </div>

      {/* Messages */}
      <div className="wf-messages">
        {messages.length === 0 && (
          <div className="wf-welcome">
            <div className="wf-welcome-icon">🧠</div>
            <h4>Ask ChainGuard AI</h4>
            <p>Type a "What-If" scenario or ask about your supply chain</p>
            <div className="wf-examples">
              {EXAMPLE_QUERIES.map((q, i) => (
                <button key={i} className="wf-example" onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`wf-msg ${msg.role}`}>
            {msg.role === 'ai' && <div className="wf-msg-avatar">🤖</div>}
            <div className="wf-msg-content">
              {msg.role === 'ai' ? (
                <div className="markdown-content" dangerouslySetInnerHTML={{
                  __html: msg.content
                    ?.replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/### (.*?)(<br\/>)/g, '<h3>$1</h3>')
                    .replace(/## (.*?)(<br\/>)/g, '<h2>$1</h2>')
                    || ''
                }} />
              ) : (
                <p>{msg.content}</p>
              )}
              {msg.source && msg.role === 'ai' && (
                <span className="wf-source">via {msg.source}</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="wf-msg ai">
            <div className="wf-msg-avatar">🤖</div>
            <div className="wf-msg-content">
              <div className="wf-typing">
                <Loader2 size={14} className="spin" />
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="wf-input-row">
        <input
          className="wf-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Try: "What if the Suez Canal closes?"'
          disabled={loading}
        />
        <button className="btn btn-primary btn-sm" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          <Send size={14} />
        </button>
      </div>

      <style>{`
        .whatif-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .wf-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .wf-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }
        .wf-welcome {
          text-align: center;
          padding: 16px;
        }
        .wf-welcome-icon {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .wf-welcome h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .wf-welcome p {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .wf-examples {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wf-example {
          padding: 7px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
          text-align: left;
        }
        .wf-example:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-medium);
          color: var(--accent-blue);
        }
        .wf-msg {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        .wf-msg.user {
          justify-content: flex-end;
        }
        .wf-msg.user .wf-msg-content {
          background: rgba(56,189,248,0.12);
          border: 1px solid rgba(56,189,248,0.2);
          color: var(--accent-blue);
          max-width: 80%;
        }
        .wf-msg.ai .wf-msg-content {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          max-width: 90%;
        }
        .wf-msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .wf-msg-content {
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }
        .wf-source {
          display: block;
          margin-top: 6px;
          font-size: 0.65rem;
          color: var(--text-muted);
          font-style: italic;
        }
        .wf-typing {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .wf-input-row {
          display: flex;
          gap: 6px;
          padding: 10px 12px;
          border-top: 1px solid var(--border-subtle);
        }
        .wf-input {
          flex: 1;
          padding: 8px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.82rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .wf-input:focus {
          border-color: var(--accent-blue);
        }
        .wf-input::placeholder {
          color: var(--text-muted);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
