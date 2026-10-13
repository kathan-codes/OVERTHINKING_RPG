import {
  generateQuest,
  createUnfinishedSyllabusQuest,
} from './src/engine/questGenerator';

import {
  SYLLABUS_SCENES,
  SYLLABUS_ITEMS,
  SYLLABUS_BOSS_DATA,
  SYLLABUS_ENDINGS,
} from './src/engine/syllabusQuestData';

import {
  createInitialSyllabusState,
  executeSceneChoice,
  applyInventoryItem,
  executeBossAction,
  evaluateEnding,
  calculateSyllabusFinalStats,
  isChoiceAvailable,
  isBossActionAvailable,
} from './src/engine/questEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  }
}

console.log('===========================================================');
console.log('🧪 OVERTHINKING RPG 2.0 — COMPREHENSIVE TEST SUITE');
console.log('===========================================================');

// -------------------------------------------------------------
// TEST 1: Quest Generation & Stages Population
// -------------------------------------------------------------
console.log('\n--- TEST 1: Quest Data Integrity & Non-Empty Stages ---');
const syllabusQuest = createUnfinishedSyllabusQuest();
assert(syllabusQuest.isDeepQuest === true, 'Syllabus quest must be marked as isDeepQuest');
assert(syllabusQuest.title === 'THE UNFINISHED SYLLABUS', 'Title must match');
assert(syllabusQuest.stages.length > 0, `Stages array must not be empty! Got: ${syllabusQuest.stages.length}`);
assert(syllabusQuest.stages.length === 8, `Stages array should contain 8 canonical stages. Got: ${syllabusQuest.stages.length}`);
assert(syllabusQuest.stages[0].choices.length > 0, 'Stage 1 must have choices!');
assert(syllabusQuest.stages[0].title === 'The Untouched Syllabus at 11:15 PM', 'Stage 1 title must match scene 1');
console.log(`✅ [PASS] createUnfinishedSyllabusQuest has ${syllabusQuest.stages.length} populated stages with choices.`);

// Test generator routing
const routedSyllabus1 = generateQuest('The Unfinished Syllabus');
assert(routedSyllabus1.isDeepQuest === true, 'Routed syllabus must be deep quest');
const generalAcademic = generateQuest("I need to study for tomorrow's exam.");
assert(generalAcademic.isDeepQuest === false, 'Everyday academic problem must generate general quest');
assert(generalAcademic.category === 'academic', 'Category must be academic');
assert(generalAcademic.stages.length >= 7, 'General academic quest must have full stages');

// Test legacy categories remain intact
const legacyEmail = generateQuest('I need to email my professor.');
assert(legacyEmail.isDeepQuest === false, 'Email quest must remain legacy');
assert(legacyEmail.stages.length > 0, 'Legacy email must have stages');
assert(legacyEmail.stages[0].choices.length > 0, 'Legacy email stage 1 must have choices');

const legacyCleaning = generateQuest('I have to clean my room.');
assert(legacyCleaning.isDeepQuest === false, 'Cleaning quest must remain legacy');
assert(legacyCleaning.stages.length > 0, 'Legacy cleaning must have stages');
console.log('✅ [PASS] Quest generator routes correctly without breaking legacy quests.');

// -------------------------------------------------------------
// TEST 2: First Scene Encounter & Choices
// -------------------------------------------------------------
console.log('\n--- TEST 2: Starting Scene act1_spark Options ---');
const startScene = SYLLABUS_SCENES['act1_spark'];
assert(!!startScene, 'act1_spark scene must exist in SYLLABUS_SCENES');
assert(startScene.choices.length === 4, 'act1_spark must have 4 distinct choices');
const initialState = createInitialSyllabusState();

startScene.choices.forEach((choice, idx) => {
  const avail = isChoiceAvailable(choice, initialState);
  assert(avail.available, `Choice #${idx + 1} (${choice.title}) should be available initially`);
  assert(!!choice.consequence, `Choice #${idx + 1} must have handwritten consequence`);
  assert(!!choice.nextSceneId, `Choice #${idx + 1} must have nextSceneId`);
});
console.log(`✅ [PASS] All 4 starting choices in act1_spark are valid and available.`);

// -------------------------------------------------------------
// TEST 3: Scenario Run A — The Decisive Student (Accidental Adult)
// -------------------------------------------------------------
console.log('\n--- TEST 3: Run A — The Decisive Student (Target: Accidental Adult) ---');
let stateA = createInitialSyllabusState();
let decisionsA = 0;

// Choice 1: Open Chapter 1 and read sentence 1
let sc = SYLLABUS_SCENES[stateA.currentSceneId];
let ch = sc.choices.find((c) => c.id === 'c_spark_direct')!;
let res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act1_first_page', 'Should route to act1_first_page');

// Choice 2: Skip preamble and hunt for actionable bullet points
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_fp_powerthrough')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act1_desk_ritual', 'Should route to act1_desk_ritual');

// Choice 3: Forearm sweep the clutter aside
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_dr_ignore')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act2_ancient_notes', 'Should route to act2_ancient_notes');

