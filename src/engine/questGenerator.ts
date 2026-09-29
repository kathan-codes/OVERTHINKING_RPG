import type { ProblemCategory, Quest, Stage } from '../types/game';
import { TEMPLATES, RANDOM_EVENTS } from './questTemplates';

// Check if string is nonsense / keyboard mash
function isKeyboardMash(input: string): boolean {
  const clean = input.trim().toLowerCase();
  if (clean.length === 0) return false;
  // Obvious keyboard mashes
  if (/^[asdfghjkl;']+$/i.test(clean) || /^[qwertyuiop]+$/i.test(clean) || /^[zxcvbnm]+$/i.test(clean)) {
    return true;
  }
  // No spaces, length > 8, low vowel ratio (<15% vowels)
  if (clean.length > 8 && !clean.includes(' ')) {
    const vowels = (clean.match(/[aeiou]/g) || []).length;
    if (vowels / clean.length < 0.15) {
      return true;
    }
  }
  // Repeated sequence like "hahahaha", "asdasd", "aaaaaa"
  if (/^(.)\1{4,}$/.test(clean) || /^(..+)\1{3,}$/.test(clean)) {
    return true;
  }
  return false;
}

export function detectCategory(problem: string): ProblemCategory {
  const text = problem.toLowerCase().trim();

  if (isKeyboardMash(text)) {
    return 'nonsense';
  }

  // Email keywords
  if (
    text.includes('email') ||
    text.includes('prof') ||
    text.includes('inbox') ||
    text.includes('mail') ||
    text.includes('subject line') ||
    text.includes('draft')
  ) {
    return 'email';
  }

  // Academic / Study keywords
  if (
    text.includes('study') ||
    text.includes('exam') ||
    text.includes('assignment') ||
    text.includes('homework') ||
    text.includes('quiz') ||
    text.includes('syllabus') ||
    text.includes('course') ||
    text.includes('lecture') ||
    text.includes('paper') ||
    text.includes('thesis') ||
    text.includes('project due')
  ) {
    return 'academic';
  }

  // Messaging / Social keywords
  if (
    text.includes('reply') ||
    text.includes('text') ||
    text.includes('message') ||
    text.includes('chat') ||
    text.includes('dm') ||
    text.includes('whatsapp') ||
    text.includes('friend') ||
    text.includes('talk to') ||
    text.includes('seen') ||
    text.includes('double text')
  ) {
    return 'messaging';
  }

  // Cleaning / Chores keywords
  if (
    text.includes('clean') ||
    text.includes('room') ||
    text.includes('dishes') ||
    text.includes('laundry') ||
    text.includes('clothes') ||
    text.includes('trash') ||
    text.includes('tidy') ||
    text.includes('sweep') ||
    text.includes('vacuum') ||
    text.includes('bed') ||
    text.includes('chore')
  ) {
    return 'cleaning';
  }

  // Sleep / Health keywords
  if (
    text.includes('sleep') ||
    text.includes('bed') ||
    text.includes('nap') ||
    text.includes('tired') ||
    text.includes('rest') ||
    text.includes('wake') ||
    text.includes('insomnia') ||
    text.includes('exercise') ||
    text.includes('workout') ||
    text.includes('gym')
  ) {
    return 'sleep';
  }

  // Calling keywords
  if (
    text.includes('call') ||
    text.includes('phone') ||
    text.includes('dial') ||
    text.includes('ring') ||
    text.includes('doctor') ||
    text.includes('appointment') ||
    text.includes('voicemail')
  ) {
    return 'calling';
  }

  // Decision keywords
  if (
    text.includes('decide') ||
    text.includes('decision') ||
    text.includes('choose') ||
    text.includes('choice') ||
    text.includes('pick') ||
    text.includes('buy') ||
    text.includes('purchase') ||
    text.includes('job') ||
    text.includes('career') ||
    text.includes('don\'t know what to do')
  ) {
    return 'decision';
  }

  return 'general';
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateQuest(problemInput: string): Quest {
  const cleanInput = problemInput.trim();
  const category = detectCategory(cleanInput);
  const template = TEMPLATES[category];

  // Dynamic titles and subtitles
  const title = getRandomItem(template.titles);
  const subtitle = getRandomItem(template.subtitles);
  const objective = getRandomItem(template.objectives);
  const recommendedLevel = getRandomItem(template.recommendedLevels);
  const estimatedSurvivalTime = getRandomItem(template.survivalTimes);

  // Difficulty is delightfully absurd: tiny tasks get 4 or 5 stars!
  const difficultyStars = Math.min(5, Math.max(3, 5 - Math.floor(Math.random() * 2)));

  // Bosses selection
  const bosses = shuffleArray(template.bossPool).slice(0, 4);

  // Inventory selection
  const inventory = shuffleArray(template.inventoryPool).slice(0, 4);

  // Clone stages
  const stages: Stage[] = template.stages.map((stage, idx) => ({
    ...stage,
    stageNumber: idx + 1,
    choices: shuffleArray(stage.choices),
  }));

  return {
    id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category,
    originalProblem: cleanInput,
    title,
    subtitle,
    objective,
    difficultyStars,
    recommendedLevel,
    estimatedSurvivalTime,
    bosses,
    inventory,
    stages,
    finalBoss: { ...template.finalBoss },
    makeWorsePool: [...template.makeWorsePool],
  };
}

export function getRandomEvent() {
  return getRandomItem(RANDOM_EVENTS);
}
