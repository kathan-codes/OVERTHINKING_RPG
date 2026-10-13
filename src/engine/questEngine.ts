import type {
  StatBlock,
  InventoryItem,
  Scene,
  SceneChoice,
  DecisionLog,
  GameStats,
  BossPhase,
  BossPlayerAction,
  EndingDefinition,
  Achievement,
} from '../types/game';

import {
  SYLLABUS_ITEMS,
  SYLLABUS_BOSS_DATA,
  SYLLABUS_ENDINGS,
  SYLLABUS_ACHIEVEMENTS,
} from './syllabusQuestData';

export interface DeepQuestState {
  currentSceneId: string;
  stats: StatBlock;
  inventory: InventoryItem[];
  flags: Set<string>;
  decisionHistory: DecisionLog[];
  makeWorseClicks: number;
  activeComplications: string[];
  unlockedAchievementIds: Set<string>;
  // Boss Battle State
  bossPhaseIndex: number; // 0 = Phase 1, 1 = Phase 2, 2 = Phase 3
  bossCurrentHp: number;
  bossCombatLog: string[];
  lastBossReaction: string | null;
  // Ending
  evaluatedEnding: EndingDefinition | null;
}

export function createInitialSyllabusState(): DeepQuestState {
  return {
    currentSceneId: 'act1_spark',
    stats: {
      overthinking: 15,
      doom: 15,
      resolve: 35,
      timeLostMinutes: 0,
    },
    // Start with 2 initial inventory items, rest discoverable during run
    inventory: [
      { ...SYLLABUS_ITEMS[0], used: false }, // The Study Plan of Infinite Preparation
      { ...SYLLABUS_ITEMS[1], used: false }, // Potion of False Confidence
    ],
    flags: new Set<string>(),
    decisionHistory: [],
    makeWorseClicks: 0,
    activeComplications: [],
    unlockedAchievementIds: new Set<string>(),
    bossPhaseIndex: 0,
    bossCurrentHp: SYLLABUS_BOSS_DATA.phases[0].bossMaxHp,
    bossCombatLog: [],
    lastBossReaction: null,
    evaluatedEnding: null,
  };
}

export function isChoiceAvailable(choice: SceneChoice, state: DeepQuestState): { available: boolean; reason?: string } {
  if (!choice.condition) return { available: true };

  const { minResolve, maxDoom, minOverthinking, requiresItem, requiresFlag } = choice.condition;

  if (minResolve !== undefined && state.stats.resolve < minResolve) {
    return { available: false, reason: `Requires at least ${minResolve} Resolve (current: ${state.stats.resolve})` };
  }

  if (maxDoom !== undefined && state.stats.doom > maxDoom) {
    return { available: false, reason: `Requires Doom to be ${maxDoom} or lower (current: ${state.stats.doom})` };
  }

  if (minOverthinking !== undefined && state.stats.overthinking < minOverthinking) {
    return { available: false, reason: `Requires Overthinking of ${minOverthinking}% or higher (current: ${state.stats.overthinking}%)` };
  }

  if (requiresItem) {
    const hasIt = state.inventory.some((i) => i.id === requiresItem && !i.used);
    if (!hasIt) {
      return { available: false, reason: `Requires item: ${requiresItem.replace(/_/g, ' ')} in inventory` };
    }
  }

  if (requiresFlag && !state.flags.has(requiresFlag)) {
    return { available: false, reason: `Requires prior decision: ${requiresFlag.replace(/_/g, ' ')}` };
  }

  return { available: true };
}

export function isBossActionAvailable(
  action: BossPlayerAction,
  state: DeepQuestState
): { available: boolean; reason?: string } {
  if (!action.condition) return { available: true };

  const { minResolve, requiresItem, requiresFlag } = action.condition;

  if (minResolve !== undefined && state.stats.resolve < minResolve) {
    return { available: false, reason: `Requires at least ${minResolve} Resolve (current: ${state.stats.resolve})` };
  }

  if (requiresItem) {
    const hasIt = state.inventory.some((i) => i.id === requiresItem);
    if (!hasIt) {
      return { available: false, reason: `Requires ${requiresItem.replace(/_/g, ' ')} in inventory` };
    }
  }

  if (requiresFlag && !state.flags.has(requiresFlag)) {
    return { available: false, reason: `Requires unlocking decision flag` };
  }

  return { available: true };
}

