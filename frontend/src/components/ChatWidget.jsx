/**
 * ChainGuard 3.0 — Floating AI Chat Widget
 * Persistent Gemini-powered chat that floats over the interface.
 */
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { chatWithAI, runWhatIf } from '../api';

const QUICK_PROMPTS = [
  "Which shipments are most at risk?",
  "How much money has been saved?",
  "Any weather alerts active?",
  "Give me a status summary",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "👋 Hi! I'm ChainGuard AI — your supply chain assistant powered by Gemini. Ask me anything about your shipments, risks, or try a \"What-If\" scenario!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
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
      const isScenario = q.toLowerCase().startsWith('what if') || q.toLowerCase().includes('scenario');
      const result = isScenario ? await runWhatIf(q) : await chatWithAI(q);

      // Normalize: backend returns {response}, mocks also return {response} now
      const text = result.response || result.result || result.reply || 'No response received.';
      setMessages(prev => [...prev, {
        role: 'ai',
        content: text,
        source: result.source || 'ai',
      }]);

      if (!open || minimized) setUnread(u => u + 1);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Unable to connect to AI service. Please check the backend is running.',
        source: 'error',
      }]);
    }
    setLoading(false);
  }

  function handleOpen() {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  }

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <button className="chat-fab" onClick={handleOpen} title="Ask ChainGuard AI">
          <MessageSquare size={22} />
          {unread > 0 && <span className="chat-fab-badge">{unread}</span>}
          <span className="chat-fab-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`chat-window ${minimized ? 'minimized' : ''}`}>
          <div className="chat-header" onClick={() => minimized && setMinimized(false)}>
            <div className="chat-header-left">
              <div className="chat-header-icon">
                <Sparkles size={14} />
              </div>
              <div>
                <span className="chat-header-title">ChainGuard AI</span>
                <span className="chat-header-sub">Powered by Gemini</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-header-btn" onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}>
                {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
              <button className="chat-header-btn" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'ai' && <div className="chat-msg-avatar">🤖</div>}
                    <div className="chat-msg-bubble">
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
                        <span className="chat-msg-source">via {msg.source}</span>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="chat-msg ai">
                    <div className="chat-msg-avatar">🤖</div>
                    <div className="chat-msg-bubble">
                      <div className="chat-typing">
                        <Loader2 size={12} className="spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 2 && (
                <div className="chat-quick-prompts">
                  {QUICK_PROMPTS.map((q, i) => (
                    <button key={i} className="chat-quick-btn" onClick={() => handleSend(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="chat-input-area">
                <input
                  className="chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about shipments, risks, scenarios..."
                  disabled={loading}
                />
                <button className="btn btn-primary btn-sm chat-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
                  <Send size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--gradient-primary); border: none;
          color: white; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(56,189,248,0.35);
          transition: all 0.2s ease;
        }
        .chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(56,189,248,0.5); }
        .chat-fab-badge {
          position: absolute; top: -4px; right: -4px;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--status-critical); color: white;
          font-size: 0.65rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .chat-fab-pulse {
          position: absolute; width: 56px; height: 56px;
          border-radius: 50%; border: 2px solid var(--accent-blue);
          animation: pulse-ring 2.5s infinite;
        }

        .chat-window {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 380px; max-height: 540px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          display: flex; flex-direction: column;
          box-shadow: 0 12px 48px rgba(0,0,0,0.5);
          animation: slideUp 0.3s ease-out;
          overflow: hidden;
        }
        .chat-window.minimized {
          max-height: auto;
          width: 300px;
        }

        .chat-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px;
          background: rgba(56,189,248,0.06);
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
        }
        .chat-header-left { display: flex; align-items: center; gap: 10px; }
        .chat-header-icon {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--gradient-primary);
          display: flex; align-items: center; justify-content: center; color: white;
        }
        .chat-header-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); display: block; }
        .chat-header-sub { font-size: 0.62rem; color: var(--text-muted); display: block; }
        .chat-header-actions { display: flex; gap: 4px; }
        .chat-header-btn {
          width: 28px; height: 28px; border-radius: var(--radius-sm);
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease;
        }
        .chat-header-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 10px;
          max-height: 340px; min-height: 200px;
        }
        .chat-msg { display: flex; gap: 8px; }
        .chat-msg.user { justify-content: flex-end; }
        .chat-msg-avatar {
          width: 26px; height: 26px; border-radius: var(--radius-sm);
          background: var(--bg-tertiary); display: flex;
          align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0;
        }
        .chat-msg-bubble {
          padding: 10px 12px; border-radius: var(--radius-md);
          font-size: 0.78rem; line-height: 1.55; max-width: 85%;
        }
        .chat-msg.user .chat-msg-bubble {
          background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.2);
          color: var(--accent-blue);
        }
        .chat-msg.ai .chat-msg-bubble {
          background: var(--bg-tertiary); border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }
        .chat-msg-source {
          display: block; margin-top: 6px; font-size: 0.6rem;
          color: var(--text-muted); font-style: italic;
        }
        .chat-typing { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.75rem; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .chat-quick-prompts {
          padding: 0 14px 8px; display: flex; flex-wrap: wrap; gap: 4px;
        }
        .chat-quick-btn {
          padding: 5px 10px; background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle); border-radius: var(--radius-full);
          color: var(--text-secondary); font-size: 0.68rem;
          cursor: pointer; font-family: var(--font-sans);
          transition: all 0.15s ease;
        }
        .chat-quick-btn:hover {
          background: rgba(56,189,248,0.08);
          border-color: rgba(56,189,248,0.2); color: var(--accent-blue);
        }

        .chat-input-area {
          display: flex; gap: 6px; padding: 10px 14px;
          border-top: 1px solid var(--border-subtle);
        }
        .chat-input {
          flex: 1; padding: 8px 12px;
          background: var(--bg-tertiary); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md); color: var(--text-primary);
          font-family: var(--font-sans); font-size: 0.78rem; outline: none;
          transition: border-color 0.15s ease;
        }
        .chat-input:focus { border-color: var(--accent-blue); }
        .chat-input::placeholder { color: var(--text-muted); }
        .chat-send-btn { padding: 8px 10px; }
      `}</style>
    </>
  );
}
