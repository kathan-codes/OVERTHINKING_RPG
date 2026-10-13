import type {
  Scene,
  InventoryItem,
  GameEvent,
  SyllabusBossData,
  EndingDefinition,
  Achievement,
} from '../types/game';

// ==========================================
// INVENTORY ITEMS (Handcrafted with effects)
// ==========================================
export const SYLLABUS_ITEMS: InventoryItem[] = [
  {
    id: 'study_plan',
    name: 'The Study Plan of Infinite Preparation',
    count: '×1',
    icon: '📜',
    statBuff: '+35 False Security',
    statDebuff: '-40 Real Progress',
    flavor: 'A laminated 15-minute interval schedule that accounts for bathroom breaks, hydration pauses, and 7 minutes of stoic despair.',
    usable: true,
    used: false,
    effectDescription: 'Consult the schedule: Boosts Overthinking +15, but unlocks special bureaucratic counter against the Boss.',
    statDeltas: { overthinking: 15, resolve: 5, timeLostMinutes: 20 },
  },
  {
    id: 'potion_confidence',
    name: 'Potion of False Confidence',
    count: '×1',
    icon: '🧪',
    statBuff: '+30 Reckless Bravado',
    statDebuff: 'May backfire horribly',
    flavor: 'A glowing amber concoction made of pure denial and the conviction that "it\'s probably mostly common sense anyway."',
    usable: true,
    used: false,
    effectDescription: 'Drink deeply: Instantly grants +25 Resolve and reduces Doom by 15, enabling bold choices.',
    statDeltas: { resolve: 25, doom: -15, overthinking: -10 },
  },
  {
    id: 'helmet_ignorance',
    name: 'Helmet of Selective Ignorance',
    count: '×1',
    icon: '🪖',
    statBuff: '-25 Perceived Doom',
    statDebuff: 'Hides critical warnings',
    flavor: 'Heavy wrought-iron headgear that prevents you from seeing unread announcements, syllabus revisions, and grades from 2 weeks ago.',
    usable: true,
    used: false,
    effectDescription: 'Equip helmet: Slashes Doom by 20 and shields against notification panic.',
    statDeltas: { doom: -20, overthinking: -10 },
  },
  {
    id: 'scroll_doom',
    name: 'The Unopened Scroll of Doom',
    count: '×1',
    icon: '📜',
    statBuff: 'Reveals Worst-Case Future',
    statDebuff: '+25 Existential Dread',
    flavor: 'An ancient forum thread titled "Professor Henderson Midterm Survival Rate: 19% (Updated 2024)". Reading it is self-inflicted spiritual damage.',
    usable: true,
    used: false,
    effectDescription: 'Unroll scroll: Boosts Doom +20, but exposes the Guardian\'s final phase vulnerability.',
    statDeltas: { doom: 20, overthinking: 15 },
  },
  {
    id: 'highlighter_importance',
    name: 'Highlighter of False Importance',
    count: '×1',
    icon: '🖍️',
    statBuff: '+20 Visual Competence',
    statDebuff: 'Everything is neon yellow',
    flavor: 'By highlighting entire paragraphs indiscriminately, you transform incomprehensible jargon into brightly colored incomprehensible jargon.',
    usable: true,
    used: false,
    effectDescription: 'Highlight frantically: Increases Resolve +10 and reduces Overthinking by 10 through the illusion of activity.',
    statDeltas: { resolve: 10, overthinking: -10, timeLostMinutes: 10 },
  },
  {
    id: 'pomodoro_hourglass',
    name: 'The 25-Minute Pomodoro Hourglass (Cracked)',
    count: '×1',
    icon: '⏳',
    statBuff: '+15 Structured Sprint',
    statDebuff: 'Ticking sound triggers dread',
    flavor: 'Sand trickles downward with agonizing slowness. At minute 4, you find yourself staring at dust motes in the desk lamp beam.',
    usable: true,
    used: false,
    effectDescription: 'Flip the timer: Grants +15 Resolve and pushes Time Lost +25 fictional minutes.',
    statDeltas: { resolve: 15, timeLostMinutes: 25 },
  },
  {
    id: 'cursed_sticky_note',
    name: 'The Cursed Sticky Note',
    count: '×1',
    icon: '📝',
    statBuff: '+10 Urgency Spike',
    statDebuff: '+15 Paranoia',
    flavor: 'A neon-pink square scribbled at 2:00 AM three weeks ago reading simply: "REMEMBER THE LEMMA (IMPORTANT???)". You do not know which lemma.',
    usable: true,
    used: false,
    effectDescription: 'Inspect note: Increases Overthinking +15 and Doom +10, but provides a strange clue for Phase 2.',
    statDeltas: { overthinking: 15, doom: 10 },
  },
  {
    id: 'room_temp_coffee',
    name: 'Cup of Room-Temperature Coffee',
    count: '×1',
    icon: '☕',
    statBuff: '+15 Twitchy Alertness',
    statDebuff: 'Acid reflux aura',
    flavor: 'Brewed three hours ago. A fragile surface skin has formed. It tastes like unfulfilled ambition and stale tap water.',
    usable: true,
    used: false,
    effectDescription: 'Gulp the sludge: Restores +15 Resolve, reduces Doom by 5, adds +10 Overthinking jitter.',
    statDeltas: { resolve: 15, doom: -5, overthinking: 10 },
  },
  {
    id: 'wiki_tangent',
    name: 'Tablet of Wikipedia Tangents',
    count: '×1',
    icon: '📱',
    statBuff: '+40 Erudite Irrelevance',
    statDebuff: '-35 Academic Focus',
    flavor: 'You needed to look up one thermodynamic formula and now you are an expert on the 14th-century Republic of Venice salt trade.',
    usable: true,
    used: false,
    effectDescription: 'Browse the tangent: Absorbs 30 minutes of fictional time, but unlocks unique esoteric dialogue options.',
    statDeltas: { timeLostMinutes: 30, overthinking: 20 },
  },
];

