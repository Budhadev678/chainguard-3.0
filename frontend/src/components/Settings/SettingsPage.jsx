/**
 * ChainGuard 3.0 — Settings Page (PRD requirement)
 * API keys, global configuration, user preferences.
 * Wrapped in a scrollable full-height container.
 */
import { useState } from 'react';
import { Settings, Key, Globe, Bell, Shield, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [settings, setSettings] = useState({
    geminiKey: 'AIza••••••••••••••••••••••••••••••',
    backendUrl: import.meta.env.VITE_API_BASE || 'https://chainguard-api.onrender.com/api',
    refreshInterval: 30,
    alertThreshold: 70,
    notifyEmail: true,
    notifySlack: false,
    darkMode: true,
    compactView: false,
    language: 'en',
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleChange(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="settings-outer">
      <div className="settings-page">
      <div className="stg-header">
        <div className="stg-header-icon"><Settings size={20} /></div>
        <div>
          <h2 className="stg-title">
            Settings & Configuration
            <InfoTooltip text="Manage integration, alerts, and system display options." position="right" />
          </h2>
          <p className="stg-sub">Manage API keys, preferences, and system configuration</p>
        </div>
      </div>

      <div className="stg-sections">
        {/* API Configuration */}
        <div className="stg-section glass-panel">
          <div className="stg-section-title"><Key size={16} color="#38bdf8" /> API Configuration</div>
          <div className="stg-field">
            <label className="stg-label">Gemini API Key</label>
            <div className="stg-input-wrap">
              <input
                className="stg-input"
                type={showKey ? 'text' : 'password'}
                value={settings.geminiKey}
                onChange={e => handleChange('geminiKey', e.target.value)}
              />
              <button className="stg-eye" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
            <span className="stg-hint">Used for Gemini AI analysis and What-If scenarios</span>
          </div>
          <div className="stg-field">
            <label className="stg-label">Backend API URL</label>
            <input
              className="stg-input"
              type="text"
              value={settings.backendUrl}
              onChange={e => handleChange('backendUrl', e.target.value)}
            />
            <span className="stg-hint">FastAPI backend endpoint</span>
          </div>
        </div>

        {/* Monitoring Settings */}
        <div className="stg-section glass-panel">
          <div className="stg-section-title"><Globe size={16} color="#a78bfa"/> Monitoring Settings</div>
          <div className="stg-field">
            <label className="stg-label">Data Refresh Interval (seconds)</label>
            <input
              className="stg-input stg-input-sm"
              type="number"
              min="10"
              max="300"
              value={settings.refreshInterval}
              onChange={e => handleChange('refreshInterval', parseInt(e.target.value))}
            />
          </div>
          <div className="stg-field">
            <label className="stg-label">Risk Alert Threshold (score 0-100)</label>
            <div className="stg-range-wrap">
              <input
                className="stg-range"
                type="range"
                min="0"
                max="100"
                value={settings.alertThreshold}
                onChange={e => handleChange('alertThreshold', parseInt(e.target.value))}
              />
              <span className="stg-range-val" style={{
                color: settings.alertThreshold > 70 ? '#f87171' : settings.alertThreshold > 40 ? '#fbbf24' : '#34d399'
              }}>{settings.alertThreshold}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stg-section glass-panel">
          <div className="stg-section-title"><Bell size={16} color="#fbbf24"/> Notifications</div>
          <div className="stg-toggle-row">
            <div>
              <div className="stg-toggle-label">Email Alerts</div>
              <div className="stg-toggle-sub">Receive critical alerts via email</div>
            </div>
            <button
              className={`stg-toggle ${settings.notifyEmail ? 'on' : ''}`}
              onClick={() => handleChange('notifyEmail', !settings.notifyEmail)}
            >
              <div className="stg-toggle-knob"/>
            </button>
          </div>
          <div className="stg-toggle-row">
            <div>
              <div className="stg-toggle-label">Slack Integration</div>
              <div className="stg-toggle-sub">Send alerts to Slack channel</div>
            </div>
            <button
              className={`stg-toggle ${settings.notifySlack ? 'on' : ''}`}
              onClick={() => handleChange('notifySlack', !settings.notifySlack)}
            >
              <div className="stg-toggle-knob"/>
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="stg-section glass-panel">
          <div className="stg-section-title"><Shield size={16} color="#34d399"/> Display Preferences</div>
          <div className="stg-toggle-row">
            <div>
              <div className="stg-toggle-label">Dark Mode</div>
              <div className="stg-toggle-sub">Navy dark theme (recommended)</div>
            </div>
            <button
              className={`stg-toggle ${settings.darkMode ? 'on' : ''}`}
              onClick={() => handleChange('darkMode', !settings.darkMode)}
            >
              <div className="stg-toggle-knob"/>
            </button>
          </div>
          <div className="stg-toggle-row">
            <div>
              <div className="stg-toggle-label">Compact View</div>
              <div className="stg-toggle-sub">Show more data with smaller cards</div>
            </div>
            <button
              className={`stg-toggle ${settings.compactView ? 'on' : ''}`}
              onClick={() => handleChange('compactView', !settings.compactView)}
            >
              <div className="stg-toggle-knob"/>
            </button>
          </div>
        </div>
      </div>

      <div className="stg-footer">
        <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave}>
          {saved ? <><CheckCircle size={15}/> Saved!</> : <><Save size={15}/> Save Settings</>}
        </button>
      </div>

      <style>{`
        .settings-outer { height: 100%; overflow-y: auto; }
        .settings-page { padding: 24px; max-width: 840px; margin: 0 auto; }
        .stg-header { display: flex; gap: 14px; align-items: center; margin-bottom: 24px; }
        .stg-header-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-blue); }
        .stg-title { font-size: 1.1rem; font-weight: 800; }
        .stg-sub { font-size: 0.75rem; color: var(--text-muted); }
        .stg-sections { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .stg-section { padding: 20px; }
        .stg-section-title { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
        .stg-field { margin-bottom: 14px; }
        .stg-label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
        .stg-hint { font-size: 0.68rem; color: var(--text-muted); margin-top: 4px; display: block; }
        .stg-input-wrap { position: relative; }
        .stg-input {
          width: 100%; padding: 8px 12px; background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
          color: var(--text-primary); font-family: var(--font-mono); font-size: 0.82rem; outline: none;
          transition: border-color var(--transition-fast);
        }
        .stg-input:focus { border-color: var(--accent-blue); }
        .stg-input-sm { width: 120px; }
        .stg-eye { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
        .stg-range-wrap { display: flex; align-items: center; gap: 12px; }
        .stg-range { flex: 1; accent-color: var(--accent-blue); height: 4px; }
        .stg-range-val { font-family: var(--font-mono); font-weight: 700; font-size: 1rem; min-width: 32px; }
        .stg-toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); }
        .stg-toggle-row:last-child { border-bottom: none; }
        .stg-toggle-label { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); }
        .stg-toggle-sub { font-size: 0.68rem; color: var(--text-muted); }
        .stg-toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); cursor: pointer; position: relative; transition: all 0.2s ease; }
        .stg-toggle.on { background: var(--accent-blue); border-color: var(--accent-blue); }
        .stg-toggle-knob { width: 18px; height: 18px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: left 0.2s ease; }
        .stg-toggle.on .stg-toggle-knob { left: 22px; }
        .stg-footer { padding-top: 8px; padding-bottom: 24px; }
      `}</style>
      </div>
    </div>
  );
}
