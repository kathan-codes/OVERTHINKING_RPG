import React, { useState, useEffect } from 'react';
import type { Quest, Achievement, GameStats, EndingDefinition, DecisionLog } from '../types/game';
import { Award, RotateCcw, Share2, Check, Sparkles, BookOpen, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../engine/sound';

interface QuestResultProps {
  quest: Quest;
  stats: GameStats;
  achievements: Achievement[];
  onPlayAgain: () => void;
  endingDefinition?: EndingDefinition | null;
  decisionLogs?: DecisionLog[];
}

export const QuestResult: React.FC<QuestResultProps> = ({
  quest,
  stats,
  achievements,
  onPlayAgain,
  endingDefinition,
  decisionLogs = [],
}) => {
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [showLogTimeline, setShowLogTimeline] = useState(false);
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    sound.playAchievement();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#facc15', '#f59e0b', '#ef4444', '#a855f7', '#38bdf8', '#34d399'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const endingTitle = endingDefinition?.title || 'Quest Complete';
  const archetypeBadge = endingDefinition?.badge || '🏆 QUEST COMPLETED';
  const narrative = endingDefinition?.narrative || 'You have survived the psychological odyssey and emerged on the other side.';
  const whyHappened = endingDefinition?.whyThisHappened || 'Your journey reflected a unique balance of decisions and overthinking.';
  const realityCheckMundane = endingDefinition?.realityCheckMundaneTask || 'You had a single task to complete.';
  const realityCheckVerdict = endingDefinition?.realityCheckVerdict || 'You could have simply done it.';

  const handleCopyChronicle = () => {
    sound.playClick();
    const chronicle = `🧠⚔️ OVERTHINKING RPG CHRONICLE
Quest: ${quest.title}
Ending: ${archetypeBadge} — "${endingTitle}"
Original Task: "${quest.originalProblem}"
Time Wasted: ${stats.timeWastedMinutes} fictional minutes
Peak Overthinking: ${stats.overthinkingPercentage}%
Doom: ${stats.doomPercentage || 0}% | Resolve: ${stats.resolvePercentage || 0}%
Decisions Made: ${stats.decisionsMade} (Decisive/Rational: ${stats.rationalDecisions})
Reality Distortion: ${stats.realityDistortionPercent}%
Productivity: ${stats.productivityPercent}%

Unlocked Achievements:
${achievements.map((a) => `${a.icon} ${a.title} - ${a.description}`).join('\n')}

Reality Check:
${realityCheckMundane}
Verdict: ${realityCheckVerdict}`;

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
        {/* Archetype Badge */}
        <div className="rpg-badge badge-gold font-mono" style={{ marginBottom: '0.85rem', fontSize: '0.88rem' }}>
          <Sparkles size={14} />
          <span>{archetypeBadge}</span>
        </div>

        {/* Ending Title */}
        <h1 className="font-rpg" style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '0.4rem',
          lineHeight: 1.15,
          textShadow: '0 0 25px rgba(234, 179, 8, 0.3)',
        }}>
          {endingTitle}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '580px',
          margin: '0 auto 1.5rem',
        }}>
          Original real-world task: <strong style={{ color: '#facc15' }}>"{quest.originalProblem}"</strong>
        </p>

        {/* Narrative Epilogue Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          marginBottom: '1.75rem',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--text-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.45rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <BookOpen size={14} />
            <span>NARRATIVE EPILOGUE</span>
          </div>

          <div style={{
            fontSize: '1.02rem',
            color: '#f8fafc',
            lineHeight: 1.6,
            marginBottom: '0.85rem',
          }}>
            {narrative}
          </div>

          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(234, 179, 8, 0.08)',
            borderLeft: '3px solid #facc15',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}>
            💡 <strong>Why this occurred:</strong> {whyHappened}
          </div>
        </div>

        {/* Final Statistics Audit Grid */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          marginBottom: '1.75rem',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>⏱️ Fictional Time Lost</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
                {stats.timeWastedMinutes} mins
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>🧠 Peak Overthinking</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>
                {stats.overthinkingPercentage}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>🔥 Final Doom Level</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
                {stats.doomPercentage || 0}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>🛡️ Final Resolve</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
                {stats.resolvePercentage || 0}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>⚔️ Decisions Made</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a855f7' }}>
                {stats.decisionsMade} (Decisive: {stats.rationalDecisions})
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>💥 Complications Added</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f43f5e' }}>
                {stats.unnecessaryComplications}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>🌀 Reality Distortion</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c084fc' }}>
                {stats.realityDistortionPercent}%
              </div>
            </div>

            <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>📈 True Productivity</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                {stats.productivityPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Decision Recap Journey Accordion */}
        {decisionLogs.length > 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: '10px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            marginBottom: '1.75rem',
            textAlign: 'left',
            overflow: 'hidden',
          }}>
            <div
              onClick={() => {
                sound.playClick();
                setShowLogTimeline(!showLogTimeline);
              }}
              style={{
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Compass size={16} color="#facc15" />
                <span className="font-rpg" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9' }}>
                  YOUR 10-DECISION SAGA JOURNEY ({decisionLogs.length} Choices)
                </span>
              </div>
              <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem' }}>{showLogTimeline ? 'Hide' : 'Review Timeline'}</span>
                {showLogTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {showLogTimeline && (
              <div style={{ padding: '0 1.15rem 1rem', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
                  {decisionLogs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(24, 32, 50, 0.7)',
                        borderRadius: '6px',
                        padding: '0.6rem 0.8rem',
                        borderLeft: '3px solid #38bdf8',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span>DECISION #{idx + 1} &bull; {log.stageTitle}</span>
                        <span className="font-mono" style={{ color: '#facc15' }}>{log.choiceType}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc', marginTop: '2px' }}>
                        {log.choiceTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                        &rarr; {log.consequence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
                <span style={{ fontSize: '1.8rem' }}>{ach.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fef08a' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
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
            <span>⚔️ NEW QUEST / REPLAY</span>
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
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
              padding: '2.2rem 1.75rem',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.65rem' }}>🧘</span>

            <h3 className="font-rpg" style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#facc15',
              marginBottom: '0.85rem',
            }}>
              REALITY CHECK
            </h3>

            <div style={{
              fontSize: '1.15rem',
              color: '#ffffff',
              fontWeight: 600,
              marginBottom: '1rem',
              lineHeight: 1.4,
            }}>
              You could have simply done the thing.
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              marginBottom: '1rem',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Actual Real-World Activity:
              </div>
              <div style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600, lineHeight: 1.45 }}>
                {realityCheckMundane}
              </div>
            </div>

            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '0.76rem', color: '#f87171', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 700 }}>
                Auditor\'s Verdict:
              </div>
              <div style={{ fontSize: '0.92rem', color: '#fecaca', lineHeight: 1.45 }}>
                {realityCheckVerdict}
              </div>
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