export function applyStatDeltas(stats: StatBlock, deltas?: Partial<StatBlock>): StatBlock {
  if (!deltas) return { ...stats };
  return {
    overthinking: Math.max(0, Math.min(180, stats.overthinking + (deltas.overthinking || 0))),
    doom: Math.max(0, Math.min(100, stats.doom + (deltas.doom || 0))),
    resolve: Math.max(0, Math.min(100, stats.resolve + (deltas.resolve || 0))),
    timeLostMinutes: Math.max(0, stats.timeLostMinutes + (deltas.timeLostMinutes || 0)),
  };
}

export function executeSceneChoice(
  scene: Scene,
  choice: SceneChoice,
  currentState: DeepQuestState
): { nextState: DeepQuestState; reachedBoss: boolean } {
  // 1. Calculate new stats
  const nextStats = applyStatDeltas(currentState.stats, choice.statDeltas);

  // 2. Add flags
  const nextFlags = new Set(currentState.flags);
  if (choice.setFlags) {
    choice.setFlags.forEach((f) => nextFlags.add(f));
  }

  // 3. Update inventory (rewards or consumptions)
  let nextInventory = [...currentState.inventory];
  if (choice.itemReward) {
    const exists = nextInventory.some((i) => i.id === choice.itemReward!.id);
    if (!exists) {
      nextInventory.push({ ...choice.itemReward, used: false });
    }
  }
  if (choice.consumeItem) {
    nextInventory = nextInventory.map((i) =>
      i.id === choice.consumeItem ? { ...i, used: true } : i
    );
  }

  // 4. Record decision log
  const newLog: DecisionLog = {
    stageIndex: currentState.decisionHistory.length + 1,
    stageTitle: scene.title,
    choiceTitle: choice.title,
    choiceType: choice.type,
    consequence: choice.consequence,
    overthinkingDelta: choice.statDeltas.overthinking || 0,
    statDeltas: choice.statDeltas,
    act: scene.act,
  };
  const nextHistory = [...currentState.decisionHistory, newLog];

  // 5. Check achievements
  const nextAchievements = new Set(currentState.unlockedAchievementIds);
  if (choice.unlockedAchievementId) {
    nextAchievements.add(choice.unlockedAchievementId);
  }
  if (nextStats.overthinking >= 75 || nextStats.doom >= 75) {
    nextAchievements.add('master_disasters');
  }
  if (choice.type === 'DECISIVE' && nextStats.resolve >= 50) {
    const decisiveCount = nextHistory.filter((d) => d.choiceType === 'DECISIVE').length;
    if (decisiveCount >= 4) {
      nextAchievements.add('surprisingly_decisive');
    }
  }
  if (nextStats.timeLostMinutes >= 60) {
    nextAchievements.add('excessive_prep');
  }

  const reachedBoss = choice.nextSceneId === 'BOSS_BATTLE';
  const nextSceneId = reachedBoss ? 'BOSS_BATTLE' : choice.nextSceneId;

  return {
    nextState: {
      ...currentState,
      currentSceneId: nextSceneId,
      stats: nextStats,
      flags: nextFlags,
      inventory: nextInventory,
      decisionHistory: nextHistory,
      unlockedAchievementIds: nextAchievements,
    },
    reachedBoss,
  };
}

export function applyInventoryItem(
  item: InventoryItem,
  currentState: DeepQuestState
): DeepQuestState {
  if (item.used || !item.usable) return currentState;

  const nextStats = applyStatDeltas(currentState.stats, item.statDeltas);
  const nextInventory = currentState.inventory.map((i) =>
    i.id === item.id ? { ...i, used: true } : i
  );

  const nextFlags = new Set(currentState.flags);
  nextFlags.add(`used_item_${item.id}`);
  if (item.id === 'study_plan') {
    nextFlags.add('used_study_plan');
  }
  if (item.id === 'scroll_doom') {
    nextFlags.add('used_scroll_of_doom');
  }

  const nextAchievements = new Set(currentState.unlockedAchievementIds);
  if (item.id === 'study_plan' && nextFlags.has('crafted_study_plan')) {
    nextAchievements.add('plan_was_real_boss');
  }
  if (item.id === 'pomodoro_hourglass') {
    nextAchievements.add('pomodoro_heretic');
  }

  return {
    ...currentState,
    stats: nextStats,
    inventory: nextInventory,
    flags: nextFlags,
    unlockedAchievementIds: nextAchievements,
  };
}

