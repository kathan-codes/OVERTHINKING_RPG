import { generateQuest, createUnfinishedSyllabusQuest, detectCategory } from './src/engine/questGenerator';
import { SYLLABUS_SCENES, SYLLABUS_BOSS_DATA } from './src/engine/syllabusQuestData';
import {
  createInitialSyllabusState,
  executeSceneChoice,
  executeBossAction,
  evaluateEnding,
  isChoiceAvailable,
  isBossActionAvailable,
} from './src/engine/questEngine';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  }
}

console.log('===========================================================');
console.log('🧪 OVERTHINKING RPG — END-TO-END SCENARIO VERIFICATION');
console.log('===========================================================');

// -------------------------------------------------------------
// SCENARIO TEST A: Authored Campaign ("The Unfinished Syllabus")
// -------------------------------------------------------------
console.log('\n--- SCENARIO A: Authored Campaign Full Playthrough ---');
const syllabus = generateQuest('The Unfinished Syllabus');
assert(syllabus.isDeepQuest === true, 'Syllabus must be flagged as isDeepQuest');
assert(syllabus.title === 'THE UNFINISHED SYLLABUS', 'Title must be THE UNFINISHED SYLLABUS');
assert(syllabus.stages.length === 8, 'Syllabus must have 8 stages');

let state = createInitialSyllabusState();
let decisionsCount = 0;

// Choice 1: act1_spark -> Choice: c_spark_direct
let scene = SYLLABUS_SCENES[state.currentSceneId];
assert(scene.choices.length === 4, 'Opening scene act1_spark must have 4 choices');
let choice = scene.choices.find(c => c.id === 'c_spark_direct')!;
assert(isChoiceAvailable(choice, state).available, 'c_spark_direct must be available');
let result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act1_first_page', 'Must advance to act1_first_page');

// Choice 2: act1_first_page -> Choice: c_fp_powerthrough
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_fp_powerthrough')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act1_desk_ritual', 'Must advance to act1_desk_ritual');

// Choice 3: act1_desk_ritual -> Choice: c_dr_ignore
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_dr_ignore')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act2_ancient_notes', 'Must advance to act2_ancient_notes');

// Choice 4: act2_ancient_notes -> Choice: c_an_decipher
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_an_decipher')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act2_video_rabbit_hole', 'Must advance to act2_video_rabbit_hole');

// Choice 5: act2_video_rabbit_hole -> Choice: c_vr_legend
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_vr_legend')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act2_cursed_notification', 'Must advance to act2_cursed_notification');

// Choice 6: act2_cursed_notification -> Choice: c_cn_verify
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_cn_verify')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act2_pomodoro_paradox', 'Must advance to act2_pomodoro_paradox');

// Choice 7: act2_pomodoro_paradox -> Choice: c_pp_resist
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_pp_resist')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(state.currentSceneId === 'act2_bureaucratic_wall', 'Must advance to act2_bureaucratic_wall');

// Choice 8: act2_bureaucratic_wall -> Choice: c_bw_synthesize
scene = SYLLABUS_SCENES[state.currentSceneId];
choice = scene.choices.find(c => c.id === 'c_bw_synthesize')!;
result = executeSceneChoice(scene, choice, state);
state = result.nextState;
decisionsCount++;
assert(result.reachedBoss === true, 'Must reach Boss Battle from final act 2 scene');
console.log(`✅ Passed Act I & II: 8 narrative choices made smoothly.`);

// Boss Phase 1
let phase1 = SYLLABUS_BOSS_DATA.phases[0];
let bAction1 = phase1.actions.find(a => a.id === 'b1_speedread')!;
let bRes = executeBossAction(bAction1, phase1, state);
state = bRes.nextState;
decisionsCount++;
assert(state.bossCurrentHp === 62, 'Phase 1 HP should reduce from 100 to 62');

let bAction2 = phase1.actions.find(a => a.id === 'b1_skimanalyze')!;
bRes = executeBossAction(bAction2, phase1, state);
state = bRes.nextState;
decisionsCount++;
assert(state.bossCurrentHp === 32, 'Phase 1 HP should reduce to 32');

let bAction3 = phase1.actions.find(a => a.id === 'b1_false_confidence')!;
bRes = executeBossAction(bAction3, phase1, state);
state = bRes.nextState;
decisionsCount++;
assert(bRes.phaseAdvance === true, 'Phase 1 should be broken and advance to Phase 2');
assert(state.bossPhaseIndex === 1, 'Phase index should be 1');
assert(state.bossCurrentHp === 100, 'Phase 2 HP should reset to 100');
console.log(`✅ Boss Phase 1 cleared! Advanced to Phase 2.`);

// Boss Phase 2
let phase2 = SYLLABUS_BOSS_DATA.phases[1];
let bAction4 = phase2.actions.find(a => a.id === 'b2_expose_contradiction')!;
bRes = executeBossAction(bAction4, phase2, state);
state = bRes.nextState;
decisionsCount++;
assert(state.bossCurrentHp === 64, 'Phase 2 HP should reduce to 64');