// ==========================================
// SCENES & BRANCHING NARRATIVE
// ==========================================
export const SYLLABUS_SCENES: Record<string, Scene> = {
  // ----------------------------------------
  // ACT I — THE SPARK (Scenes 1 - 3)
  // ----------------------------------------
  act1_spark: {
    id: 'act1_spark',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 1,
    title: 'The Untouched Syllabus at 11:15 PM',
    location: 'The Desk of Infinite Reluctance',
    scenario:
      'The semester began twelve weeks ago with grand declarations and clean notebooks. It has now arrived at this: a glowing screen, 11:15 PM, and a 28-page PDF titled "Course_Overview_FINAL_v3.pdf" that has remained unread since orientation. Tomorrow morning is the deadline. The cursor pulses with accusatory regularity.',
    dilemma: 'How do you approach the first threshold of the academic underworld?',
    narratorObservation:
      'The human brain is capable of extraordinary feats, including calculating 4,000 hypothetical ways to avoid reading page two.',
    choices: [
      {
        id: 'c_spark_direct',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Open Chapter 1 and read the first sentence',
        subtitle: 'The dangerously rational path.',
        description: 'Bypass all cognitive defenses. Click the document, look directly at the font, and ingest the words as written by mortals.',
        statDeltas: { resolve: 20, doom: -5, overthinking: -5, timeLostMinutes: 5 },
        consequence: 'You read sentence one: "In this module we explore the fundamental tenets..." Your brain immediately complains that the room temperature is sub-optimal.',
        nextSceneId: 'act1_first_page',
        setFlags: ['chose_direct_reading'],
        unlockedAchievementId: 'touch_grass',
      },
      {
        id: 'c_spark_timetable',
        icon: '📜',
        type: 'PREPARE',
        title: 'Design the Perfect Color-Coded Study Timetable',
        subtitle: 'The illusion of supreme control.',
        description: 'You cannot study without a system. Open a blank spreadsheet and carve the next 7 hours into 15-minute optimization blocks with pastel hex codes.',
        statDeltas: { overthinking: 25, doom: 5, timeLostMinutes: 35 },
        consequence: 'Forty minutes evaporate. You have created an aesthetic triumph of mint green and lavender cells. Zero syllabus content has entered your consciousness.',
        nextSceneId: 'act1_color_citadel',
        itemReward: SYLLABUS_ITEMS[0], // The Study Plan of Infinite Preparation
        setFlags: ['crafted_study_plan', 'heavy_preparer'],
      },
      {
        id: 'c_spark_forum',
        icon: '🛡️',
        type: 'ESCAPE',
        title: 'Search forums for "Has anyone passed this course in 4 hours?"',
        subtitle: 'Seeking digital fellowship in doom.',
        description: 'Venture into the Reddit archives to locate an anonymous survivor from 2018 who pulled off this exact miracle.',
        statDeltas: { overthinking: 20, doom: 25, timeLostMinutes: 25 },
        consequence: 'You find a post from four years ago: "The final is 90% edge cases from footnote 4. Drop the course while you still can." Your blood runs cold.',
        nextSceneId: 'act1_forum_damned',
        itemReward: SYLLABUS_ITEMS[3], // The Unopened Scroll of Doom
        setFlags: ['searched_forums', 'doom_spiral'],
      },
      {
        id: 'c_spark_dawn',
        icon: '🧙',
        type: 'CHAOTIC',
        title: 'Declare a "5:00 AM Dawn Protocol" and set an alarm',
        subtitle: 'Delegating tragedy to tomorrow\'s self.',
        description: 'Convince yourself that human neurochemistry peaks at dawn. Tomorrow-You will be a titan of discipline and caffeine.',
        statDeltas: { overthinking: 30, doom: 10, resolve: -10, timeLostMinutes: 40 },
        consequence: 'You set 6 sequential alarms with names like "WAKE UP HERO" and "FINAL CHANCE". Both you and the universe know this is a polite fiction.',
        nextSceneId: 'act1_dawn_protocol',
        itemReward: SYLLABUS_ITEMS[1], // Potion of False Confidence
        setFlags: ['procrastinated_to_dawn'],
        unlockedAchievementId: 'tomorrow_tm',
      },
    ],
  },

  act1_first_page: {
    id: 'act1_first_page',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 2,
    title: 'The First Page Resistance',
    location: 'The Margin of Chapter One',
    scenario:
      'You are staring directly at Page One. The author has chosen to introduce the subject not with clarity, but with a four-paragraph philosophical preamble referencing German epistemologists. Your eyes scan the words three times without registering a single noun.',
    dilemma: 'The text refuses to enter your memory. How do you force comprehension?',
    choices: [
      {
        id: 'c_fp_highlighter',
        icon: '🖍️',
        type: 'ATTACK',
        title: 'Apply the Highlighter of False Importance',
        subtitle: 'If it glows neon, it must be learning.',
        description: 'Highlight every third sentence with aggressive enthusiasm. Turn the digital page into a vibrant radioactive canary-yellow tapestry.',
        statDeltas: { resolve: 15, overthinking: -5, timeLostMinutes: 10 },
        consequence: 'The page looks extremely studious now. You still don\'t know what "epistemic teleology" means, but it is unequivocally bright yellow.',
        nextSceneId: 'act1_desk_ritual',
        itemReward: SYLLABUS_ITEMS[4], // Highlighter of False Importance
        setFlags: ['wields_highlighter'],
      },
      {
        id: 'c_fp_dictionary',
        icon: '🛡️',
        type: 'DEFEND',
        title: 'Look up every unfamiliar vocabulary term in detail',
        subtitle: 'The academic rabbit-hole trap.',
        description: 'Open a tab for every word longer than three syllables. Dissect the etymology of 14 separate terms.',
        statDeltas: { overthinking: 25, timeLostMinutes: 30, resolve: 5 },
        consequence: 'You now know the Ancient Greek root of "hermeneutic." You have covered exactly 4 lines of text in 25 fictional minutes.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['vocabulary_diver'],
      },
      {
        id: 'c_fp_powerthrough',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Skip the preamble and hunt directly for actionable bullet points',
        subtitle: 'Tactical academic pragmatism.',
        description: 'Ignore the philosophical fluff. Scroll aggressively down to section 1.2: "Summary of Core Mechanisms."',
        statDeltas: { resolve: 25, doom: -10, overthinking: -10, timeLostMinutes: 5 },
        consequence: 'A direct hit! Section 1.2 actually contains three numbered formulas. Your pulse stabilizes slightly.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['tactical_skimmer'],
      },
    ],
  },

  act1_color_citadel: {
    id: 'act1_color_citadel',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 2,
    title: 'The Pastel Citadel of Scheduling',
    location: 'The Spreadsheet of Despair',
    scenario:
      'Your study plan is an aesthetic masterpiece. You have color-coded Pomodoro sessions, buffer intervals for existential contemplation, and a legend with five distinct pastel themes. However, the clock now shows 11:50 PM. You have officially fallen behind your own schedule before even beginning.',
    dilemma: 'Your schedule is already obsolete. How does an overthinker respond to schedule betrayal?',
    choices: [
      {
        id: 'c_cc_recalibrate',
        icon: '📜',
        type: 'PREPARE',
        title: 'Recalibrate the schedule to adjust for the lost 35 minutes',
        subtitle: 'Doubling down on bureaucracy.',
        description: 'Shift every block down by 35 minutes, condense sleep from 4 hours to 3 hours 15 minutes, and re-export the PDF.',
        statDeltas: { overthinking: 30, doom: 15, timeLostMinutes: 20 },
        consequence: 'The Ministry of Personal Efficiency approves your revised timetable. The syllabus remains unread, but the schedule now features bolder fonts.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['schedule_recalibrated'],
      },
      {
        id: 'c_cc_burn',
        icon: '🔥',
        type: 'DECISIVE',
        title: 'Crumple the theoretical plan and look at the actual chapter',
        subtitle: 'A momentary flash of lucidity.',
        description: 'Acknowledge that spreadsheets cannot take examinations. Close Excel with a sharp click.',
        statDeltas: { resolve: 25, overthinking: -15, doom: -5, timeLostMinutes: 5 },
        consequence: 'You banish the spreadsheet. The silence of the blank chapter returns, but your resolve has hardened.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['plan_rejected'],
      },
      {
        id: 'c_cc_pomodoro',
        icon: '⏳',
        type: 'DEFEND',
        title: 'Summon the 25-Minute Pomodoro Hourglass',
        subtitle: 'If schedules fail, invoke Italian kitchen timers.',
        description: 'Declare that the next 25 minutes will be sacred and uninterrupted, bounded by the ancient laws of tomato-shaped timers.',
        statDeltas: { resolve: 15, overthinking: 5, timeLostMinutes: 10 },
        consequence: 'You arm the timer. The sands begin to fall. The ticking immediately sounds louder than a jet engine.',
        nextSceneId: 'act1_desk_ritual',
        itemReward: SYLLABUS_ITEMS[5], // Pomodoro Hourglass
        setFlags: ['pomodoro_believer'],
      },
    ],
  },

  act1_forum_damned: {
    id: 'act1_forum_damned',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 2,
    title: 'The Catacombs of Student Forums',
    location: 'The Digital Abyss of r/UniversityPanic',
    scenario:
      'You are three layers deep into an archived Reddit thread from 2021. Someone with the username "CryingInTheLibrary42" claims that the final exam contains questions written in an ancient cipher. Another user responds: "Henderson doesn\'t grade on a curve, he curves your spirit." Doom radiates from the monitor.',
    dilemma: 'The horror stories are multiplying. How do you pull your consciousness back from the abyss?',
    choices: [
      {
        id: 'c_fd_helmet',
        icon: '🪖',
        type: 'DEFEND',
        title: 'Don the Helmet of Selective Ignorance',
        subtitle: 'What you cannot see cannot fail you.',
        description: 'Close all 17 Reddit tabs simultaneously. Refuse to acknowledge anyone else\'s trauma.',
        statDeltas: { doom: -25, resolve: 15, overthinking: -10 },
        consequence: 'Silence descends. The horrific forum threads are gone. You feel lighter, though slightly oblivious.',
        nextSceneId: 'act1_desk_ritual',
        itemReward: SYLLABUS_ITEMS[2], // Helmet of Selective Ignorance
        setFlags: ['ignorant_and_proud'],
      },
      {
        id: 'c_fd_spiral',
        icon: '💀',
        type: 'CHAOTIC',
        title: 'Search Henderson\'s RateMyProfessor ratings from 2012 to present',
        subtitle: 'Complete immersion in academic horror.',
        description: 'Catalog 12 years of student grievances looking for statistical patterns in exam difficulty.',
        statDeltas: { doom: 35, overthinking: 35, timeLostMinutes: 30 },
        consequence: 'You discover Henderson once gave a student a C+ for using Calibri font instead of Times New Roman. Your doom counter hits record levels.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['full_ratemyprofessor_lore'],
      },
      {
        id: 'c_fd_spite',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Convert sheer panic into spiteful adrenaline',
        subtitle: '"I will pass out of sheer defiance."',
        description: 'Decide that Henderson\'s mythical difficulty is a personal challenge from the universe.',
        statDeltas: { resolve: 30, doom: -10, overthinking: -5, timeLostMinutes: 5 },
        consequence: 'A fierce, irrational rage replaces your terror. You slam your notebook onto the desk with purpose.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['fueled_by_spite'],
      },
    ],
  },

  act1_dawn_protocol: {
    id: 'act1_dawn_protocol',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 2,
    title: 'The Mirage of the Dawn Awakening',
    location: 'The Pillow of False Hope',
    scenario:
      'You are lying in bed staring at the ceiling. The theoretical alarm is set for 5:00 AM. It is currently 12:15 AM. Your brain, having successfully avoided studying, now begins to replay every awkward conversation you have had since middle school.',
    dilemma: 'Sleep is impossible when your subconscious is on trial. What do you do?',
    choices: [
      {
        id: 'c_dp_getup',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Give up the lie, get out of bed, and turn the desk lamp on',
        subtitle: 'The midnight surrender to reality.',
        description: 'Admit that 5:00 AM You will simply press snooze 14 times. Return to the battlefield now.',
        statDeltas: { resolve: 25, doom: -10, overthinking: -15, timeLostMinutes: 10 },
        consequence: 'You sit back in your desk chair. It is cold, but the delusion is over. Reality has resumed.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['midnight_returnee'],
      },
      {
        id: 'c_dp_podcast',
        icon: '📱',
        type: 'ESCAPE',
        title: 'Listen to a "Study While You Sleep" subliminal audio track',
        subtitle: 'Passive learning through osmosis.',
        description: 'Put in headphones playing 8 hours of binaural delta waves promising to imprint thermodynamics onto your subconscious.',
        statDeltas: { overthinking: 25, doom: 15, timeLostMinutes: 45 },
        consequence: 'After 30 minutes of ocean sounds, a robotic voice whispers: "Entropy always increases." You bolt upright in sheer terror.',
        nextSceneId: 'act1_desk_ritual',
        setFlags: ['subliminal_audio_victim'],
      },
      {
        id: 'c_dp_coffee',
        icon: '☕',
        type: 'ATTACK',
        title: 'Drink the Cup of Room-Temperature Coffee in one swallow',
        subtitle: 'Biological shock therapy.',
        description: 'Consume the cold caffeine concoction left behind from dinner. Force consciousness upon your tired vessels.',
        statDeltas: { resolve: 20, overthinking: 10, doom: -5 },
        consequence: 'The cold bitter liquid jolts your nervous system. Your heart beats in 7/8 time signature. You are awake.',
        nextSceneId: 'act1_desk_ritual',
        itemReward: SYLLABUS_ITEMS[7], // Room-temperature coffee
        setFlags: ['cold_coffee_fueled'],
      },
    ],
  },

  act1_desk_ritual: {
    id: 'act1_desk_ritual',
    act: 1,
    actTitle: 'ACT I: THE SPARK',
    stageNumber: 3,
    title: 'The Desk Environment Verification Ritual',
    location: 'The Battle-Station of Uncertainty',
    scenario:
      'All paths have converged at the desk. You notice that the desk is spiritually misaligned. There is a crumpled receipt from October, three pens with missing caps, an empty mug, and your phone vibrating silently on the corner like a miniature seismic event.',
    dilemma: 'Can a scholar truly absorb knowledge in an un-sanctified workspace?',
    narratorObservation:
      'The urge to clean one\'s desk is never stronger than when an academic execution is scheduled within six hours.',
    choices: [
      {
        id: 'c_dr_clean',
        icon: '🧹',
        type: 'PREPARE',
        title: 'Perform a comprehensive 20-minute desk purification',
        subtitle: 'Procrastination disguised as hygiene.',
        description: 'Align the pens by color, wipe the desk surface with a wet wipe, and arrange the textbooks in ascending chronological order.',
        statDeltas: { timeLostMinutes: 25, overthinking: 10, resolve: 10 },
        consequence: 'The desk is pristine. It looks like a stock photo of an Ivy League scholar. Unfortunately, you still know nothing about Chapter 3.',
        nextSceneId: 'act2_ancient_notes',
        setFlags: ['pristine_desk'],
      },
      {
        id: 'c_dr_sticky',
        icon: '📝',
        type: 'ATTACK',
        title: 'Uncover the mysterious pink sticky note buried under the keyboard',
        subtitle: 'An archaeological discovery from your past self.',
        description: 'Pull out the crumpled note stuck to the desk corner from three weeks ago.',
        statDeltas: { overthinking: 15, doom: 10 },
        consequence: 'The note reads: "REMEMBER THE LEMMA (IMPORTANT???)". It offers no page number, no context, and zero mercy.',
        nextSceneId: 'act2_ancient_notes',
        itemReward: SYLLABUS_ITEMS[6], // The Cursed Sticky Note
        setFlags: ['uncovered_sticky_note'],
      },
      {
        id: 'c_dr_ignore',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Shove the clutter aside with one forearm sweep and focus',
        subtitle: 'The barbarian scholar\'s method.',
        description: 'Sweep receipts, pens, and crumbs to the side of the table. Clear a 12-inch perimeter for the laptop and begin.',
        statDeltas: { resolve: 25, doom: -10, overthinking: -15, timeLostMinutes: 2 },
        consequence: 'Crude, violent, and astonishingly effective. A mug wobbles but does not fall. Act I draws to a close; the spiral begins.',
        nextSceneId: 'act2_ancient_notes',
        setFlags: ['forearm_sweep_master'],
      },
    ],
  },

  // ----------------------------------------
  // ACT II — THE SPIRAL (Scenes 4 - 8)
  // ----------------------------------------
  act2_ancient_notes: {
    id: 'act2_ancient_notes',
    act: 2,
    actTitle: 'ACT II: THE SPIRAL',
    stageNumber: 4,
    title: 'The Ancient Guardian of Unfinished Notes',
    location: 'The Spiral-Bound Crypt of Week 4',
    scenario:
      'You open your actual lecture notebook from earlier in the semester. The first three pages are written in beautiful, cursive penmanship with blue ink. By page seven, the handwriting deteriorates into jagged seismographic tremors. By page twelve, there is only a drawing of a cube wearing a hat and the word "WHY" circled four times.',
    dilemma: 'Your own past self has left you cryptic runes instead of academic guidance.',
    narratorObservation:
      'It is deeply humbling to realize that the person who took these notes was you, yet they feel authored by a Victorian madman.',
    choices: [
      {
        id: 'c_an_decipher',
        icon: '📜',
        type: 'ATTACK',
        title: 'Attempt to cryptanalytically decipher the handwriting',
        subtitle: 'Treat your past self as an ancient civilization.',
        description: 'Cross-reference the squiggles with the chapter headings to reconstruct what Professor Henderson was saying on October 14th.',
        statDeltas: { resolve: 15, overthinking: 15, timeLostMinutes: 20 },
        consequence: 'You crack the code: the squiggle says "Equilibrium Constant." You have salvaged one functional concept from the ruins!',
        nextSceneId: 'act2_video_rabbit_hole',
        setFlags: ['deciphered_past_self'],
      },
      {
        id: 'c_an_cube',
        icon: '🌀',
        type: 'CHAOTIC',
        title: 'Contemplate the philosophical meaning of the Cube Wearing a Hat',
        subtitle: 'Maybe your subconscious was onto something.',
        description: 'Stare at the geometric sketch. Was this a mnemonic device? A metaphor for modern bureaucratic confinement?',
        statDeltas: { overthinking: 30, doom: 15, timeLostMinutes: 20 },
        consequence: 'You conclude that the cube represents the rigid structure of academia and the hat represents human vanity. Your exam score remains zero.',
        nextSceneId: 'act2_video_rabbit_hole',
        itemReward: SYLLABUS_ITEMS[8], // Tablet of Wikipedia Tangents
        setFlags: ['pondered_the_cube'],
        unlockedAchievementId: 'cosmic_brain',
      },
      {
        id: 'c_an_burnnotes',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Discard the notebook entirely and rely solely on the textbook summary',
        subtitle: 'Severing ties with your past failures.',
        description: 'Toss the notebook into the recycling bin. Your past self was clearly compromised. Trust only peer-reviewed textbooks.',
        statDeltas: { resolve: 25, doom: -10, overthinking: -10, timeLostMinutes: 5 },
        consequence: 'A clean break! You slam the notebook shut and face the official textbook. Your resolve surges.',
        nextSceneId: 'act2_video_rabbit_hole',
        setFlags: ['abandoned_past_notes'],
      },
    ],
  },

  act2_video_rabbit_hole: {
    id: 'act2_video_rabbit_hole',
    act: 2,
    actTitle: 'ACT II: THE SPIRAL',
    stageNumber: 5,
    title: 'The Explanatory Video Rabbit Hole',
    location: 'The Infinite Algorithm of YouTube',
    scenario:
      'You tell yourself: "I just need a quick 5-minute video to explain the core concept." You open YouTube. Before you can click search, the recommendation sidebar tempts you with: "How Medieval Trebuchets Actually Worked," "Why Rome Collapsed (4-Hour Documentary)," and an Indian gentleman explaining the syllabus with a whiteboard from 2017.',
    dilemma: 'The entire digital world is competing to prevent you from studying Chapter 4.',
    narratorObservation:
      'The Indian YouTuber with a dry-erase marker and a $12 microphone has saved more academic careers than the entire global university system.',
    choices: [
      {
        id: 'c_vr_legend',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Watch the Indian Tutor at 1.75x speed with subtitles',
        subtitle: 'Summoning the true patron saint of exams.',
        description: 'Click the video titled "Complete Chapter in 14 Minutes (Guaranteed Full Marks)". Absorb information at superhuman velocity.',
        statDeltas: { resolve: 30, doom: -20, overthinking: -15, timeLostMinutes: 15 },
        consequence: 'In 12 breathless minutes, the gentleman explains what your professor spent 6 weeks obscuring. Pure enlightenment achieved!',
        nextSceneId: 'act2_cursed_notification',
        setFlags: ['blessed_by_indian_tutor'],
      },
      {
        id: 'c_vr_trebuchet',
        icon: '🏰',
        type: 'ESCAPE',
        title: 'Watch "just 4 minutes" of the Medieval Trebuchet video',
        subtitle: 'A catastrophic lapse in tactical discipline.',
        description: 'Tell yourself that siege weaponry understanding enhances spatial awareness and cognitive flexibility.',
        statDeltas: { overthinking: 20, doom: 20, timeLostMinutes: 40 },
        consequence: 'Forty-two minutes pass. You now understand counterweight physics in the Siege of Acre. Chapter 4 has not advanced by a single millimeter.',
        nextSceneId: 'act2_cursed_notification',
        setFlags: ['trebuchet_enthusiast'],
        unlockedAchievementId: 'one_quick_check',
      },
      {
        id: 'c_vr_speedrun',
        icon: '📱',
        type: 'CHAOTIC',
        title: 'Read the YouTube comment section to see if the video is trustworthy',
        subtitle: 'Outsourcing quality assurance to strangers.',
        description: 'Scroll past the video into 900 comments of students mourning their academic prospects.',
        statDeltas: { overthinking: 25, doom: 15, timeLostMinutes: 20 },
        consequence: 'Top comment: "Watching this 30 minutes before my exam, pray for me." Posted 6 years ago. The tragedy is cyclical and eternal.',
        nextSceneId: 'act2_cursed_notification',
        setFlags: ['read_the_comments'],
      },
    ],
  },

  act2_cursed_notification: {
    id: 'act2_cursed_notification',
    act: 2,
    actTitle: 'ACT II: THE SPIRAL',
    stageNumber: 6,
    title: 'The Cursed Notification from the Group Chat',
    location: 'The Digital Echo Chamber of Panic',
    scenario:
      'A sharp buzz echoes on the desk. It is a notification from the course group chat. A classmate named Marcus writes: "Guys, did anyone see Henderson\'s announcement on the portal? Question 3 on the exam will test the supplementary paper from 2019." Chaos erupts in the chat with 47 replies in 90 seconds.',
    dilemma: 'A new vector of panic has entered the arena. How do you respond to collective hysteria?',
    narratorObservation:
      'Group chats before an exam are not study groups. They are emotional bomb shelters where people throw grenades at each other.',
    choices: [
      {
        id: 'c_cn_verify',
        icon: '🛡️',
        type: 'DEFEND',
        title: 'Actually check the portal announcement yourself',
        subtitle: 'Verifying facts in an age of panic.',
        description: 'Log into the course portal and read the actual wording of the announcement with cold detachment.',
        statDeltas: { resolve: 20, doom: -15, overthinking: -10, timeLostMinutes: 8 },
        consequence: 'The announcement says: "The 2019 paper is OPTIONAL reading for bonus points." Marcus is a catastrophizing fool. You have avoided disaster!',
        nextSceneId: 'act2_pomodoro_paradox',
        setFlags: ['verified_facts_calmly'],
      },
      {
        id: 'c_cn_mute',
        icon: '🪖',
        type: 'ESCAPE',
        title: 'Mute the group chat for 8 hours and throw phone across the room',
        subtitle: 'Severing the contagion vector.',
        description: 'Slide the toggle to Do Not Disturb and toss the device onto the bed. No more digital contamination.',
        statDeltas: { resolve: 25, doom: -10, overthinking: -15, timeLostMinutes: 2 },
        consequence: 'The device lands softly on a pillow. Absolute silence settles over the room. Your sanity begins to reconstitute.',
        nextSceneId: 'act2_pomodoro_paradox',
        setFlags: ['muted_the_chat'],
      },
      {
        id: 'c_cn_bluff',
        icon: '🧪',
        type: 'ATTACK',
        title: 'Reply with false confidence: "Already summarized that paper, it\'s easy"',
        subtitle: 'Psychological warfare against your peers.',
        description: 'Drop a single confident message in the chat to assert dominance and manifest unearned mastery.',
        statDeltas: { resolve: 15, overthinking: 15, doom: 10 },
        consequence: 'The chat goes silent for 10 seconds. You have terrified your classmates, but now the cosmic stakes of your bluff have doubled.',
        nextSceneId: 'act2_pomodoro_paradox',
        setFlags: ['bluffed_in_group_chat'],
      },
    ],
  },

  act2_pomodoro_paradox: {
    id: 'act2_pomodoro_paradox',
    act: 2,
    actTitle: 'ACT II: THE SPIRAL',
    stageNumber: 7,
    title: 'The Pomodoro Paradox (Minute 14)',
    location: 'The Vacuum of Concentrated Silence',
    scenario:
      'You are 14 minutes into an uninterrupted study session. The room is dead quiet. You have actually read three full pages of Chapter 5. But suddenly, your brain detects an anomaly: "Why is it so quiet? Should we check if the Wi-Fi is working? What if someone tried to email us about an emergency?" The silence feels heavier than noise.',
    dilemma: 'The stillness of productivity is terrifying. How do you maintain focus?',
    narratorObservation:
      'When an overthinker experiences peace, their immediate reaction is to check for an impending earthquake.',
    choices: [
      {
        id: 'c_pp_resist',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Stare down the impulse and finish the remaining 11 minutes',
        subtitle: 'Raw, unadulterated willpower.',
        description: 'Bite your lip, keep your fingers on the text, and refuse to check a single app until the timer sounds.',
        statDeltas: { resolve: 30, doom: -10, overthinking: -20, timeLostMinutes: 11 },
        consequence: 'The timer chimes! A genuine, authentic 25-minute study cycle has been completed. You are practically an adult now.',
        nextSceneId: 'act2_bureaucratic_wall',
        setFlags: ['completed_pomodoro_sprint'],
        unlockedAchievementId: 'touch_grass',
      },
      {
        id: 'c_pp_snack',
        icon: '☕',
        type: 'ESCAPE',
        title: 'Declare a "tactical hydration & nutrition break" to the kitchen',
        subtitle: 'The refrigerator expedition.',
        description: 'Walk into the kitchen, open the fridge door, and stare at a jar of pickles for 4 minutes in contemplation.',
        statDeltas: { timeLostMinutes: 20, overthinking: 15, doom: 5 },
        consequence: 'You consume half a slice of cheddar cheese and a glass of water. The timer has elapsed while you were gazing into the vegetable crisper.',
        nextSceneId: 'act2_bureaucratic_wall',
        setFlags: ['kitchen_pilgrim'],
      },
      {
        id: 'c_pp_music',
        icon: '🎧',
        type: 'PREPARE',
        title: 'Spend 15 minutes finding the exact perfect Lo-Fi / Synthwave study playlist',
        subtitle: 'The acoustic environment audit.',
        description: 'You cannot study to this beat. The BPM is 84, but your cognitive wavelength requires 88 BPM.',
        statDeltas: { timeLostMinutes: 25, overthinking: 20, doom: 10 },
        consequence: 'You sample 9 different tracks before settling on "Chill Beats to Panic to at 2 AM." Zero pages were read during acoustic curation.',
        nextSceneId: 'act2_bureaucratic_wall',
        setFlags: ['playlist_perfectionist'],
      },
    ],
  },

  act2_bureaucratic_wall: {
    id: 'act2_bureaucratic_wall',
    act: 2,
    actTitle: 'ACT II: THE SPIRAL',
    stageNumber: 8,
    title: 'The Bureaucratic Paradox of Chapter 7',
    location: 'The Threshold of The Final Exam',
    scenario:
      'It is 1:45 AM. You have arrived at the precipice of Chapter 7. But the syllabus contains a fatal contradiction: Section 7.1 directs you to Appendix C, which directs you to an external website whose link is dead, which directs you to email Professor Henderson. The clock is relentlessly ticking toward morning.',
    dilemma: 'The academic system itself is broken. The phantom of the entire syllabus manifests before you!',
    narratorObservation:
      'The Department of Academic Catastrophes has convened. They have determined that your survival will require a decisive reckoning.',
    choices: [
      {
        id: 'c_bw_synthesize',
        icon: '⚔️',
        type: 'DECISIVE',
        title: 'Synthesize everything you have learned and prepare for battle',
        subtitle: 'Accepting the challenge of the syllabus.',
        description: 'No more avoidance, no more spreadsheets, no more excuses. Gird your mental loins and march toward the final confrontation.',
        statDeltas: { resolve: 35, doom: -15, overthinking: -10, timeLostMinutes: 5 },
        consequence: 'You shut the redundant tabs. The air in the room grows cold. The Guardian of the Unfinished Syllabus manifests!',
        nextSceneId: 'BOSS_BATTLE',
        setFlags: ['confronted_guardian_bravely'],
      },
      {
        id: 'c_bw_bs',
        icon: '🧪',
        type: 'ATTACK',
        title: 'Formulate an elaborate strategy of Tactical Academic Bullshit',
        subtitle: 'The grand art of saying nothing convincingly.',
        description: 'If you do not know the answer, you will write three paragraphs of flawless academic syntax that dazzles the grader through sheer vocabulary.',
        statDeltas: { resolve: 20, overthinking: 25, doom: 10 },
        consequence: 'You sharpen your buzzwords: "dialectical synthesis," "paradigm variance," "systemic optimization." You are ready to deceive God.',
        nextSceneId: 'BOSS_BATTLE',
        setFlags: ['bullshit_mastery'],
      },
      {
        id: 'c_bw_panic',
        icon: '💀',
        type: 'CHAOTIC',
        title: 'Surrender to the cosmic absurdity and laugh like a villain',
        subtitle: 'Transcendence through sheer exhaustion.',
        description: 'A giggle escapes your lips. It is 2:00 AM. You are completely unhinged and totally liberated.',
        statDeltas: { overthinking: 35, doom: 20, resolve: 15 },
        consequence: 'Fear evaporates when you realize you have already experienced the worst an academic bureaucracy can throw at you.',
        nextSceneId: 'BOSS_BATTLE',
        setFlags: ['villain_laughter'],
        unlockedAchievementId: 'cosmic_brain',
      },
    ],
  },
};