export function executeBossAction(
  action: BossPlayerAction,
  currentPhase: BossPhase,
  currentState: DeepQuestState
): {
  nextState: DeepQuestState;
  phaseAdvance: boolean;
  bossDefeated: boolean;
} {
  const nextHp = Math.max(0, currentState.bossCurrentHp - action.damage);
  const nextStats = applyStatDeltas(currentState.stats, action.statDeltas);

  const nextFlags = new Set(currentState.flags);
  if (action.id === 'b2_plan_weapon') {
    nextFlags.add('used_plan_against_boss');
  }
  if (action.id === 'b3_great_bluff') {
    nextFlags.add('used_great_bluff');
  }

  const newLogEntry = `${action.title} dealt ${action.damage} DMG! ${action.playerFeedback}`;
  const nextCombatLog = [newLogEntry, ...currentState.bossCombatLog.slice(0, 5)];

  const newDecisionLog: DecisionLog = {
    stageIndex: 8 + currentState.bossPhaseIndex + 1,
    stageTitle: `Climax Encounter: Phase ${currentPhase.phaseNumber}`,
    choiceTitle: action.title,
    choiceType: 'ATTACK',
    consequence: `${action.playerFeedback} (${action.damage} DMG)`,
    overthinkingDelta: action.statDeltas?.overthinking ?? 0,
  };
  const nextHistory = [...currentState.decisionHistory, newDecisionLog];

  const nextAchievements = new Set(currentState.unlockedAchievementIds);
  if (action.id === 'b2_plan_weapon') {
    nextAchievements.add('plan_was_real_boss');
  }

  // Check if phase cleared
  if (nextHp <= 0) {
    if (currentState.bossPhaseIndex < SYLLABUS_BOSS_DATA.phases.length - 1) {
      // Advance to next boss phase
      const nextPhaseIdx = currentState.bossPhaseIndex + 1;
      const nextPhaseData = SYLLABUS_BOSS_DATA.phases[nextPhaseIdx];

      return {
        nextState: {
          ...currentState,
          stats: nextStats,
          flags: nextFlags,
          decisionHistory: nextHistory,
          bossPhaseIndex: nextPhaseIdx,
          bossCurrentHp: nextPhaseData.bossMaxHp,
          lastBossReaction: action.bossReaction,
          bossCombatLog: [
            `*** PHASE ${currentPhase.phaseNumber} BROKEN! Advancing to ${nextPhaseData.phaseName} ***`,
            ...nextCombatLog,
          ],
          unlockedAchievementIds: nextAchievements,
        },
        phaseAdvance: true,
        bossDefeated: false,
      };
    } else {
      // Final phase defeated!
      nextAchievements.add('syllabus_slayer');
      const finalEnding = evaluateEnding({
        ...currentState,
        stats: nextStats,
        flags: nextFlags,
        decisionHistory: nextHistory,
      });

      return {
        nextState: {
          ...currentState,
          stats: nextStats,
          flags: nextFlags,
          decisionHistory: nextHistory,
          bossCurrentHp: 0,
          lastBossReaction: action.bossReaction,
          bossCombatLog: ['*** THE GUARDIAN HAS FALLEN! THE SYLLABUS IS CONQUERED! ***', ...nextCombatLog],
          unlockedAchievementIds: nextAchievements,
          evaluatedEnding: finalEnding,
        },
        phaseAdvance: false,
        bossDefeated: true,
      };
    }
  }

  return {
    nextState: {
      ...currentState,
      stats: nextStats,
      flags: nextFlags,
      decisionHistory: nextHistory,
      bossCurrentHp: nextHp,
      lastBossReaction: action.bossReaction,
      bossCombatLog: nextCombatLog,
      unlockedAchievementIds: nextAchievements,
    },
    phaseAdvance: false,
    bossDefeated: false,
  };
}

