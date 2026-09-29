import React, { useState, useEffect } from 'react';
import type { Quest, Achievement, GameStats } from '../types/game';
import { Award, RotateCcw, Share2, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../engine/sound';

interface QuestResultProps {
  quest: Quest;
  stats: GameStats;
  achievements: Achievement[];
  onPlayAgain: () => void;
}

export const QuestResult: React.FC<QuestResultProps> = ({
  quest,
  stats,
  achievements,
  onPlayAgain,
}) => {
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    sound.playAchievement();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#f59e0b', '#ef4444', '#a855f7', '#38bdf8'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleCopyChronicle = () => {
    sound.playClick();
    const chronicle = `🧠⚔️ OVERTHINKING RPG CHRONICLE
Quest: ${quest.title}
Original Problem: "${quest.originalProblem}"
Time Wasted Overthinking: ${stats.timeWastedMinutes} minutes
Peak Overthinking: ${stats.overthinkingPercentage}%
Decisions Made: ${stats.decisionsMade} (Rational: ${stats.rationalDecisions})
Unnecessary Complications: ${stats.unnecessaryComplications}
Reality Distortion: ${stats.realityDistortionPercent}%
Productivity: ${stats.productivityPercent}%

Unlocked Achievements:
${achievements.map((a) => `${a.icon} ${a.title} - ${a.description}`).join('\n')}

Reality Check: You could have just done the thing.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(chronicle).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div className="rpg-card rpg-card-gold" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {/* Victory Header */}
        <div className="rpg-badge badge-gold font-mono" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>QUEST COMPLETE</span>
        </div>

        <h1 className="font-rpg" style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '0.4rem',
          lineHeight: 1.15,
        }}>
          {quest.title}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '550px',
          margin: '0 auto 1.5rem',
        }}>
          Original real-world task: <strong style={{ color: '#facc15' }}>"{quest.originalProblem}"</strong>
        </p>

        {/* Final Statistics Grid */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          marginBottom: '2rem',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            📊 FINAL OVERTHINKING AUDIT
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.1rem',
          }}>
            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⏱️ Time Wasted Overthinking</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
                {stats.timeWastedMinutes} mins
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🧠 Peak Overthinking</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                {stats.overthinkingPercentage}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⚔️ Decisions Made</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {stats.decisionsMade}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>💀 Rational Decisions</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>
                {stats.rationalDecisions}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔥 Complications Created</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e' }}>
                {stats.unnecessaryComplications}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>😬 Confidence Level</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fca5a5' }}>
                {stats.confidencePercent}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🌀 Reality Distortion</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>
                {stats.realityDistortionPercent}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>📈 True Productivity</div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                {stats.productivityPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements Section */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Award size={16} />
            <span>ACHIEVEMENTS UNLOCKED ({achievements.length})</span>
          </div>

          <div className="grid-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  background: 'rgba(234, 179, 8, 0.08)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{ach.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fef08a' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {ach.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Reality Check, Share, Play Again */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}>
          {/* REALITY CHECK BUTTON */}
          <button
            onClick={() => {
              sound.playClick();
              setShowRealityCheck(true);
            }}
            className="btn-secondary"
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '1rem',
              borderColor: 'rgba(168, 85, 247, 0.45)',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#d8b4fe',
              fontWeight: 700,
            }}
          >
            <span>🧘 REALITY CHECK</span>
          </button>

          {/* COPY QUEST CHRONICLE */}
          <button
            onClick={handleCopyChronicle}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.4rem', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="#34d399" /> : <Share2 size={18} />}
            <span>{copied ? 'Chronicle Copied!' : 'Copy Quest Log'}</span>
          </button>

          {/* PLAY AGAIN BUTTON */}
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1.1rem' }}
          >
            <RotateCcw size={18} />
            <span>⚔️ NEW QUEST</span>
          </button>
        </div>
      </div>

      {/* REALITY CHECK MODAL DIALOG */}
      {showRealityCheck && (
        <div
          className="modal-backdrop"
          onClick={() => setShowRealityCheck(false)}
        >
          <div
            className="rpg-card rpg-card-gold"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
              padding: '2.2rem 1.75rem',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🧘</span>
            
            <h3 className="font-rpg" style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#facc15',
              marginBottom: '1rem',
            }}>
              REALITY CHECK
            </h3>

            <div style={{
              fontSize: '1.2rem',
              color: '#ffffff',
              fontWeight: 600,
              marginBottom: '1rem',
              lineHeight: 1.4,
            }}>
              You could have just done the thing.
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              marginBottom: '1.25rem',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                The Actual Problem Was:
              </div>
              <div style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 700 }}>
                "{quest.originalProblem}"
              </div>
            </div>

            <div style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              fontStyle: 'italic',
              marginBottom: '1.5rem',
            }}>
              That's it.
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowRealityCheck(false);
              }}
              className="btn-primary"
              style={{ width: '100%', maxWidth: '240px' }}
            >
              <span>Understood 🫡</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
