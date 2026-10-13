export type ProblemCategory =
  | 'academic'
  | 'email'
  | 'messaging'
  | 'cleaning'
  | 'sleep'
  | 'calling'
  | 'decision'
  | 'general'
  | 'nonsense';

export interface StatBlock {
  overthinking: number; // 0 - 150+ %
  doom: number;         // 0 - 100 %
  resolve: number;      // 0 - 100 %
  timeLostMinutes: number; // Fictional minutes lost
}

export interface Boss {
  id: string;
  name: string;
  icon: string;
  hp: number | string;
  description: string;
  abilities?: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number | string;
  icon: string;
  statBuff: string;
  statDebuff?: string;
  flavor: string;
  usable?: boolean;
  used?: boolean;
  effectDescription?: string;
  statDeltas?: Partial<StatBlock>;
}

export interface Choice {
  id: string;
  icon: string;
  type: 'ATTACK' | 'DEFEND' | 'ESCAPE' | 'ULTIMATE' | 'CHAOTIC' | 'DECISIVE' | 'PREPARE';
  title: string;
  subtitle: string;
  description: string;
  overthinkingDelta?: number;
  rationality?: 'rational' | 'overthink' | 'procrastinate' | 'absurd';
  absurdityDelta?: number;
  consequence: string;
  unlockedAchievementId?: string;
  // Extended branching fields
  nextSceneId?: string;
  statDeltas?: Partial<StatBlock>;
  condition?: {
    minResolve?: number;
    maxDoom?: number;
    minOverthinking?: number;
    requiresItem?: string;
    requiresFlag?: string;
  };
  conditionExplanation?: string;
  itemReward?: InventoryItem;
  consumeItem?: string;
  setFlags?: string[];
}

export interface Stage {
  stageNumber: number;
  title: string;
  scenario: string;
  dilemma: string;
  choices: Choice[];
}

export interface SceneChoice extends Choice {
  statDeltas: Partial<StatBlock>;
  nextSceneId: string;
}

export interface Scene {
  id: string;
  act: 1 | 2 | 3;
  actTitle: string;
  stageNumber: number;
  title: string;
  location: string;
  scenario: string;
  dilemma: string;
  narratorObservation?: string;
  choices: SceneChoice[];
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  overthinkingDelta: number;
  statDeltas?: Partial<StatBlock>;
  flavor?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  unlockedAt?: number;
}

export interface FinalBoss extends Boss {
  attackName: string;
  actionButtonLabel: string;
  abilities: string[];
  victoryPunchline: string;
  actualTaskTime: string;
  overthinkingTime: string;
}

export interface BossPlayerAction {
  id: string;
  title: string;
  icon: string;
  description: string;
  damage: number;
  resolveCost?: number;
  statDeltas?: Partial<StatBlock>;
  condition?: {
    minResolve?: number;
    requiresItem?: string;
    requiresFlag?: string;
  };
  conditionExplanation?: string;
  bossReaction: string;
  playerFeedback: string;
}

export interface BossPhase {
  phaseNumber: 1 | 2 | 3;
  phaseName: string;
  subtitle: string;
  bossMaxHp: number;
  bossDialogue: string;
  bossAttackName: string;
  bossAttackDescription: string;
  bossAbilities: string[];
  actions: BossPlayerAction[];
}

export interface SyllabusBossData {
  id: string;
  name: string;
  title: string;
  icon: string;
  description: string;
  phases: BossPhase[];
}

export type EndingArchetype =
  | 'accidental_adult'
  | 'supreme_catastrophizer'
  | 'eternal_preparation'
  | 'unreasonable_success';

export interface EndingDefinition {
  id: string;
  archetype: EndingArchetype;
  archetypeTitle: string;
  title: string;
  badge: string;
  icon: string;
  summary: string;
  narrative: string;
  realityCheckMundaneTask: string;
  realityCheckVerdict: string;
  whyThisHappened: string;
}

export interface Quest {
  id: string;
  category: ProblemCategory;
  originalProblem: string;
  title: string;
  subtitle: string;
  objective: string;
  difficultyStars: number;
  recommendedLevel: number;
  estimatedSurvivalTime: string;
  bosses: Boss[];
  inventory: InventoryItem[];
  stages: Stage[];
  finalBoss: FinalBoss;
  makeWorsePool: string[];
  // Deep quest features
  isDeepQuest?: boolean;
  startSceneId?: string;
}

export interface DecisionLog {
  stageIndex: number;
  stageTitle: string;
  choiceTitle: string;
  choiceType: string;
  consequence: string;
  overthinkingDelta: number;
  statDeltas?: Partial<StatBlock>;
  act?: number;
}

export interface GameStats {
  timeWastedMinutes: number;
  overthinkingPercentage: number;
  doomPercentage: number;
  resolvePercentage: number;
  decisionsMade: number;
  rationalDecisions: number;
  unnecessaryComplications: number;
  confidencePercent: number;
  realityDistortionPercent: number;
  productivityPercent: number;
  itemsUsedCount: number;
  endingArchetype?: EndingArchetype;
}
