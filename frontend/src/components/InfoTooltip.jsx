import { Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function InfoTooltip({ text, position = 'top' }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    if (show && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [show]);

  let tooltipStyle = { position: 'fixed', zIndex: 999999, width: '300px' };
  
  if (show && typeof window !== 'undefined') {
    // Keep horizontally within screen bounds
    const safeLeft = Math.max(10, Math.min(coords.left + coords.width / 2 - 150, window.innerWidth - 310));

    if (position === 'top') {
      tooltipStyle.bottom = window.innerHeight - coords.top + 10;
      tooltipStyle.left = safeLeft;
    } else if (position === 'bottom') {
      tooltipStyle.top = coords.top + coords.height + 10;
      tooltipStyle.left = safeLeft;
    } else if (position === 'left') {
      tooltipStyle.top = coords.top + coords.height / 2;
      tooltipStyle.transform = 'translateY(-50%)';
      tooltipStyle.left = coords.left - 310;
      // Flip to right if not enough space
      if (tooltipStyle.left < 10) {
        tooltipStyle.left = coords.left + coords.width + 10;
      }
    } else if (position === 'right') {
      tooltipStyle.top = coords.top + coords.height / 2;
      tooltipStyle.transform = 'translateY(-50%)';
      tooltipStyle.left = coords.left + coords.width + 10;
      // Flip to left if not enough space
      if (tooltipStyle.left + 300 > window.innerWidth) {
        tooltipStyle.left = coords.left - 310;
      }
    }
  }

  return (
    <div 
      className="info-tooltip-container" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
      style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}
      ref={iconRef}
    >
      <Info size={14} className="info-icon" style={{ cursor: 'help', color: 'var(--accent-cyan)', opacity: 0.8 }} />
      {show && typeof document !== 'undefined' && createPortal(
        <div className="info-tooltip-content" style={tooltipStyle}>
          {text}
        </div>,
        document.body
      )}
      <style>{`
        .info-tooltip-content {
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
          pointer-events: none;
          animation: slideUp 0.2s ease-out;
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
