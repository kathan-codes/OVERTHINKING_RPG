import React from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '../engine/sound';

interface NavbarProps {
  soundMuted: boolean;
  onToggleSound: () => void;
  onDemoMode: () => void;
  onReset: () => void;
  isGameActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundMuted,
  onToggleSound,
  onDemoMode,
  onReset,
  isGameActive,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      background: 'rgba(10, 12, 18, 0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
      }}>
        {/* Logo / Brand */}
        <div 
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🧠</span>
          <div>
            <div className="font-rpg" style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              OVERTHINKING RPG
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Unnecessarily Epic Quests
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Demo Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onDemoMode();
            }}
            className="btn-secondary"
            title="Load instant demonstration: Email My Professor"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderColor: 'rgba(234, 179, 8, 0.4)',
              background: 'rgba(234, 179, 8, 0.12)',
              color: '#fef08a',
            }}
          >
            <Sparkles size={14} color="#facc15" />
            <span>🎬 DEMO MODE</span>
          </button>

          {/* Reset / New Quest Button if in game */}
          {isGameActive && (
            <button
              onClick={() => {
                sound.playClick();
                onReset();
              }}
              className="btn-secondary"
              title="Return to Home"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className="btn-secondary"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            style={{
              padding: '0.45rem 0.65rem',
              color: soundMuted ? '#94a3b8' : '#38bdf8',
            }}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