export function evaluateEnding(state: DeepQuestState): EndingDefinition {
  const { stats, flags, decisionHistory } = state;

  const decisiveCount = decisionHistory.filter((d) => d.choiceType === 'DECISIVE').length;
  const isChaoticBluffer =
    flags.has('bullshit_mastery') ||
    flags.has('used_great_bluff') ||
    flags.has('bluffed_in_group_chat');

  const isHeavyPreparer =
    flags.has('heavy_preparer') ||
    flags.has('crafted_study_plan') ||
    flags.has('schedule_recalibrated') ||
    stats.timeLostMinutes >= 50;

  const isPureCatastrophizer =
    flags.has('doom_spiral') ||
    flags.has('full_ratemyprofessor_lore') ||
    flags.has('searched_forums');

  // Archetype 1: The Accidental Adult (High Resolve, 4+ Decisive actions)
  if (stats.resolve >= 50 && decisiveCount >= 4) {
    return SYLLABUS_ENDINGS.accidental_adult;
  }

  // Archetype 4: The Unreasonable Success (Chaotic, bluffing, bold shortcuts)
  if (isChaoticBluffer && !isPureCatastrophizer) {
    return SYLLABUS_ENDINGS.unreasonable_success;
  }

  // Archetype 3: The Eternal Preparation (Dedicated schedule/planning/time-lost behavior)
  if (isHeavyPreparer && stats.timeLostMinutes >= 45 && !isPureCatastrophizer) {
    return SYLLABUS_ENDINGS.eternal_preparation;
  }

  // Archetype 2: The Supreme Catastrophizer (Surging Doom / Extreme Panic Spiral)
  if (isPureCatastrophizer || stats.doom >= 55 || stats.overthinking >= 85) {
    return SYLLABUS_ENDINGS.supreme_catastrophizer;
  }

  // Fallbacks
  if (isHeavyPreparer) {
    return SYLLABUS_ENDINGS.eternal_preparation;
  }
  if (isChaoticBluffer || stats.resolve >= 35) {
    return SYLLABUS_ENDINGS.unreasonable_success;
  }

  // Fallback default
  return SYLLABUS_ENDINGS.accidental_adult;
}

export function calculateSyllabusFinalStats(state: DeepQuestState): GameStats {
  const { stats, decisionHistory, makeWorseClicks, inventory } = state;

  const rationalDecisions = decisionHistory.filter(
    (d) => d.choiceType === 'DECISIVE'
  ).length;

  const itemsUsedCount = inventory.filter((i) => i.used).length;

  const confidence = Math.max(
    -50,
    Math.min(95, Math.round(stats.resolve - stats.doom * 0.4 - stats.overthinking * 0.3))
  );

  const realityDistortion = Math.min(
    99,
    Math.max(10, Math.round(stats.overthinking * 0.6 + stats.doom * 0.4 + makeWorseClicks * 8))
  );

  const productivity = Math.max(
    5,
    Math.min(
      95,
      Math.round(
        (stats.resolve * 1.5) /
          Math.max(1, 1 + stats.timeLostMinutes / 20 + makeWorseClicks * 0.5)
      )
    )
  );

  const ending = state.evaluatedEnding || evaluateEnding(state);

  return {
    timeWastedMinutes: Math.round(stats.timeLostMinutes),
    overthinkingPercentage: Math.round(stats.overthinking),
    doomPercentage: Math.round(stats.doom),
    resolvePercentage: Math.round(stats.resolve),
    decisionsMade: decisionHistory.length + (state.bossPhaseIndex + 1),
    rationalDecisions,
    unnecessaryComplications: makeWorseClicks * 2 + Math.round(stats.overthinking / 15),
    confidencePercent: confidence,
    realityDistortionPercent: realityDistortion,
    productivityPercent: productivity,
    itemsUsedCount,
    endingArchetype: ending.archetype,
  };
}

export function getUnlockedAchievementsList(unlockedIds: Set<string>): Achievement[] {
  return SYLLABUS_ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id));
}
