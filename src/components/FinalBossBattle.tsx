import React, { useState } from 'react';
import type { FinalBoss } from '../types/game';
import { Skull, Zap, ShieldAlert, Award, Sparkles } from 'lucide-react';
import { sound } from '../engine/sound';

interface FinalBossBattleProps {
  boss: FinalBoss;
  onDefeatBoss: () => void;
}

export const FinalBossBattle: React.FC<FinalBossBattleProps> = ({ boss, onDefeatBoss }) => {
  const [battleState, setBattleState] = useState<'standoff' | 'striking' | 'slain'>('standoff');

  const handleStrike = () => {
    sound.playBossAppear();
    setBattleState('striking');

    setTimeout(() => {
      sound.playCriticalHit();
      setBattleState('slain');
    }, 700);
  };

  return (
    <div
      className={`rpg-card rpg-card-danger ${battleState === 'striking' ? 'animate-shake' : ''}`}
      style={{
        padding: '2.5rem 1.75rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      {battleState === 'standoff' && (
        <>
          <div className="rpg-badge badge-danger font-mono" style={{ marginBottom: '1.25rem' }}>
            <Skull size={15} />
            <span>⚔️ FINAL BOSS ENCOUNTER</span>
          </div>

          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
            {boss.icon}
          </div>

          <h2 className="font-rpg" style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 900,
            color: '#f87171',
            lineHeight: 1.15,
            marginBottom: '0.4rem',
            textShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
          }}>
            {boss.name}
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#cbd5e1',
            maxWidth: '550px',
            margin: '0 auto 1.5rem',
          }}>
            {boss.description}
          </p>

          {/* Infinite HP Bar */}
          <div style={{
            maxWidth: '450px',
            margin: '0 auto 1.5rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fca5a5',
              marginBottom: '0.35rem',
            }}>
              <span>BOSS INTEGRITY</span>
              <span className="font-mono">HP: ∞ / ∞</span>
            </div>

            <div style={{
              width: '100%',
              height: '20px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '9999px',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              overflow: 'hidden',
              padding: '2px',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #dc2626, #ef4444, #b91c1c)',
                borderRadius: '9999px',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
              }} />
            </div>
          </div>

          {/* Boss Abilities */}
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 2rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.25)',
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#f87171',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}>
              <ShieldAlert size={14} />
              <span>ACTIVE ANXIETY ABILITIES</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {boss.abilities.map((ability, idx) => (
                <span
                  key={idx}
                  className="rpg-badge"
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#fecaca',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    fontSize: '0.78rem',
                  }}
                >
                  ⚡ {ability}
                </span>
              ))}
            </div>
          </div>

          {/* Big Action Button */}
          <button
            onClick={handleStrike}
            className="btn-primary"
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.35rem',
              maxWidth: '420px',
              width: '100%',
              background: 'linear-gradient(135deg, #b91c1c, #dc2626, #f97316)',
              borderColor: '#fca5a5',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
            }}
          >
            <Zap size={22} />
            <span>{boss.actionButtonLabel}</span>
          </button>
        </>
      )}

      {battleState === 'striking' && (
        <div style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-spin">
            ⚡
          </div>
          <h2 className="font-rpg" style={{ fontSize: '2rem', color: '#facc15' }}>
            SEALING YOUR DESTINY...
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
            Pushing past 47 layers of psychological resistance...
          </p>
        </div>
      )}

      {battleState === 'slain' && (
        <div style={{ padding: '1rem 0' }}>
          <div className="rpg-badge badge-gold font-mono" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>⚡ CRITICAL HIT CONFIRMED</span>
          </div>

          <h2 className="font-rpg" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            color: '#34d399',
            marginBottom: '0.65rem',
            textShadow: '0 0 25px rgba(52, 211, 153, 0.4)',
          }}>
            THE THREAT HAS FALLEN!
          </h2>

          <div style={{
            fontSize: '1.15rem',
            color: '#f8fafc',
            maxWidth: '600px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.5,
          }}>
            {boss.victoryPunchline}
          </div>

          {/* Time Contrast Card */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto 2rem',
            background: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '10px',
            padding: '1.1rem',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                Actual Task Execution
              </div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                {boss.actualTaskTime}
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', color: '#64748b' }}>vs</div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                Time Spent Overthinking
              </div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
                {boss.overthinkingTime}
              </div>
            </div>
          </div>

          {/* Proceed to Results Button */}
          <button
            onClick={() => {
              sound.playQuestStart();
              onDefeatBoss();
            }}
            className="btn-primary"
            style={{ padding: '1.1rem 2.2rem', fontSize: '1.2rem', maxWidth: '380px', width: '100%' }}
          >
            <Award size={20} />
            <span>CLAIM VICTORY & VIEW STATS 🏆</span>
          </button>
        </div>
      )}
    </div>
  );
};
