import type { ProblemCategory, Quest, Stage } from '../types/game';
import { TEMPLATES, RANDOM_EVENTS } from './questTemplates';
import {
  SYLLABUS_ITEMS,
  SYLLABUS_MAKE_WORSE_POOL,
  SYLLABUS_RANDOM_EVENTS,
  SYLLABUS_SCENES,
} from './syllabusQuestData';

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

  // Email keywords (check before general academic so email to prof is categorized as email)
  if (/\b(email|inbox|mail|subject line|draft)\b/i.test(text)) {
    return 'email';
  }

  // Messaging / Social keywords
  if (
    /\b(reply|text|message|chat|dm|whatsapp|friend|seen|double text)\b/i.test(text) ||
    text.includes('talk to')
  ) {
    return 'messaging';
  }

  // Calling keywords (use word boundaries so 'staring' does not match 'ring')
  if (/\b(call|calling|phone|dial|dialing|ring|ringing|doctor|appointment|voicemail)\b/i.test(text)) {
    return 'calling';
  }

  // Cleaning / Chores keywords
  if (/\b(clean|cleaning|room|dishes|laundry|clothes|trash|tidy|sweep|vacuum|chore)\b/i.test(text)) {
    return 'cleaning';
  }

  // Sleep / Health keywords
  if (/\b(sleep|sleeping|bed|nap|tired|rest|wake|insomnia|exercise|workout|gym)\b/i.test(text)) {
    return 'sleep';
  }

  // Academic / Study keywords
  if (
    /\b(study|studying|exam|test|assignment|homework|quiz|syllabus|course|lecture|paper|thesis|read|reading)\b/i.test(text) ||
    text.includes('project due')
  ) {
    return 'academic';
  }

  // Decision keywords
  if (
    /\b(decide|decision|choose|choice|pick|option|options|between|buy|purchase|job|career)\b/i.test(text) ||
    text.includes("don't know what to do")
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

export function getSyllabusStages(): Stage[] {
  const canonicalSceneIds = [
    'act1_spark',
    'act1_first_page',
    'act1_desk_ritual',
    'act2_ancient_notes',
    'act2_video_rabbit_hole',
    'act2_cursed_notification',
    'act2_pomodoro_paradox',
    'act2_bureaucratic_wall',
  ];

  return canonicalSceneIds.map((id, idx) => {
    const sc = SYLLABUS_SCENES[id];
    return {
      stageNumber: idx + 1,
      title: sc ? sc.title : `STAGE ${idx + 1}: Academic Threshold`,
      scenario: sc ? sc.scenario : '',
      dilemma: sc ? sc.dilemma : '',
      choices: sc
        ? sc.choices.map((c) => ({
            ...c,
            overthinkingDelta: c.statDeltas?.overthinking ?? c.overthinkingDelta ?? 15,
            rationality: c.type === 'DECISIVE' ? ('rational' as const) : c.type === 'PREPARE' ? ('overthink' as const) : ('absurd' as const),
            absurdityDelta: c.statDeltas?.doom ?? 10,
          }))
        : [],
    };
  });
}

export function createUnfinishedSyllabusQuest(customProblem?: string): Quest {
  const problem = customProblem || 'The Unfinished Syllabus';

  return {
    id: `quest_syllabus_${Date.now()}`,
    category: 'academic',
    originalProblem: problem,
    title: 'THE UNFINISHED SYLLABUS',
    subtitle: 'A simple academic task becomes an unnecessarily epic campaign of procrastination, catastrophic imagination, questionable preparation, and a ridiculous final confrontation.',
    objective: 'Navigate the 3 Acts of academic dread, survive the spiral, and defeat the Guardian before morning.',
    difficultyStars: 5,
    recommendedLevel: 55,
    estimatedSurvivalTime: 'Until 11:59 PM (or sunrise)',
    bosses: [
      { id: 'b_past_self', name: '👴 The Ghost of Past You', icon: '👴', hp: 120, description: 'Took incomprehensible notes 8 weeks ago.' },
      { id: 'b_group_chat', name: '📱 The Panic Group Chat', icon: '📱', hp: 200, description: 'Spreads unverified rumors about footnote 14.' },
      { id: 'b_pomodoro', name: '⏳ The Screaming Silence', icon: '⏳', hp: 150, description: 'Minute 14 of focused study where quiet sounds like doom.' },
      { id: 'b_guardian', name: '📚 Guardian of the Syllabus', icon: '📚', hp: '300 (3 Phases)', description: 'Sentinel of Untouched Chapters & Warden of Deadlines.' },
    ],
    inventory: SYLLABUS_ITEMS,
    stages: getSyllabusStages(),
    finalBoss: {
      id: 'fb_guardian',
      name: 'THE GUARDIAN OF THE UNFINISHED SYLLABUS',
      icon: '📚',
      hp: '300 (3 PHASES)',
      description: 'Sentinel of Untouched Chapters & Warden of Deadlines.',
      attackName: 'Deadline Singularity',
      actionButtonLabel: 'ENGAGE THE GUARDIAN ⚔️',
      abilities: [
        'Unopened PDF Barrage',
        'Timetable Inversion',
        'Submission Portal 504 Timeout',
      ],
      victoryPunchline: 'You actually passed. The universe is deeply confused.',
      actualTaskTime: '45 mins reading',
      overthinkingTime: '4 hours 20 mins',
    },
    makeWorsePool: SYLLABUS_MAKE_WORSE_POOL,
    isDeepQuest: true,
    startSceneId: 'act1_spark',
  };
}

// Generate an extended 7-stage sequence tailored to the player's specific problem
function generateAdaptedStages(problem: string, category: ProblemCategory): Stage[] {
  const template = TEMPLATES[category] || TEMPLATES.general;
  const baseStages = template.stages;

  const rawStage1 = baseStages[0] || TEMPLATES.general.stages[0];
  const rawStage2 = baseStages[1] || baseStages[0] || TEMPLATES.general.stages[1];
  const rawStage3 = baseStages[2] || baseStages[1] || baseStages[0] || TEMPLATES.general.stages[2];

  // Stages 1 to 3 from base template, personalized with the user's problem
  const stage1: Stage = {
    ...rawStage1,
    stageNumber: 1,
    scenario: `${rawStage1.scenario} Your task: "${problem}". Your brain begins calculating unnecessary complications.`,
    dilemma: `How do you initiate the first maneuver against "${problem}"?`,
    choices: shuffleArray(rawStage1.choices),
  };

  const stage2: Stage = {
    ...rawStage2,
    stageNumber: 2,
    scenario: `${rawStage2.scenario} The reality of "${problem}" lingers in the background.`,
    choices: shuffleArray(rawStage2.choices),
  };

  const stage3: Stage = {
    ...rawStage3,
    stageNumber: 3,
    scenario: rawStage3.scenario,
    choices: shuffleArray(rawStage3.choices),
  };

  // Stage 4: External Scrutiny & Social Anxiety
  const stage4: Stage = {
    stageNumber: 4,
    title: 'STAGE 4: The Threat of Outside Judgment',
    scenario: `Time has slipped past. You suddenly calculate what friends, colleagues, or authorities would think if they knew you spent hours agonising over: "${problem}".`,
    dilemma: `How do you shield your fragile dignity from imagined external judgment?`,
    choices: [
      {
        id: `g_c4_1_${Date.now()}`,
        icon: '⚔️',
        type: 'ATTACK',
        title: `Take a direct, unashamed step forward right now`,
        subtitle: 'Defiance of social perception.',
        description: `Refuse to feel embarrassed. Anyone would find "${problem}" daunting under the right cosmic alignment.`,
        overthinkingDelta: 10,
        rationality: 'rational',
        absurdityDelta: 6,
        consequence: `You regain your composure. The imagined jury in your skull dismisses the charges for lack of evidence.`,
        unlockedAchievementId: 'touch_grass',
      },
      {
        id: `g_c4_2_${Date.now()}`,
        icon: '🛡️',
        type: 'DEFEND',
        title: `Craft an elaborate justification for why you haven't finished yet`,
        subtitle: 'The PR spokesperson.',
        description: `Draft a 3-paragraph mental press release explaining that you were waiting for optimal thermodynamic conditions.`,
        overthinkingDelta: 24,
        rationality: 'overthink',
        absurdityDelta: 18,
        consequence: `Your excuse sounds so airtight that you almost believe it yourself. "${problem}" remains completely untouched.`,
      },
      {
        id: `g_c4_3_${Date.now()}`,
        icon: '🧙',
        type: 'ESCAPE',
        title: `Turn on Do Not Disturb and disappear from civilization`,
        subtitle: 'Tactical digital hermitage.',
        description: `If your phone is on silent and the curtains are drawn, the universe cannot hold you accountable.`,
        overthinkingDelta: 36,
        rationality: 'procrastinate',
        absurdityDelta: 25,
        consequence: `Total silence descends. You feel safe, yet oddly like a wanted fugitive in your own living room.`,
        unlockedAchievementId: 'tomorrow_tm',
      },
      {
        id: `g_c4_4_${Date.now()}`,
        icon: '💀',
        type: 'CHAOTIC',
        title: `Post a cryptic story on social media about "the struggles of mortal existence"`,
        subtitle: 'Outsourcing the angst.',
        description: `Drop a black screen with white text to see who takes the bait and offers unconditional emotional support.`,
        overthinkingDelta: 48,
        rationality: 'absurd',
        absurdityDelta: 45,
        consequence: `Three friends reply asking if you are okay. Now you have to explain "${problem}" to three separate people.`,
      },
    ],
  };

  // Stage 5: The Energy Depletion & Bargaining
  const stage5: Stage = {
    stageNumber: 5,
    title: 'STAGE 5: The Biological Resistance',
    scenario: `Your nervous system begins flashing low battery. You have expended 400 calories solely on mental hesitation regarding: "${problem}".`,
    dilemma: `Do you power through the exhaustion or surrender to nutritional procrastination?`,
    choices: [
      {
        id: `g_c5_1_${Date.now()}`,
        icon: '⚔️',
        type: 'ATTACK',
        title: `Drink a glass of water and refuse to surrender to fatigue`,
        subtitle: 'The stoic hydration maneuver.',
        description: `Gulp cold tap water. Force alertness back into your tired vessels.`,
        overthinkingDelta: 12,
        rationality: 'rational',
        absurdityDelta: 8,
        consequence: `Hydration sharpens your focus. You stand tall against the creeping fog of procrastination.`,
      },
      {
        id: `g_c5_2_${Date.now()}`,
        icon: '☕',
        type: 'DEFEND',
        title: `Embark on an expedition to the kitchen for snacks`,
        subtitle: 'The dopamine replenishment raid.',
        description: `Inspect the refrigerator shelves three consecutive times, hoping new snacks have spawned since two minutes ago.`,
        overthinkingDelta: 26,
        rationality: 'overthink',
        absurdityDelta: 20,
        consequence: `You find a slice of cheese. It provides 4 minutes of comfort and zero progress on "${problem}".`,
      },
      {
        id: `g_c5_3_${Date.now()}`,
        icon: '🧙',
        type: 'ESCAPE',
        title: `Promise yourself that you will wake up at 5:00 AM and do it effortlessly`,
        subtitle: 'The ancient dawn fantasy.',
        description: `Convince yourself that tomorrow-you will possess superhuman stamina, infinite discipline, and zero flaws.`,
        overthinkingDelta: 42,
        rationality: 'procrastinate',
        absurdityDelta: 32,
        consequence: `You both know this is a fairy tale, but the immediate relief feels intoxicating.`,
        unlockedAchievementId: 'tomorrow_tm',
      },
      {
        id: `g_c5_4_${Date.now()}`,
        icon: '💀',
        type: 'ULTIMATE',
        title: `Declare that sleep deprivation makes you a transcendent visionary`,
        subtitle: 'Delusional cognitive overdrive.',
        description: `Claim that your third eye has opened and that "${problem}" is actually a blessing in disguise.`,
        overthinkingDelta: 56,
        rationality: 'absurd',
        absurdityDelta: 55,
        consequence: `You see vibrating geometric patterns in the wallpaper. Wisdom? Probably not.`,
        unlockedAchievementId: 'cosmic_brain',
      },
    ],
  };

  // Stage 6: The False Breakthrough Shortcut
  const stage6: Stage = {
    stageNumber: 6,
    title: 'STAGE 6: The Mirage of the "Genius Shortcut"',
    scenario: `Suddenly, your brain conjures a wild revelation: what if you don't need to do "${problem}" the normal way at all? What if there is a bizarre loophole?`,
    dilemma: `Do you trust this sudden 2:00 AM eureka moment or stick to conventional execution?`,
    choices: [
      {
        id: `g_c6_1_${Date.now()}`,
        icon: '⚔️',
        type: 'ATTACK',
        title: `Discard the crazy shortcut and execute the standard, boring method`,
        subtitle: 'Boring competence triumphs.',
        description: `Recognize the loophole as a siren song designed to lead you onto the rocks of disaster.`,
        overthinkingDelta: 14,
        rationality: 'rational',
        absurdityDelta: 8,
        consequence: `You stick to the basics. It isn't glamorous, but it is undeniably effective.`,
      },
      {
        id: `g_c6_2_${Date.now()}`,
        icon: '🛡️',
        type: 'DEFEND',
        title: `Spend 25 minutes researching whether the shortcut is legally or socially viable`,
        subtitle: 'Due diligence on madness.',
        description: `Open 8 Reddit tabs from 2016 to investigate whether anyone else tried this exact bizarre trick.`,
        overthinkingDelta: 30,
        rationality: 'overthink',
        absurdityDelta: 24,
        consequence: `Forum consensus: "Do not do this, it ruined my life." You reluctantly close the tabs.`,
      },
      {
        id: `g_c6_3_${Date.now()}`,
        icon: '🌀',
        type: 'CHAOTIC',
        title: `Commit fully to the unhinged shortcut and let the universe deal with the fallout`,
        subtitle: 'The reckless gambler.',
        description: `Double down on the eccentric maneuver. Fortune favors the absurd!`,
        overthinkingDelta: 45,
        rationality: 'absurd',
        absurdityDelta: 60,
        consequence: `The maneuver produces a surreal chain reaction. You are now in uncharted psychological territory.`,
      },
    ],
  };

  // Stage 7: The Final Threshold Before Climax
  const stage7: Stage = {
    stageNumber: 7,
    title: 'STAGE 7: The Final Stand of Resistance',
    scenario: `All excuses have expired. All distractions have grown stale. Standing directly between you and total liberation is the final threshold of: "${problem}".`,
    dilemma: `Will you take the decisive final stride or succumb to a last-second panic loop?`,
    choices: [
      {
        id: `g_c7_1_${Date.now()}`,
        icon: '⚔️',
        type: 'DECISIVE',
        title: `Confront the problem head-on without flinching`,
        subtitle: 'The hero emerges.',
        description: `Take a deep breath. Stare down "${problem}". Advance into the climax!`,
        overthinkingDelta: 15,
        rationality: 'rational',
        absurdityDelta: 10,
        consequence: `Your hands steady. The hesitation breaks. The final boss of your overthinking appears!`,
        unlockedAchievementId: 'touch_grass',
      },
      {
        id: `g_c7_2_${Date.now()}`,
        icon: '🛡️',
        type: 'PREPARE',
        title: `Take one final 60-second deep breathing reset`,
        subtitle: 'Oxygenating the soul.',
        description: `Inhale for 4 seconds, hold for 4 seconds, exhale all lingering dread.`,
        overthinkingDelta: 20,
        rationality: 'overthink',
        absurdityDelta: 15,
        consequence: `Your lungs fill with calm air. You are centered, focused, and prepared for battle.`,
      },
      {
        id: `g_c7_3_${Date.now()}`,
        icon: '💀',
        type: 'ULTIMATE',
        title: `Scream silently into a throw pillow and charge into destiny`,
        subtitle: 'Cathartic battle cry.',
        description: `Muffle the primal scream of a modern mortal confronting minor inconvenience.`,
        overthinkingDelta: 35,
        rationality: 'absurd',
        absurdityDelta: 40,
        consequence: `The pillow absorbs your angst. You arise transformed, unhinged, and ready for victory.`,
      },
    ],
  };

  return [stage1, stage2, stage3, stage4, stage5, stage6, stage7];
}

export function generateQuest(problemInput: string): Quest {
  const cleanInput = problemInput.trim();
  const lower = cleanInput.toLowerCase();

  // If explicitly the authored syllabus campaign, route to "The Unfinished Syllabus"
  if (
    lower === 'the unfinished syllabus' ||
    lower.includes('unfinished syllabus') ||
    lower === 'the syllabus'
  ) {
    return createUnfinishedSyllabusQuest(cleanInput);
  }

  const category = detectCategory(cleanInput);
  const template = TEMPLATES[category] || TEMPLATES.general;

  // Dynamic titles and subtitles
  const title = getRandomItem(template.titles);
  const subtitle = getRandomItem(template.subtitles);
  const objective = `Conquer "${cleanInput}" without suffering a complete psychological collapse.`;
  const recommendedLevel = getRandomItem(template.recommendedLevels);
  const estimatedSurvivalTime = getRandomItem(template.survivalTimes);

  // Difficulty is delightfully absurd: tiny tasks get 4 or 5 stars!
  const difficultyStars = Math.min(5, Math.max(3, 5 - Math.floor(Math.random() * 2)));

  // Bosses selection
  const bosses = shuffleArray(template.bossPool).slice(0, 4);

  // Inventory selection
  const inventory = shuffleArray(template.inventoryPool).slice(0, 4);

  // Generate extended 7-stage sequence tailored to the problem
  const stages = generateAdaptedStages(cleanInput, category);

  // Final Boss adaptation
  const finalBoss = {
    ...template.finalBoss,
    description: `The sentient physical manifestation of postponing: "${cleanInput}".`,
    victoryPunchline: `YOU CONQUERED "${cleanInput}"! The universe is stunned that you survived.`,
  };

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
    finalBoss,
    makeWorsePool: [...template.makeWorsePool],
    isDeepQuest: false,
  };
}

export function getRandomEvent(isSyllabusQuest = false) {
  if (isSyllabusQuest) {
    return getRandomItem(SYLLABUS_RANDOM_EVENTS);
  }
  return getRandomItem(RANDOM_EVENTS);
}
