import React, { useState } from 'react';
import type { FinalBoss, BossPlayerAction } from '../types/game';
import type { DeepQuestState } from '../engine/questEngine';
import { executeBossAction, isBossActionAvailable } from '../engine/questEngine';
import { SYLLABUS_BOSS_DATA } from '../engine/syllabusQuestData';
import { Skull, Zap, ShieldAlert, Award, Sparkles, Lock, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { sound } from '../engine/sound';

interface FinalBossBattleProps {
  boss?: FinalBoss;
  isDeepQuest?: boolean;
  questState?: DeepQuestState;
  onUpdateState?: (nextState: DeepQuestState) => void;
  onDefeatBoss: () => void;
}

export const FinalBossBattle: React.FC<FinalBossBattleProps> = ({
  boss,
  isDeepQuest = false,
  questState,
  onUpdateState,
  onDefeatBoss,
}) => {
  // Deep Quest state tracking
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [lastActionInfo, setLastActionInfo] = useState<{
    title: string;
    damage: number;
    feedback: string;
    reaction: string;
  } | null>(null);

  // Legacy boss state (multi-turn tactical resolution)
  const [legacyBossHp, setLegacyBossHp] = useState(100);
  const [legacyCombatLogs, setLegacyCombatLogs] = useState<string[]>([]);
  const [legacyLastReaction, setLegacyLastReaction] = useState<string | null>(null);

  // If Deep Quest, use Syllabus multi-phase boss data and questState
  const isDeep = isDeepQuest && !!questState;
  const currentPhaseIndex = questState?.bossPhaseIndex || 0;
  const currentPhase = SYLLABUS_BOSS_DATA.phases[currentPhaseIndex] || SYLLABUS_BOSS_DATA.phases[0];
  const bossHp = questState ? questState.bossCurrentHp : 100;
  const maxHp = currentPhase.bossMaxHp;
  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHp / maxHp) * 100)));

  // Handle tactical combat action in Deep Quest (IMMEDIATE, NO ASYNC FREEZE)
  const handleTacticalAction = (action: BossPlayerAction) => {
    if (!questState || !onUpdateState) return;

    // Check availability
    const check = isBossActionAvailable(action, questState);
    if (!check.available) {
      sound.playDoomAlarm();
      setBlockedReason(check.reason || 'This tactical counter-move is locked by unmet conditions.');
      return;
    }

    setBlockedReason(null);
    sound.playCriticalHit();

    // Execute state update immediately
    const result = executeBossAction(action, currentPhase, questState);
    onUpdateState(result.nextState);

    setLastActionInfo({
      title: action.title,
      damage: action.damage,
      feedback: action.playerFeedback,
      reaction: action.bossReaction,
    });

    if (result.phaseAdvance) {
      sound.playBossPhase();
    } else if (result.bossDefeated) {
      sound.playAchievement();
    }
  };

  // ----------------------------------------------------
  // 1. DEEP MULTI-PHASE BOSS — DEFEATED STATE
  // ----------------------------------------------------
  if (isDeep && questState && questState.bossCurrentHp <= 0) {
    return (
      <div
        className="rpg-card rpg-card-gold"
        style={{
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 40px rgba(234, 179, 8, 0.35)',
        }}
      >
        <div className="rpg-badge badge-gold font-mono" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>⚡ FINAL PHASE CONQUERED &bull; CLIMAX VICTORY</span>
        </div>

        <div style={{ fontSize: '4rem', marginBottom: '0.5rem', lineHeight: 1 }}>
          🎉
        </div>

        <h2 className="font-rpg" style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          color: '#34d399',
          marginBottom: '0.5rem',
          textShadow: '0 0 25px rgba(52, 211, 153, 0.4)',
        }}>
          THE GUARDIAN HAS FALLEN!
        </h2>

        {/* Final Boss Reaction */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderLeft: '4px solid #34d399',
          borderRadius: '0 8px 8px 0',
          padding: '1rem 1.25rem',
          maxWidth: '620px',
          margin: '0 auto 1.5rem',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '0.74rem',
            color: '#34d399',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.3rem',
          }}>
            🗣️ The Defeated Guardian's Final Words:
          </div>
          <div style={{ fontSize: '1rem', color: '#d1fae5', lineHeight: 1.5, fontStyle: 'italic' }}>
            {questState.lastBossReaction ? `"${questState.lastBossReaction}"` : '"IMPOSSIBLE! You conquered all three phases!"'}
          </div>
        </div>

        <p style={{
          fontSize: '1.05rem',
          color: '#e2e8f0',
          maxWidth: '560px',
          margin: '0 auto 1.75rem',
        }}>
          The 28-page syllabus collapses into harmless ash. Your submission portal is secure. Your psychological odyssey is complete.
        </p>

        <button
          onClick={() => {
            sound.playQuestStart();
            onDefeatBoss();
          }}
          className="btn-primary"
          style={{
            padding: '1.1rem 2.5rem',
            fontSize: '1.25rem',
            maxWidth: '420px',
            width: '100%',
          }}
        >
          <Award size={22} />
          <span>CLAIM VICTORY & VIEW ENDING 🏆</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. DEEP MULTI-PHASE BOSS — ACTIVE BATTLE RENDER
  // ----------------------------------------------------
  if (isDeep && questState) {
    return (
      <div
        className="rpg-card rpg-card-danger"
        style={{
          padding: '2rem 1.75rem',
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'rgba(20, 10, 18, 0.85)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
        }}
      >
        {/* Phase Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div className="rpg-badge badge-danger font-mono" style={{ fontSize: '0.82rem' }}>
            <Skull size={14} />
            <span>CLIMAX ENCOUNTER: PHASE {currentPhase.phaseNumber} OF 3</span>
          </div>

          <div className="rpg-badge badge-gold font-mono" style={{ fontSize: '0.78rem' }}>
            <BookOpen size={13} />
            <span>{currentPhase.phaseName.split(':')[1]?.trim() || currentPhase.phaseName}</span>
          </div>
        </div>

        {/* Boss Icon & Name */}
        <div style={{ fontSize: '3.5rem', marginBottom: '0.35rem', lineHeight: 1 }}>
          {SYLLABUS_BOSS_DATA.icon}
        </div>

        <h2 className="font-rpg" style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
          fontWeight: 900,
          color: '#f87171',
          lineHeight: 1.15,
          marginBottom: '0.25rem',
          textShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
        }}>
          {SYLLABUS_BOSS_DATA.name}
        </h2>

        <p style={{
          fontSize: '0.92rem',
          color: '#cbd5e1',
          maxWidth: '560px',
          margin: '0 auto 1.25rem',
          fontStyle: 'italic',
        }}>
          "{currentPhase.subtitle}"
        </p>

        {/* Boss Dialogue Speech Bubble */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderLeft: '4px solid #ef4444',
          borderRadius: '0 8px 8px 0',
          padding: '0.85rem 1.15rem',
          maxWidth: '620px',
          margin: '0 auto 1.5rem',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '0.74rem',
            color: '#f87171',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.25rem',
          }}>
            🗣️ The Guardian Speaks:
          </div>
          <div style={{ fontSize: '0.95rem', color: '#fecaca', lineHeight: 1.45, fontWeight: 500 }}>
            {questState.lastBossReaction ? `"${questState.lastBossReaction}"` : currentPhase.bossDialogue}
          </div>
        </div>

        {/* Phase Boss HP Bar */}
        <div style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#fca5a5',
            marginBottom: '0.35rem',
          }}>
            <span>PHASE {currentPhase.phaseNumber} INTEGRITY</span>
            <span className="font-mono">HP: {bossHp} / {maxHp} ({hpPercent}%)</span>
          </div>

          <div style={{
            width: '100%',
            height: '18px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '9999px',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            overflow: 'hidden',
            padding: '2px',
          }}>
            <div style={{
              width: `${hpPercent}%`,
              height: '100%',
              background: hpPercent > 50
                ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                : 'linear-gradient(90deg, #b91c1c, #f97316)',
              borderRadius: '9999px',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
              transition: 'width 0.2s ease',
            }} />
          </div>
        </div>

        {/* Boss Active Threat Ticker */}
        <div style={{
          maxWidth: '560px',
          margin: '0 auto 1.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          border: '1px solid rgba(239, 68, 68, 0.25)',
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#f87171',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}>
            <ShieldAlert size={13} />
            <span>ACTIVE ACADEMIC THREAT: {currentPhase.bossAttackName}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {currentPhase.bossAbilities.map((ability, idx) => (
              <span
                key={idx}
                className="rpg-badge"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#fecaca',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '0.74rem',
                }}
              >
                ⚡ {ability}
              </span>
            ))}
          </div>
        </div>

        {/* Locked Action Error Banner if user clicked a blocked move */}
        {blockedReason && (
          <div style={{
            maxWidth: '640px',
            margin: '0 auto 1.25rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <span><strong>Action Unavailable:</strong> {blockedReason}</span>
            </div>
            <button
              onClick={() => setBlockedReason(null)}
              className="btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Immediate Strike Feedback Banner */}
        {lastActionInfo && (
          <div style={{
            maxWidth: '640px',
            margin: '0 auto 1.25rem',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.84rem' }}>
              <Zap size={14} />
              <span>{lastActionInfo.title.toUpperCase()} DEALT {lastActionInfo.damage} DAMAGE!</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#f8fafc', marginTop: '0.2rem' }}>
              {lastActionInfo.feedback}
            </div>
          </div>
        )}

        {/* Tactical Actions Grid */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: 'var(--text-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}>
            <Sparkles size={15} />
            <span>CHOOSE YOUR TACTICAL COUNTER-MOVE</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.85rem',
            textAlign: 'left',
          }}>
            {currentPhase.actions.map((action) => {
              const check = isBossActionAvailable(action, questState);
              const isAvailable = check.available;

              return (
                <div
                  key={action.id}
                  onClick={() => handleTacticalAction(action)}
                  className="choice-card"
                  style={{
                    borderColor: !isAvailable ? 'rgba(148, 163, 184, 0.2)' : 'rgba(234, 179, 8, 0.45)',
                    background: !isAvailable ? 'rgba(15, 23, 42, 0.5)' : 'rgba(26, 33, 50, 0.85)',
                    cursor: !isAvailable ? 'not-allowed' : 'pointer',
                    opacity: !isAvailable ? 0.65 : 1,
                    padding: '0.95rem 1.1rem',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#ffffff' }}>
                        {action.title}
                      </span>
                    </div>

                    {!isAvailable ? (
                      <span
                        className="rpg-badge font-mono"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          fontSize: '0.7rem',
                        }}
                      >
                        <Lock size={10} />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="font-mono" style={{ fontSize: '0.82rem', color: '#f87171', fontWeight: 800 }}>
                        -{action.damage} HP
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    {action.description}
                  </div>

                  {!isAvailable && check.reason && (
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.74rem',
                      color: '#fca5a5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <Lock size={11} />
                      <span>{check.reason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Combat Log Ticker */}
        {questState.bossCombatLog.length > 0 && (
          <div style={{
            maxWidth: '640px',
            margin: '1.5rem auto 0',
            background: 'rgba(10, 15, 25, 0.7)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            textAlign: 'left',
            border: '1px solid rgba(148, 163, 184, 0.15)',
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '0.35rem',
            }}>
              Recent Combat Log:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              {questState.bossCombatLog[0]}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. GENERAL / LEGACY BOSS TACTICAL COMBAT
  // ----------------------------------------------------
  if (!boss) return null;

  // Tactical strike for general quest bosses
  const handleGeneralStrike = (type: 'direct' | 'overthink' | 'chaotic') => {
    sound.playCriticalHit();

    let damage = 40;
    let title = 'Direct Strike';
    let reaction = 'The boss reels from sudden practical action!';

    if (type === 'direct') {
      damage = 45;
      title = 'Direct Decisive Assault';
      reaction = `"${boss.name} trembles! Your refusal to overthink deals direct psychological damage!"`;
    } else if (type === 'overthink') {
      damage = 35;
      title = 'Overthinking Counter-Maneuver';
      reaction = `"${boss.name} gets tangled in your elaborate 14-step mitigation strategy!"`;
    } else {
      damage = 50;
      title = 'Chaotic Escalation Gamble';
      reaction = `"${boss.name} cannot predict your unhinged defiance!"`;
    }

    const nextHp = Math.max(0, legacyBossHp - damage);
    setLegacyBossHp(nextHp);
    setLegacyLastReaction(reaction);
    setLegacyCombatLogs((prev) => [
      `${title} dealt ${damage} DMG! ${reaction}`,
      ...prev.slice(0, 3),
    ]);

    if (nextHp <= 0) {
      sound.playAchievement();
    }
  };

  // General boss defeated
  if (legacyBossHp <= 0) {
    return (
      <div
        className="rpg-card rpg-card-gold"
        style={{
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div className="rpg-badge badge-gold font-mono" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>⚡ BOSS CONQUERED</span>
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
    );
  }

  // General boss active battle
  return (
    <div
      className="rpg-card rpg-card-danger"
      style={{
        padding: '2.2rem 1.75rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      <div className="rpg-badge badge-danger font-mono" style={{ marginBottom: '1.25rem' }}>
        <Skull size={15} />
        <span>⚔️ CLIMAX BOSS ENCOUNTER</span>
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
        margin: '0 auto 1.25rem',
      }}>
        {boss.description}
      </p>

      {/* HP Bar */}
      <div style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#fca5a5',
          marginBottom: '0.35rem',
        }}>
          <span>BOSS STABILITY</span>
          <span className="font-mono">HP: {legacyBossHp} / 100</span>
        </div>

        <div style={{
          width: '100%',
          height: '16px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '9999px',
          border: '2px solid rgba(239, 68, 68, 0.6)',
          overflow: 'hidden',
          padding: '2px',
        }}>
          <div style={{
            width: `${legacyBossHp}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #dc2626, #ef4444)',
            borderRadius: '9999px',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
            transition: 'width 0.2s ease',
          }} />
        </div>
      </div>

      {/* Boss Speech Bubble */}
      {legacyLastReaction && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderLeft: '4px solid #ef4444',
          borderRadius: '0 8px 8px 0',
          padding: '0.75rem 1rem',
          maxWidth: '580px',
          margin: '0 auto 1.5rem',
          textAlign: 'left',
          fontSize: '0.92rem',
          color: '#fecaca',
        }}>
          {legacyLastReaction}
        </div>
      )}

      {/* Tactical Options */}
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: 'var(--text-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.85rem',
        }}>
          CHOOSE YOUR TACTICAL COUNTER-MOVE
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}>
          <button
            type="button"
            onClick={() => handleGeneralStrike('direct')}
            className="btn-primary"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
          >
            <Zap size={16} />
            <span>Direct Strike (-45 HP)</span>
          </button>

          <button
            type="button"
            onClick={() => handleGeneralStrike('overthink')}
            className="btn-secondary"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
          >
            <BookOpen size={16} />
            <span>Overthink Strategy (-35 HP)</span>
          </button>

          <button
            type="button"
            onClick={() => handleGeneralStrike('chaotic')}
            className="btn-worse"
            style={{ padding: '0.85rem 1rem', fontSize: '0.95rem' }}
          >
            <ArrowRight size={16} />
            <span>Chaotic Gamble (-50 HP)</span>
          </button>
        </div>

        {legacyCombatLogs.length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(10, 15, 25, 0.7)',
            borderRadius: '6px',
            padding: '0.65rem 0.9rem',
            textAlign: 'left',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            fontSize: '0.8rem',
            color: '#cbd5e1',
          }}>
            {legacyCombatLogs[0]}
          </div>
        )}
      </div>
    </div>
  );
};