// ==========================================
// THE GUARDIAN OF THE UNFINISHED SYLLABUS
// (Multi-Phase Climax Boss Encounter)
// ==========================================
export const SYLLABUS_BOSS_DATA: SyllabusBossData = {
  id: 'boss_guardian_syllabus',
  name: 'THE GUARDIAN OF THE UNFINISHED SYLLABUS',
  title: 'Sentinel of Untouched Chapters & Warden of Deadlines',
  icon: '📚',
  description:
    'A towering colossus constructed from 800 pages of unread PDF readings, color-coded sticky notes, broken website hyperlinks, and the phantom expectation of your parents.',
  phases: [
    // ----------------------------------------
    // PHASE 1: The PDF Fortress of Untouched Chapters
    // ----------------------------------------
    {
      phaseNumber: 1,
      phaseName: 'PHASE I: The PDF Fortress of Untouched Chapters',
      subtitle: 'The colossus throws walls of dense academic text and obscure citations.',
      bossMaxHp: 100,
      bossDialogue:
        '"Did you truly believe you could master twelve weeks of academic rigor in four frantic hours? Behold: Chapter 3, Subsection 4, Footnote 12 in 9-point font!"',
      bossAttackName: 'Unopened PDF Barrage',
      bossAttackDescription:
        'Hurls dense blocks of jargon and unread citations that threaten to overwhelm your comprehension.',
      bossAbilities: [
        'Font Size 9 Panic',
        'Unread Citation Wall',
        'Phantom Formatting Error',
        'Theoretical Preamble Shockwave',
      ],
      actions: [
        {
          id: 'b1_speedread',
          title: 'Decisive Speed-Read Blitz',
          icon: '⚡',
          description: 'Lock eyes with the core thesis and strike directly at the chapter conclusions.',
          damage: 38,
          statDeltas: { resolve: 15, overthinking: -10, doom: -5 },
          bossReaction: '"Gah! You skipped the 40-page historical preamble and struck the core theorem!"',
          playerFeedback: 'Critical strike! You bypassed the academic fluff and severed 38 HP from the Fortress.',
        },
        {
          id: 'b1_highlighter',
          title: 'Deploy Highlighter of False Importance',
          icon: '🖍️',
          description: 'Blaze bright neon yellow across the Guardian\'s armor to blind its typography.',
          damage: 34,
          condition: { requiresItem: 'highlighter_importance' },
          conditionExplanation: 'Requires Highlighter in inventory',
          statDeltas: { resolve: 10, overthinking: -5 },
          bossReaction: '"My text! It burns with blinding fluorescent yellow! I can no longer read my own citations!"',
          playerFeedback: 'The neon assault disorients the Guardian, shattering its visual defenses for 34 damage!',
        },
        {
          id: 'b1_skimanalyze',
          title: 'Analyze Diagram Only (Ignore Text)',
          icon: '📊',
          description: 'Completely ignore the paragraphs and decipher the single flowchart on page 42.',
          damage: 30,
          statDeltas: { resolve: 10, doom: -10 },
          bossReaction: '"No! The diagram was meant to be purely supplementary! How dare you deduce the system!"',
          playerFeedback: 'You extract the entire chapter logic from a single graphic, striking for 30 HP!',
        },
        {
          id: 'b1_false_confidence',
          title: 'Unleash Potion of False Confidence',
          icon: '🧪',
          description: 'Declare loudly: "This is fundamentally intuitive and I already understand it."',
          damage: 32,
          statDeltas: { resolve: 20, doom: -15, overthinking: 5 },
          bossReaction: '"Preposterous! How can you be so brazenly unbothered by complex epistemology?!"',
          playerFeedback: 'Your absurd self-assurance strikes a psychological blow for 32 damage!',
        },
      ],
    },

    // ----------------------------------------
    // PHASE 2: The Hall of False Mastery
    // ----------------------------------------
    {
      phaseNumber: 2,
      phaseName: 'PHASE II: The Hall of False Mastery',
      subtitle: 'The Guardian weaponizes your own procrastination and broken study plans against you.',
      bossMaxHp: 100,
      bossDialogue:
        '"You scheduled yourself for fifteen minutes of study followed by three hours of spreadsheet formatting! Your own timetable condemns you, mortal!"',
      bossAttackName: 'Timetable Inversion & Guilt Phantoms',
      bossAttackDescription:
        'Manifests the ghosts of unfinished tasks and holds up your broken schedule as a binding legal contract.',
      bossAbilities: [
        'Schedule Betrayal Echo',
        'Phantom Group Chat Ping',
        'Impending Dawn Dread',
        'Contradictory Rubric Strike',
      ],
      actions: [
        {
          id: 'b2_plan_weapon',
          title: 'Turn The Study Plan Against The Boss',
          icon: '📜',
          description: 'Show the Guardian that according to cell G14 of your spreadsheet, it is scheduled to be defeated right now.',
          damage: 42,
          condition: { requiresFlag: 'crafted_study_plan' },
          conditionExplanation: 'Requires crafted study plan from Act I',
          statDeltas: { resolve: 15, overthinking: 10, doom: -10 },
          bossReaction: '"Wait... cell G14 says \'Slaughter the Syllabus Guardian\' at 2:15 AM?! The bureaucracy... it compels me!"',
          playerFeedback: 'Bureaucratic counter-attack! The Guardian obeys your calendar formatting, taking 42 massive damage!',
        },
        {
          id: 'b2_expose_contradiction',
          title: 'Expose Syllabus Rubric Contradiction',
          icon: '⚖️',
          description: 'Point out that page 4 says the exam is 40% of the grade, but page 28 says it is 50%.',
          damage: 36,
          statDeltas: { resolve: 20, doom: -10, overthinking: -10 },
          bossReaction: '"An administrative error in my own holy scripture?! No! The Dean must not know of this!"',
          playerFeedback: 'You exploit the department\'s own typo, staggering the Guardian for 36 damage!',
        },
        {
          id: 'b2_pomodoro_strike',
          title: 'Channel Unbroken Pomodoro Focus',
          icon: '⏳',
          description: 'Summon the concentrated stillness of a completed 25-minute sprint against the boss.',
          damage: 35,
          condition: { minResolve: 35 },
          conditionExplanation: 'Requires at least 35 Resolve',
          statDeltas: { resolve: 15, doom: -15 },
          bossReaction: '"Such disciplined quiet... how can an overthinker possess such calm silence?!"',
          playerFeedback: 'A surge of steady focus smashes through the boss\'s guilt phantoms for 35 HP!',
        },
        {
          id: 'b2_sacrificial_summary',
          title: 'Sacrificial One-Sentence Summary',
          icon: '📝',
          description: 'Reduce the Guardian\'s entire 80-page existence into a single irreverent tweet-length summary.',
          damage: 32,
          statDeltas: { resolve: 15, overthinking: -15 },
          bossReaction: '"You cannot reduce my majestic treatise into \'Basically things move when pushed\'! Desecration!"',
          playerFeedback: 'Brutal reductionism strikes the Guardian\'s ego for 32 damage!',
        },
      ],
    },

    // ----------------------------------------
    // PHASE 3: The Deadline Singularity
    // ----------------------------------------
    {
      phaseNumber: 3,
      phaseName: 'PHASE III: The Deadline Singularity',
      subtitle: 'The clock strikes 11:59 PM. The portal to submission begins to close.',
      bossMaxHp: 100,
      bossDialogue:
        '"THE TIME HAS RUN OUT! THE PORTAL OF CANVAS CLOSES! WILL YOU CRUMBLE BEFORE THE DIGITAL SUBMISSION BOX?!"',
      bossAttackName: 'Final Server Submission Crash',
      bossAttackDescription:
        'The dread of the final submission deadline threatens to freeze your browser and shatter your spirit.',
      bossAbilities: [
        'Submission Portal 504 Gateway Timeout',
        'Font Formatting Collapse',
        'Academic Mortality Strike',
        'Last-Second Plagiarism Hallucination',
      ],
      actions: [
        {
          id: 'b3_master_synthesis',
          title: 'The Masterful Synthesis (True Scholar Finisher)',
          icon: '👑',
          description: 'Unite every shred of knowledge, intuition, and resolve into one cohesive final defense.',
          damage: 55,
          condition: { minResolve: 45 },
          conditionExplanation: 'Requires 45+ Resolve',
          statDeltas: { resolve: 25, doom: -25, overthinking: -20 },
          bossReaction: '"IMPOSSIBLE! You actually synthesized the material under extreme pressure! You... you passed!"',
          playerFeedback: 'CRITICAL FINISHER! A dazzling display of academic triumph smites the Guardian for 55 damage!',
        },
        {
          id: 'b3_great_bluff',
          title: 'The Great Academic Bluff (Unreasonable Victory)',
          icon: '🎭',
          description: 'Deploy three paragraphs of high-flown rhetorical wizardry that sounds so authoritative nobody dares question it.',
          damage: 48,
          statDeltas: { resolve: 20, overthinking: 15, doom: -15 },
          bossReaction: '"I do not understand a single word of your final conclusion, but the vocabulary is so intimidating I must accept it!"',
          playerFeedback: 'Your unhinged eloquence baffles the Guardian into total submission for 48 damage!',
        },
        {
          id: 'b3_scroll_doom',
          title: 'Unroll The Scroll of Doom Against The Clock',
          icon: '📜',
          description: 'Counter the boss\'s deadline panic with the ancient forum prophecies of survival.',
          damage: 45,
          condition: { requiresItem: 'scroll_doom' },
          conditionExplanation: 'Requires Scroll of Doom in inventory',
          statDeltas: { doom: -20, resolve: 20 },
          bossReaction: '"The legends of CryingInTheLibrary42! The sacred curve prophecies! I am undone!"',
          playerFeedback: 'The forum legends dispel the Guardian\'s aura for 45 damage!',
        },
        {
          id: 'b3_desperate_bullet',
          title: 'Desperate Bullet-Point Barrage',
          icon: '💥',
          description: 'Type as fast as humanly possible, slapping every factoid you remember onto the digital parchment.',
          damage: 40,
          statDeltas: { resolve: 15, doom: -10 },
          bossReaction: '"Bullets! Hundreds of unformatted bullet points! My elegant structure has collapsed!"',
          playerFeedback: 'An unyielding hail of raw information shatters the remaining HP of the Guardian!',
        },
      ],
    },
  ],
};

