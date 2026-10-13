import { useState } from 'react';
import type { Quest, Choice, SceneChoice, GameEvent, GameStats, DecisionLog, InventoryItem } from './types/game';
import { generateQuest, getRandomEvent } from './engine/questGenerator';
import { ACHIEVEMENTS_LIST } from './engine/questTemplates';
import { SYLLABUS_SCENES } from './engine/syllabusQuestData';
import {
  createInitialSyllabusState,
  executeSceneChoice,
  applyInventoryItem,
  calculateSyllabusFinalStats,
  getUnlockedAchievementsList,
  type DeepQuestState,
} from './engine/questEngine';
import { sound } from './engine/sound';

import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { OverthinkingMeter } from './components/OverthinkingMeter';
import { QuestOverview } from './components/QuestOverview';
import { StageEncounter } from './components/StageEncounter';
import { FinalBossBattle } from './components/FinalBossBattle';
import { QuestResult } from './components/QuestResult';
import { InventoryDrawer } from './components/InventoryDrawer';

type ScreenState = 'home' | 'quest_intro' | 'stage' | 'final_boss' | 'victory';

export function App() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [quest, setQuest] = useState<Quest | null>(null);
  const [deepQuestState, setDeepQuestState] = useState<DeepQuestState | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [overthinking, setOverthinking] = useState(15);
  const [absurdity, setAbsurdity] = useState(0);
  const [makeWorseClicks, setMakeWorseClicks] = useState(0);
  const [activeComplications, setActiveComplications] = useState<string[]>([]);
  const [randomEvent, setRandomEvent] = useState<GameEvent | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<Set<string>>(new Set());
  const [soundMuted, setSoundMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [demoInput, setDemoInput] = useState('');

  // Sound toggle
  const handleToggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
  };

  // Reduced motion toggle
  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  // Start new quest
  const handleStartQuest = (problemText: string) => {
    const newQuest = generateQuest(problemText);
    setQuest(newQuest);
    setCurrentStageIdx(0);
    setAbsurdity(0);
    setMakeWorseClicks(0);
    setActiveComplications([]);
    setRandomEvent(null);
    setDecisionLogs([]);
    setUnlockedAchievementIds(new Set());

    if (newQuest.isDeepQuest) {
      const initialState = createInitialSyllabusState();
      setDeepQuestState(initialState);
      setOverthinking(initialState.stats.overthinking);
    } else {
      setDeepQuestState(null);
      setOverthinking(10);
    }

    setScreen('quest_intro');
  };

  // Demo mode trigger
  const handleDemoMode = () => {
    setDemoInput('I need to email my professor.');
    handleStartQuest('I need to email my professor.');
  };

  // Reset to Home
  const handleResetToHome = () => {
    setScreen('home');
    setQuest(null);
    setDeepQuestState(null);
    setDemoInput('');
  };

  // Advance from Intro to Stage 1
  const handleBeginStage = () => {
    setScreen('stage');
  };

  // Active Scene for Deep Quest
  const currentScene = deepQuestState
    ? (SYLLABUS_SCENES[deepQuestState.currentSceneId] || SYLLABUS_SCENES['act1_spark'])
    : undefined;

  // Handle choice selection in stage
  const handleSelectChoice = (choice: Choice | SceneChoice) => {
    if (!quest) return;

    // 1. DEEP QUEST PATH ("The Unfinished Syllabus")
    if (quest.isDeepQuest && deepQuestState && currentScene) {
      const result = executeSceneChoice(currentScene, choice as SceneChoice, deepQuestState);
      setDeepQuestState(result.nextState);
      setOverthinking(result.nextState.stats.overthinking);
      setDecisionLogs(result.nextState.decisionHistory);
      setUnlockedAchievementIds(result.nextState.unlockedAchievementIds);

      // Sound feedback
      sound.playMeterUp();

      // Check random event chance
      if (Math.random() < 0.4 && !randomEvent && !result.reachedBoss) {
        const ev = getRandomEvent(true);
        setRandomEvent(ev);
        sound.playEvent();
      } else {
        setRandomEvent(null);
      }

      if (result.reachedBoss) {
        sound.playBossAppear();
        setScreen('final_boss');
      }
      return;
    }

    // 2. LEGACY QUEST PATH
    const currentStage = quest.stages[currentStageIdx] || quest.stages[0];
    const delta = choice.statDeltas?.overthinking ?? choice.overthinkingDelta ?? 0;
    const newOverthinking = Math.min(180, overthinking + delta);
    const newAbsurdity = absurdity + (choice.absurdityDelta || 0);

    setOverthinking(newOverthinking);
    setAbsurdity(newAbsurdity);

    // Log decision
    const newLogs: DecisionLog[] = [
      ...decisionLogs,
      {
        stageIndex: currentStageIdx + 1,
        stageTitle: currentStage?.title || 'Unknown Stage',
        choiceTitle: choice.title,
        choiceType: choice.type,
        consequence: choice.consequence,
        overthinkingDelta: delta,
      },
    ];
    setDecisionLogs(newLogs);

    // Track achievement unlocks
    const updatedAchievements = new Set(unlockedAchievementIds);
    if (choice.unlockedAchievementId) {
      updatedAchievements.add(choice.unlockedAchievementId);
    }
    if (newOverthinking >= 100) {
      updatedAchievements.add('prof_overthinker');
    }
    if (choice.rationality === 'rational') {
      updatedAchievements.add('touch_grass');
    }
    if (choice.type === 'ESCAPE') {
      updatedAchievements.add('tomorrow_tm');
    }
    if (choice.type === 'ULTIMATE' && choice.title.toLowerCase().includes('friend')) {
      updatedAchievements.add('outsourced_problem');
    }
    setUnlockedAchievementIds(updatedAchievements);

    // Sound feedback
    sound.playMeterUp();

    // Check if random event should trigger
    if (currentStageIdx < quest.stages.length - 1 && Math.random() < 0.45 && !randomEvent) {
      const ev = getRandomEvent(false);
      setRandomEvent(ev);
      setOverthinking((prev) => Math.max(0, Math.min(180, prev + ev.overthinkingDelta)));
      sound.playEvent();
    } else {
      setRandomEvent(null);
    }

    // Advance stage or go to final boss
    if (currentStageIdx + 1 < quest.stages.length) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      sound.playBossAppear();
      setScreen('final_boss');
    }
  };

  // Handle "MAKE IT WORSE" button
  const handleMakeItWorse = () => {
    if (!quest) return;

    if (quest.isDeepQuest && deepQuestState) {
      const newClicks = deepQuestState.makeWorseClicks + 1;
      const compIdx = (newClicks - 1) % quest.makeWorsePool.length;
      const complication = quest.makeWorsePool[compIdx];
      const newComps = [complication, ...deepQuestState.activeComplications.slice(0, 3)];

      const nextStats = {
        ...deepQuestState.stats,
        overthinking: Math.min(180, deepQuestState.stats.overthinking + 16),
        doom: Math.min(100, deepQuestState.stats.doom + 14),
        timeLostMinutes: deepQuestState.stats.timeLostMinutes + 12,
      };

      const updatedAch = new Set(deepQuestState.unlockedAchievementIds);
      if (newClicks >= 3) {
        updatedAch.add('escalation_architect');
      }

      setDeepQuestState({
        ...deepQuestState,
        makeWorseClicks: newClicks,
        activeComplications: newComps,
        stats: nextStats,
        unlockedAchievementIds: updatedAch,
      });
      setOverthinking(nextStats.overthinking);
      return;
    }

    // Legacy Make It Worse
    const newClicks = makeWorseClicks + 1;
    setMakeWorseClicks(newClicks);

    const compIdx = (newClicks - 1) % quest.makeWorsePool.length;
    const complication = quest.makeWorsePool[compIdx];
    setActiveComplications((prev) => [complication, ...prev.slice(0, 3)]);

    const newOverthinking = Math.min(180, overthinking + 16);
    setOverthinking(newOverthinking);
    setAbsurdity((prev) => prev + 25);

    const updatedAchievements = new Set(unlockedAchievementIds);
    if (newClicks >= 3) {
      updatedAchievements.add('make_it_worse_champ');
    }
    if (newOverthinking >= 100) {
      updatedAchievements.add('prof_overthinker');
    }
    setUnlockedAchievementIds(updatedAchievements);
  };

  // Handle using item from inventory satchel
  const handleUseItem = (item: InventoryItem) => {
    if (quest?.isDeepQuest && deepQuestState) {
      const next = applyInventoryItem(item, deepQuestState);
      setDeepQuestState(next);
      setOverthinking(next.stats.overthinking);
    }
  };

  // Handle Final Boss Defeated
  const handleDefeatBoss = () => {
    const updatedAchievements = new Set(unlockedAchievementIds);
    updatedAchievements.add('main_character');
    updatedAchievements.add('could_have_done_it');
    updatedAchievements.add('syllabus_slayer');
    setUnlockedAchievementIds(updatedAchievements);
    setScreen('victory');
  };

  // Calculate final statistics for legacy runs
  const calculateFinalStats = (): GameStats => {
    const rationalDecisions = decisionLogs.filter((d) =>
      d.choiceTitle.toLowerCase().includes('just') ||
      d.choiceTitle.toLowerCase().includes('write "dear') ||
      d.choiceTitle.toLowerCase().includes('open page') ||
      d.choiceTitle.toLowerCase().includes('reply right now') ||
      d.choiceTitle.toLowerCase().includes('pick up 1') ||
      d.choiceTitle.toLowerCase().includes('plug phone in') ||
      d.choiceTitle.toLowerCase().includes('dial immediately') ||
      d.choiceTitle.toLowerCase().includes('pick option a')
    ).length;

    const baseMinutes = 24 + decisionLogs.length * 7 + makeWorseClicks * 6;
    const timeWastedMinutes = Math.min(120, Math.max(15, baseMinutes));
    const realityDistortion = Math.min(99, Math.max(25, 40 + absurdity / 3 + makeWorseClicks * 12));
    const confidence = Math.max(-45, Math.min(30, 20 - overthinking / 3));
    const productivity = Math.max(4, Math.min(25, Math.round(100 / (decisionLogs.length + makeWorseClicks + 3))));

    return {
      timeWastedMinutes: Math.round(timeWastedMinutes),
      overthinkingPercentage: Math.round(overthinking),
      doomPercentage: Math.round(overthinking * 0.7),
      resolvePercentage: Math.max(10, Math.round(confidence + 30)),
      decisionsMade: decisionLogs.length + 1,
      rationalDecisions,
      unnecessaryComplications: makeWorseClicks * 2 + decisionLogs.length * 3 + activeComplications.length,
      confidencePercent: Math.round(confidence),
      realityDistortionPercent: Math.round(realityDistortion),
      productivityPercent: productivity,
      itemsUsedCount: 0,
    };
  };

  const unlockedAchievementsList = ACHIEVEMENTS_LIST.filter((a) =>
    unlockedAchievementIds.has(a.id)
  );

  return (
    <div
      className={reducedMotion ? 'reduced-motion' : ''}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top Navbar */}
      <Navbar
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onDemoMode={handleDemoMode}
        onReset={handleResetToHome}
        isGameActive={screen !== 'home'}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.5rem 0 3rem' }}>
        <div className="container">
          {/* HOME SCREEN */}
          {screen === 'home' && (
            <HomeHero
              onStartQuest={handleStartQuest}
              initialValue={demoInput}
            />
          )}

          {/* QUEST INTRO SCREEN */}
          {screen === 'quest_intro' && quest && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <OverthinkingMeter
                percentage={overthinking}
                stats={quest.isDeepQuest ? deepQuestState?.stats : undefined}
              />
              <QuestOverview
                quest={quest}
                onBeginQuest={handleBeginStage}
                isCollapsible={false}
              />
            </div>
          )}

          {/* ACTIVE STAGE / SCENE SCREEN */}
          {screen === 'stage' && quest && (
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <OverthinkingMeter
                percentage={overthinking}
                stats={quest.isDeepQuest ? deepQuestState?.stats : undefined}
              />

              <QuestOverview
                quest={quest}
                isCollapsible={true}
              />

              {/* Functional Inventory Satchel for deep quests */}
              {quest.isDeepQuest && deepQuestState && (
                <InventoryDrawer
                  items={deepQuestState.inventory}
                  onUseItem={handleUseItem}
                />
              )}

              {/* Main Encounter (Scene or Stage) */}
              <StageEncounter
                scene={currentScene}
                stage={quest.stages[currentStageIdx] || quest.stages[0]}
                questState={deepQuestState || undefined}
                totalStages={quest.stages.length || 8}
                onSelectChoice={handleSelectChoice}
                onMakeItWorse={handleMakeItWorse}
                activeComplications={
                  quest.isDeepQuest && deepQuestState
                    ? deepQuestState.activeComplications
                    : activeComplications
                }
                randomEvent={randomEvent}
                onDismissEvent={() => setRandomEvent(null)}
              />
            </div>
          )}

          {/* FINAL BOSS SCREEN */}
          {screen === 'final_boss' && quest && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <OverthinkingMeter
                percentage={Math.max(100, overthinking)}
                stats={quest.isDeepQuest ? deepQuestState?.stats : undefined}
              />
              <FinalBossBattle
                boss={quest.finalBoss}
                isDeepQuest={quest.isDeepQuest}
                questState={deepQuestState || undefined}
                onUpdateState={(next) => {
                  setDeepQuestState(next);
                  setOverthinking(next.stats.overthinking);
                }}
                onDefeatBoss={handleDefeatBoss}
              />
            </div>
          )}

          {/* VICTORY / RESULTS SCREEN */}
          {screen === 'victory' && quest && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <QuestResult
                quest={quest}
                stats={
                  quest.isDeepQuest && deepQuestState
                    ? calculateSyllabusFinalStats(deepQuestState)
                    : calculateFinalStats()
                }
                achievements={
                  quest.isDeepQuest && deepQuestState
                    ? getUnlockedAchievementsList(deepQuestState.unlockedAchievementIds)
                    : unlockedAchievementsList
                }
                endingDefinition={deepQuestState?.evaluatedEnding}
                decisionLogs={deepQuestState?.decisionHistory || decisionLogs}
                onPlayAgain={handleResetToHome}
              />
            </div>
          )}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '1.25rem 0',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#64748b',
      }}>
        <div className="container">
          <span>🧠 OVERTHINKING RPG</span> &bull; <span>The Unfinished Syllabus Edition</span> &bull; <span>"You could have just done it."</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
