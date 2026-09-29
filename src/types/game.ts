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
}

export interface Choice {
  id: string;
  icon: string;
  type: 'ATTACK' | 'DEFEND' | 'ESCAPE' | 'ULTIMATE' | 'CHAOTIC';
  title: string;
  subtitle: string;
  description: string;
  overthinkingDelta: number;
  rationality: 'rational' | 'overthink' | 'procrastinate' | 'absurd';
  absurdityDelta: number;
  consequence: string;
  unlockedAchievementId?: string;
}

export interface Stage {
  stageNumber: number;
  title: string;
  scenario: string;
  dilemma: string;
  choices: Choice[];
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  overthinkingDelta: number;
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
}

export interface DecisionLog {
  stageIndex: number;
  stageTitle: string;
  choiceTitle: string;
  choiceType: string;
  consequence: string;
  overthinkingDelta: number;
}

export interface GameStats {
  timeWastedMinutes: number;
  overthinkingPercentage: number;
  decisionsMade: number;
  rationalDecisions: number;
  unnecessaryComplications: number;
  confidencePercent: number;
  realityDistortionPercent: number;
  productivityPercent: number;
}
