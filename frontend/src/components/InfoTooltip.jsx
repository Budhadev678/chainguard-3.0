import { Info } from 'lucide-react';
import { useState } from 'react';

export default function InfoTooltip({ text, position = 'top' }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="info-tooltip-container" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px', zIndex: 100 }}
    >
      <Info size={14} className="info-icon" style={{ cursor: 'help', color: 'var(--accent-cyan)', opacity: 0.8 }} />
      {show && (
        <div className={`info-tooltip-content ${position}`}>
          {text}
        </div>
      )}
      <style>{`
        .info-tooltip-content {
          position: absolute;
          background: rgba(10, 14, 26, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid var(--accent-cyan);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          line-height: 1.4;
          font-weight: 500;
          color: var(--text-primary);
          white-space: normal;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
          width: 300px;
          pointer-events: none;
          animation: slideUp 0.2s ease-out;
          z-index: 1000;
        }
        .info-tooltip-content.top {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
        }
        .info-tooltip-content.right {
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
        }
        .info-tooltip-content.bottom {
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
        }
        .info-tooltip-content.left {
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-10px);
        }
        .info-icon {
          transition: all 0.2s ease;
        }
        .info-icon:hover {
          opacity: 1 !important;
          color: white !important;
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px var(--accent-cyan));
        }
      `}</style>
    </div>
  );
}