// ==========================================
// FOUR DISTINCT ENDING ARCHETYPES
// ==========================================
export const SYLLABUS_ENDINGS: Record<string, EndingDefinition> = {
  accidental_adult: {
    id: 'ending_accidental_adult',
    archetype: 'accidental_adult',
    archetypeTitle: 'THE ACCIDENTAL ADULT',
    title: 'Victory Through Grudging Competence',
    badge: '🏆 THE ACCIDENTAL ADULT',
    icon: '🧑‍🎓',
    summary: 'Against every natural instinct to panic or optimize spreadsheets, you made meaningful progress and survived.',
    narrative:
      'The Guardian of the Unfinished Syllabus dissolves into harmless ASCII dust. You sit at your desk as dawn creeps through the window blind. The chapter was read. The notes were written. The exam questions were answered. You did not enjoy the process, and you still harbor deep reservations about German epistemology, but you are undeniably, horrifyingly, functionally competent. You have accidentally behaved like an adult.',
    realityCheckMundaneTask:
      'You had 18 pages of introductory text to read. It took roughly 45 minutes of actual reading time. The remaining 3 hours and 40 minutes were spent in psychological siege warfare.',
    realityCheckVerdict:
      'Total Academic Threat Level: Mild Tuesday Homework. Actual Drama Generated: Lord of the Rings Trilogy.',
    whyThisHappened:
      'You consistently chose decisive actions, controlled your Doom levels, maintained strong Resolve, and attacked the material directly when it counted.',
  },

  supreme_catastrophizer: {
    id: 'ending_supreme_catastrophizer',
    archetype: 'supreme_catastrophizer',
    archetypeTitle: 'THE SUPREME CATASTROPHIZER',
    title: 'The Mythological Apocalypse of Chapter 4',
    badge: '💀 THE SUPREME CATASTROPHIZER',
    icon: '🌌',
    summary: 'You transformed a standard academic requirement into an existential cosmic opera of unprecedented proportions.',
    narrative:
      'The syllabus was never just a syllabus to you. It was a binding Faustian pact, a philosophical indictment of your lineage, and an omen of societal collapse. You investigated RateMyProfessor reviews from 2011, calculated 14 distinct bankruptcy timelines, and questioned the molecular stability of the universe. You defeated the Guardian not through reading, but by out-panicking it so violently that even the colossus felt overwhelmed by your psychic dread.',
    realityCheckMundaneTask:
      'The actual task was a 10-question multiple choice quiz on introductory definitions with unlimited attempts.',
    realityCheckVerdict:
      'You calculated 14,000 vectors of doom. Exactly zero occurred. You passed with an 82% while vibrating at 120 beats per minute.',
    whyThisHappened:
      'Your Overthinking and Doom stats surged past critical thresholds. You indulged every rabbit hole, forum spiral, and worst-case scenario available.',
  },

  eternal_preparation: {
    id: 'ending_eternal_preparation',
    archetype: 'eternal_preparation',
    archetypeTitle: 'THE ETERNAL PREPARATION',
    title: 'The Monument of Unused Masterpieces',
    badge: '📜 THE ETERNAL PREPARATION',
    icon: '🏛️',
    summary: 'You built the most magnificent preparation infrastructure in human history, but forgot to read the text.',
    narrative:
      'Scholars of the 23rd century will excavate your digital workstation and marvel at what you created. The 15-minute interval schedule was flawless. The highlighter palette was a symphony of pastel harmony. The desk was sanitized to ISO laboratory standards. The Lo-Fi study playlist was curated with surgical precision. You built a majestic cathedral of preparation. Sadly, the cathedral remained entirely empty.',
    realityCheckMundaneTask:
      'You spent 3 hours and 15 minutes preparing to study. Actual study duration: 6 minutes and 42 seconds.',
    realityCheckVerdict:
      'Your preparation was so magnificent that studying would have only sullied its pristine theoretical perfection.',
    whyThisHappened:
      'Your Time Lost stat accumulated rapidly while Overthinking soared. You prioritized timetables, desk rituals, and item collection over direct execution.',
  },

  unreasonable_success: {
    id: 'ending_unreasonable_success',
    archetype: 'unreasonable_success',
    archetypeTitle: 'THE UNREASONABLE SUCCESS',
    title: 'The Triumph of Unhinged Audacity',
    badge: '🎲 THE UNREASONABLE SUCCESS',
    icon: '✨',
    summary: 'Through pure bravado, chaotic bluffing, and sheer statistical impossibility, you somehow crossed the finish line.',
    narrative:
      'By all known laws of pedagogy, you should have failed catastrophically. You drank cold coffee, watched trebuchet videos, bluffed in the group chat, skimmed two diagrams, and deployed tactical academic buzzwords in the final confrontation. Yet, when the portal closed, your submission registered as accepted. Professor Henderson left a comment: "Unconventional methodology, but strangely compelling synthesis." You are a rogue hero of the academic underworld.',
    realityCheckMundaneTask:
      'You guessed on 3 questions, cited a Wikipedia tangent for question 4, and wrote "as demonstrated by modern paradigm variance" four times.',
    realityCheckVerdict:
      'Do not try this again. You used three lifetimes of good luck on a single Wednesday morning.',
    whyThisHappened:
      'You paired high Resolve with Chaotic moves, False Confidence, and unorthodox strategies that bypassed conventional study channels.',
  },
};

