# 🧠⚔️ OVERTHINKING RPG

> **Turn your tiniest problems into unnecessarily epic quests.**

Built for the **Crazy-App Concept Contest**.

---

## 🎮 What is Overthinking RPG?

**OVERTHINKING RPG** is a satirical interactive fantasy quest generator that takes mundane real-world chores (sending an email, cleaning a room, replying to a message, studying for an exam) and hilariously magnifies them into high-stakes psychological battles.

### ✨ Key Features & Mechanics

1. **Instant 5-Second Comprehension**:
   - Zero login, zero onboarding, zero setup.
   - Enter any problem or click a preset chip ("Too lazy to think of a problem?").
   - Click `[ ⚔️ TURN IT INTO A QUEST ]`.

2. **Contextual Quest & Boss Engine**:
   - Detects categories automatically via keywords: Academic, Email, Messaging, Cleaning, Sleep, Calling, Decisions, General, and Nonsense fallback ("asdfghjkl" -> *The Quest of Absolutely Nothing*).
   - Generates absurd bosses with impossible HP (*The Send Button HP: ∞*, *Tone Anxiety HP: 500*, *The Chair of Clothes HP: 1200*).
   - Funny inventory with stat modifiers (*Phone: +100 Distraction, -47 Productivity*, *Common Sense: x0*).

3. **The Overthinking Meter**:
   - Visual progress bar reacting in real-time to your choices.
   - At 100%+: `🚨 CRITICAL OVERTHINKING 🚨 You have successfully transformed a 30-second task into a psychological saga.`

4. **"🔥 MAKE IT WORSE" Escalation Button**:
   - One-click complication generator that stacks hilarious catastrophe vectors and drives up the overthinking meter.

5. **Random Events**:
   - Mid-stage surprises: *"Your phone vibrates: It was nothing. Just a 15% off coupon from an app you haven't used in 3 years."*

6. **Final Boss Showdown**:
   - Face off against the ultimate confrontation (*The Send Button*, *The Green Call Button*, etc.).
   - Visual screen-shake, sound synthesis, and `⚡ CRITICAL HIT` execution.

7. **Final Overthinking Audit & Reality Check**:
   - Funny deterministic statistics (Time Wasted, Reality Distortion, Productivity).
   - Unlocked achievement badges and confetti celebration.
   - `[ 🧘 REALITY CHECK ]`: *"You could have just done the thing. The actual problem was: [problem]. That's it."*
   - `[ ⚔️ NEW QUEST ]`: Instant replay without page reloads.

8. **Zero External Dependencies / Offline Ready**:
   - Built-in Web Audio API synthesizer for retro 8-bit sound effects (toggleable via `🔊 / 🔇`).
   - 100% client-side: no external API keys or backends required.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🌐 1-Click Deployment Options

The production build is in `./dist`. You can deploy it to any static host in seconds:

### Option A: Vercel
```bash
npx vercel ./dist --prod
```

### Option B: Netlify
```bash
npx netlify deploy --dir=dist --prod
```

### Option C: Surge
```bash
npx surge ./dist --domain overthinking-rpg.surge.sh
```

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Vanilla CSS Design Tokens (Dark Fantasy Glassmorphism, Responsive CSS Grid/Flexbox)
- **Audio**: Web Audio API Sound Synthesizer (Zero asset latency)
- **Icons**: Lucide React
- **Celebration**: Canvas Confetti