let bAction5 = phase2.actions.find(a => a.id === 'b2_pomodoro_strike')!;
bRes = executeBossAction(bAction5, phase2, state);
state = bRes.nextState;
decisionsCount++;
assert(state.bossCurrentHp === 29, 'Phase 2 HP should reduce to 29');

let bAction6 = phase2.actions.find(a => a.id === 'b2_sacrificial_summary')!;
bRes = executeBossAction(bAction6, phase2, state);
state = bRes.nextState;
decisionsCount++;
assert(bRes.phaseAdvance === true, 'Phase 2 should advance to Phase 3');
assert(state.bossPhaseIndex === 2, 'Phase index should be 2');
console.log(`✅ Boss Phase 2 cleared! Advanced to Phase 3.`);

// Boss Phase 3
let phase3 = SYLLABUS_BOSS_DATA.phases[2];
let bAction7 = phase3.actions.find(a => a.id === 'b3_master_synthesis')!;
bRes = executeBossAction(bAction7, phase3, state);
state = bRes.nextState;
decisionsCount++;
assert(state.bossCurrentHp === 45, 'Phase 3 HP should reduce to 45');

let bAction8 = phase3.actions.find(a => a.id === 'b3_great_bluff')!;
bRes = executeBossAction(bAction8, phase3, state);
state = bRes.nextState;
decisionsCount++;
assert(bRes.bossDefeated === true, 'Boss must be defeated on lethal strike in Phase 3');
assert(state.bossCurrentHp === 0, 'Boss HP should be 0');
assert(!!state.evaluatedEnding, 'Final ending must be evaluated');
console.log(`✅ Boss Phase 3 cleared! Total decisions: ${decisionsCount} (Range: 8-15 target).`);
console.log(`✅ Ending Evaluated: "${state.evaluatedEnding?.title}" (${state.evaluatedEnding?.archetype})`);

// -------------------------------------------------------------
// SCENARIO TEST B: Custom Academic Problem ("I need to write an email to my professor.")
// -------------------------------------------------------------
console.log('\n--- SCENARIO B: Custom Email Problem ---');
const emailQuest = generateQuest('I need to write an email to my professor.');
assert(emailQuest.isDeepQuest === false, 'Must be general quest');
assert(emailQuest.category === 'email', 'Category must be email');
assert(emailQuest.originalProblem === 'I need to write an email to my professor.', 'Must retain original problem');
assert(emailQuest.stages.length === 7, 'Must generate 7 stages');
assert(emailQuest.stages[0].scenario.includes('professor') || emailQuest.stages[0].scenario.includes('email'), 'Scenario must reflect problem');
assert(emailQuest.stages[0].choices.length >= 3, 'Stage 1 must have at least 3 choices');
console.log(`✅ Custom email quest created with 7 stages and problem context retained.`);

// -------------------------------------------------------------
// SCENARIO TEST C: Other Everyday Problems
// -------------------------------------------------------------
console.log('\n--- SCENARIO C: Other Everyday Problems ---');
const msgQuest = generateQuest('I need to reply to a message.');
assert(msgQuest.category === 'messaging', 'Category must be messaging');
assert(msgQuest.stages.length === 7, 'Must have 7 stages');

const cleanQuest = generateQuest('I need to clean my room.');
assert(cleanQuest.category === 'cleaning', 'Category must be cleaning');
assert(cleanQuest.stages.length === 7, 'Must have 7 stages');

const examQuest = generateQuest('I have an exam tomorrow.');
assert(examQuest.category === 'academic', 'Category must be academic');
assert(examQuest.stages.length === 7, 'Must have 7 stages');

const callQuest = generateQuest('I need to make an important phone call.');
assert(callQuest.category === 'calling', 'Category must be calling');
assert(callQuest.stages.length === 7, 'Must have 7 stages');

const decisionQuest = generateQuest('I need to choose between two options.');
assert(decisionQuest.category === 'decision', 'Category must be decision');
assert(decisionQuest.stages.length === 7, 'Must have 7 stages');

const customUnusual = generateQuest('My cat is staring at me judgmentally and I feel guilty.');
assert(customUnusual.category === 'general', 'Category must fallback to general');
assert(customUnusual.stages.length === 7, 'Must have 7 stages');
assert(customUnusual.stages[0].choices.length >= 3, 'Must have valid choices');
assert(!customUnusual.stages[0].title.includes('Unknown Encounter'), 'Must NOT show Unknown Encounter');
console.log(`✅ All everyday problems and unusual inputs generate valid 7-stage quests.`);

// -------------------------------------------------------------
// SCENARIO TEST D: Navigation & Campaign Preservation
// -------------------------------------------------------------
console.log('\n--- SCENARIO D: Navigation & Campaign Accessibility ---');
// Verify authored quest remains available through explicit campaign title
const authoredQuest = generateQuest('The Unfinished Syllabus');
assert(authoredQuest.isDeepQuest === true, 'Authored campaign remains accessible');
assert(authoredQuest.finalBoss.name === 'THE GUARDIAN OF THE UNFINISHED SYLLABUS', 'Has multi-phase Guardian');
console.log(`✅ Authored campaign remains fully preserved and accessible.`);

console.log('\n===========================================================');
console.log('🎉 ALL END-TO-END SCENARIO TESTS PASSED PERFECTLY!');
console.log('===========================================================');