// ==========================================
// ACHIEVEMENTS LIST
// ==========================================
export const SYLLABUS_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'excessive_prep',
    title: '📜 Excessive Preparation',
    description: 'Spent over 60 fictional minutes on schedules, cleaning, or playlists before reading.',
    icon: '📜',
  },
  {
    id: 'master_disasters',
    title: '🌋 Master of Imaginary Disasters',
    description: 'Pushed Doom or Overthinking past 75% without suffering cardiac arrest.',
    icon: '🌋',
  },
  {
    id: 'surprisingly_decisive',
    title: '⚔️ Surprisingly Decisive',
    description: 'Selected 4 or more Decisive actions throughout the quest.',
    icon: '⚔️',
  },
  {
    id: 'unnecessary_knowledge',
    title: '🏰 Collector of Unnecessary Knowledge',
    description: 'Mastered medieval trebuchets, Wikipedia tangents, or 2012 professor lore.',
    icon: '🏰',
  },
  {
    id: 'plan_was_real_boss',
    title: '📊 The Plan Was the Real Boss',
    description: 'Turned your own color-coded Study Plan against the Guardian in Phase 2.',
    icon: '📊',
  },
  {
    id: 'pomodoro_heretic',
    title: '⏳ Pomodoro Heretic',
    description: 'Survived a full Pomodoro sprint or contemplated existence during minute 14.',
    icon: '⏳',
  },
  {
    id: 'touch_grass',
    title: '🌱 Touch Grass',
    description: 'Chose a direct, rational, no-nonsense path in an irrational world.',
    icon: '🌱',
  },
  {
    id: 'escalation_architect',
    title: '🔥 Escalation Architect',
    description: 'Used "MAKE IT WORSE" 3 or more times during the quest.',
    icon: '🔥',
  },
  {
    id: 'syllabus_slayer',
    title: '👑 Slayer of the Unfinished Syllabus',
    description: 'Conquered all three phases of the Guardian and reached an ending.',
    icon: '👑',
  },
  {
    id: 'tomorrow_tm',
    title: '🐌 Tomorrow™',
    description: 'Attempted to invoke the 5:00 AM Dawn Protocol delusion.',
    icon: '🐌',
  },
];