// Choice 4: Discard old notebook and rely on textbook
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_an_burnnotes')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act2_video_rabbit_hole', 'Should route to act2_video_rabbit_hole');

// Choice 5: Watch the Indian tutor at 1.75x speed
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_vr_legend')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act2_cursed_notification', 'Should route to act2_cursed_notification');

// Choice 6: Check portal announcement yourself
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_cn_verify')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act2_pomodoro_paradox', 'Should route to act2_pomodoro_paradox');

// Choice 7: Stare down impulse and finish pomodoro
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_pp_resist')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(stateA.currentSceneId === 'act2_bureaucratic_wall', 'Should route to act2_bureaucratic_wall');

// Choice 8: Synthesize everything and prepare for battle
sc = SYLLABUS_SCENES[stateA.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_bw_synthesize')!;
res = executeSceneChoice(sc, ch, stateA);
stateA = res.nextState;
decisionsA++;
assert(res.reachedBoss === true, 'Should reach boss encounter!');

// BOSS PHASE 1
const phase1 = SYLLABUS_BOSS_DATA.phases[stateA.bossPhaseIndex];
let bossAct = phase1.actions.find((a) => a.id === 'b1_speedread')!;
let bRes = executeBossAction(bossAct, phase1, stateA);
stateA = bRes.nextState;
decisionsA++;

// Finish Phase 1
bossAct = phase1.actions.find((a) => a.id === 'b1_skimanalyze')!;
bRes = executeBossAction(bossAct, phase1, stateA);
stateA = bRes.nextState;
bossAct = phase1.actions.find((a) => a.id === 'b1_speedread')!;
bRes = executeBossAction(bossAct, phase1, stateA);
stateA = bRes.nextState;
assert(stateA.bossPhaseIndex === 1, `Should advance to Boss Phase 2! Current: ${stateA.bossPhaseIndex}`);

// BOSS PHASE 2
const phase2 = SYLLABUS_BOSS_DATA.phases[stateA.bossPhaseIndex];
bossAct = phase2.actions.find((a) => a.id === 'b2_pomodoro_strike')!;
bRes = executeBossAction(bossAct, phase2, stateA);
stateA = bRes.nextState;
decisionsA++;
bossAct = phase2.actions.find((a) => a.id === 'b2_expose_contradiction')!;
bRes = executeBossAction(bossAct, phase2, stateA);
stateA = bRes.nextState;
bossAct = phase2.actions.find((a) => a.id === 'b2_sacrificial_summary')!;
bRes = executeBossAction(bossAct, phase2, stateA);
stateA = bRes.nextState;
assert(stateA.bossPhaseIndex === 2, `Should advance to Boss Phase 3! Current: ${stateA.bossPhaseIndex}`);

// BOSS PHASE 3
const phase3 = SYLLABUS_BOSS_DATA.phases[stateA.bossPhaseIndex];
bossAct = phase3.actions.find((a) => a.id === 'b3_master_synthesis')!;
bRes = executeBossAction(bossAct, phase3, stateA);
stateA = bRes.nextState;
decisionsA++;
bossAct = phase3.actions.find((a) => a.id === 'b3_master_synthesis')!;
bRes = executeBossAction(bossAct, phase3, stateA);
stateA = bRes.nextState;

assert(bRes.bossDefeated === true, 'Boss must be defeated in Phase 3!');
assert(stateA.evaluatedEnding !== null, 'Ending must be evaluated!');
assert(stateA.evaluatedEnding.archetype === 'accidental_adult', `Expected Accidental Adult, got: ${stateA.evaluatedEnding.archetype}`);
assert(decisionsA >= 10, `Run A must have 10-12+ decisions! Got: ${decisionsA}`);
console.log(`✅ [PASS] Run A completed with ${decisionsA} decisions! Ending: ${stateA.evaluatedEnding.archetypeTitle}`);

// -------------------------------------------------------------
// TEST 4: Scenario Run B — The Chronic Overpreparer (Eternal Preparation)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Run B — The Chronic Overpreparer (Target: Eternal Preparation) ---');
let stateB = createInitialSyllabusState();
let decisionsB = 0;

// Choice 1: Design Study Timetable
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_spark_timetable')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;
assert(stateB.flags.has('crafted_study_plan'), 'Flag crafted_study_plan must be set');
assert(stateB.currentSceneId === 'act1_color_citadel', 'Should route to act1_color_citadel');

// Choice 2: Recalibrate the schedule
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_cc_recalibrate')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;
assert(stateB.currentSceneId === 'act1_desk_ritual', 'Should route to act1_desk_ritual');

// Choice 3: 20-minute desk purification
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_dr_clean')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Choice 4: Decipher handwriting
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_an_decipher')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Choice 5: Read comments
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_vr_speedrun')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Choice 6: Check portal
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_cn_verify')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Choice 7: 15 mins finding lo-fi playlist
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_pp_music')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Choice 8: Synthesize for battle
sc = SYLLABUS_SCENES[stateB.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_bw_synthesize')!;
res = executeSceneChoice(sc, ch, stateB);
stateB = res.nextState;
decisionsB++;

// Defeat boss phases
let p1 = SYLLABUS_BOSS_DATA.phases[stateB.bossPhaseIndex];
let a1 = p1.actions.find((a) => a.id === 'b1_highlighter') || p1.actions[0];
stateB = executeBossAction(a1, p1, stateB).nextState;
stateB = executeBossAction(p1.actions[0], p1, stateB).nextState;
stateB = executeBossAction(p1.actions[0], p1, stateB).nextState;

// In Phase 2: verify turning study plan against boss!
let p2 = SYLLABUS_BOSS_DATA.phases[stateB.bossPhaseIndex];
let planWeaponAction = p2.actions.find((a) => a.id === 'b2_plan_weapon')!;
let checkPlanAvail = isBossActionAvailable(planWeaponAction, stateB);
assert(checkPlanAvail.available === true, 'Turn Study Plan against boss must be available!');
stateB = executeBossAction(planWeaponAction, p2, stateB).nextState;
decisionsB++;
assert(stateB.flags.has('used_plan_against_boss'), 'Flag used_plan_against_boss must be set');
stateB = executeBossAction(p2.actions[1], p2, stateB).nextState;
stateB = executeBossAction(p2.actions[1], p2, stateB).nextState;

// Phase 3
let p3 = SYLLABUS_BOSS_DATA.phases[stateB.bossPhaseIndex];
stateB = executeBossAction(p3.actions.find((a) => a.id === 'b3_desperate_bullet')!, p3, stateB).nextState;
decisionsB++;
stateB = executeBossAction(p3.actions.find((a) => a.id === 'b3_desperate_bullet')!, p3, stateB).nextState;
let finalB = executeBossAction(p3.actions.find((a) => a.id === 'b3_desperate_bullet')!, p3, stateB);
stateB = finalB.nextState;

assert(stateB.evaluatedEnding !== null, 'Ending must be evaluated');
assert(stateB.evaluatedEnding.archetype === 'eternal_preparation', `Expected Eternal Preparation, got: ${stateB.evaluatedEnding.archetype}`);
console.log(`✅ [PASS] Run B completed with ${decisionsB} decisions! Ending: ${stateB.evaluatedEnding.archetypeTitle}`);

// -------------------------------------------------------------
// TEST 5: Scenario Run C — The Supreme Catastrophizer
// -------------------------------------------------------------
console.log('\n--- TEST 5: Run C — The Supreme Catastrophizer ---');
let stateC = createInitialSyllabusState();
sc = SYLLABUS_SCENES[stateC.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_spark_forum')!;
stateC = executeSceneChoice(sc, ch, stateC).nextState;

sc = SYLLABUS_SCENES[stateC.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_fd_spiral')!;
stateC = executeSceneChoice(sc, ch, stateC).nextState;

assert(stateC.stats.doom >= 50, `Doom must be elevated! Got: ${stateC.stats.doom}`);
const endingC = evaluateEnding(stateC);
assert(endingC.archetype === 'supreme_catastrophizer', `Expected Supreme Catastrophizer, got: ${endingC.archetype}`);
console.log(`✅ [PASS] Run C evaluated to: ${endingC.archetypeTitle}`);

// -------------------------------------------------------------
// TEST 6: Scenario Run D — The Unreasonable Success
// -------------------------------------------------------------
console.log('\n--- TEST 6: Run D — The Unreasonable Success ---');
let stateD = createInitialSyllabusState();
sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_spark_dawn')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_dp_coffee')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_dr_ignore')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_an_cube')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_vr_trebuchet')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_cn_bluff')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_pp_snack')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

sc = SYLLABUS_SCENES[stateD.currentSceneId];
ch = sc.choices.find((c) => c.id === 'c_bw_bs')!;
stateD = executeSceneChoice(sc, ch, stateD).nextState;

const endingD = evaluateEnding(stateD);
assert(endingD.archetype === 'unreasonable_success', `Expected Unreasonable Success, got: ${endingD.archetype}`);
console.log(`✅ [PASS] Run D evaluated to: ${endingD.archetypeTitle}`);

// -------------------------------------------------------------
// TEST 7: Inventory Usage & Consumables
// -------------------------------------------------------------
console.log('\n--- TEST 7: Functional Inventory Usage ---');
let stateInv = createInitialSyllabusState();
const itemToUse = stateInv.inventory[1]; // Potion of False Confidence
assert(itemToUse.used === false, 'Item should be unused initially');
const prevResolve = stateInv.stats.resolve;
const afterInvState = applyInventoryItem(itemToUse, stateInv);
assert(afterInvState.inventory[1].used === true, 'Item must be marked used');
assert(afterInvState.stats.resolve > prevResolve, 'Resolve must increase after drinking false confidence');
console.log(`✅ [PASS] Item applied correctly. Resolve increased from ${prevResolve} to ${afterInvState.stats.resolve}.`);

console.log('\n===========================================================');
console.log('🎉 ALL COMPREHENSIVE TESTS PASSED FLAWLESSLY!');
console.log('===========================================================');