// ==========================================
// CONTEXTUAL & RANDOM EVENTS POOL
// ==========================================
export const SYLLABUS_RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'ev_hyper_audio',
    icon: '🎧',
    title: 'The 8-Minute Gamma Wave Brain Hack',
    description: 'An ad promises to flash-imprint organic chemistry into your cerebral cortex. You listen for 20 seconds before realizing it is just dial-up internet modem noises.',
    overthinkingDelta: 12,
    statDeltas: { overthinking: 12, timeLostMinutes: 5 },
    flavor: 'Your ears buzz. Your grade has not improved.',
  },
  {
    id: 'ev_version_update',
    icon: '📑',
    title: 'Professor Henderson Uploads Syllabus_v2_FINAL.pdf',
    description: 'At 1:12 AM, an automated portal email arrives: "Minor updates made to grading criteria." The entire class group chat screams in unison.',
    overthinkingDelta: 20,
    statDeltas: { doom: 20, overthinking: 15 },
    flavor: 'The updates were solely correcting two commas, but the psychic damage is irreversible.',
  },
  {
    id: 'ev_forgotten_index_card',
    icon: '📇',
    title: 'The Forgotten 3x5 Index Card Miracle',
    description: 'You find an index card slipped into your backpack with five formulas written in neat purple pencil. They are legible and accurate!',
    overthinkingDelta: -10,
    statDeltas: { resolve: 15, doom: -10, overthinking: -10 },
    flavor: 'A gift from a version of you who had not yet given up hope.',
  },
  {
    id: 'ev_cat_keyboard',
    icon: '🐈',
    title: 'Pet / Domestic Distraction Incursion',
    description: 'A household pet or wandering roommate enters the room, looks at your panic-stricken face with deep pity, and sits on the space bar.',
    overthinkingDelta: -5,
    statDeltas: { resolve: 10, doom: -5, timeLostMinutes: 10 },
    flavor: 'Ten minutes of petting the animal provides more therapeutic grounding than 4 years of college counseling.',
  },
  {
    id: 'ev_wiki_blackhole',
    icon: '🌌',
    title: 'The Sudden Wikipedia Salt Trade Emergency',
    description: 'You click a footnote to verify an author name and 18 minutes later you are reviewing the dietary habits of Ottoman court eunuchs.',
    overthinkingDelta: 15,
    statDeltas: { overthinking: 15, timeLostMinutes: 20 },
    flavor: 'You are now cultured, erudite, and failing this class.',
  },
];

// ==========================================
// MAKE IT WORSE COMPLICATIONS POOL
// ==========================================
export const SYLLABUS_MAKE_WORSE_POOL: string[] = [
  'Your laptop battery drops to 7% and the charger is located beneath a sleeping roommate.',
  'Professor Henderson posts an announcement: "Remember that spelling counts for 20% of your grade."',
  'Your study playlist transitions without warning into Gregorian chants of apocalyptic sorrow.',
  'You realize Chapter 6 is written entirely in British English, introducing confusion over the letter \'u\'.',
  'The group chat has fractured into two warring factions debating whether question 2 is multiple choice.',
  'Your desk chair begins to emit an ominous squeak that resonates at the exact frequency of your anxiety.',
  'A sudden draft blows through the window, fluttering your color-coded notes across the floor like dead leaves.',
  'You discover a forum post from 2016 stating that Henderson once caught someone using the word "utilize" and deducted 15 points.',
];
