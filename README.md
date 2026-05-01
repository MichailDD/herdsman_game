# Herdsman

A small browser game where you click to move a hero around a field, gather animals into a group, and walk them into a yard to score points.

Built as a prototype assignment. The focus was on clean code structure rather than visuals, so everything is drawn with basic PixiJS shapes — no external assets.

## Tech Stack

- TypeScript
- PixiJS
- Vite

I picked PixiJS because it was listed as the preferred option and it fits well here — it handles rendering and the game loop without pulling in a full framework. Vite is just for the dev server and bundling, nothing fancy.

## Getting Started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run typecheck   # type check without building
npm run build       # typecheck + build
```

## What's Implemented (AC)

- Green game field with a red hero circle
- White animal circles spawned at random positions in random quantity
- Yellow yard in the bottom-right corner
- Score counter in the top UI
- Click-to-move: hero walks to wherever you click
- Animals join the hero when he gets close — up to 5 at a time
- Animals that reach the yard are counted as delivered and score goes up

## Optional AC

Spawn generator and patrol behavior were skipped intentionally. I wanted to keep the submission clean and reviewable rather than rush two more features in.

## Extra things I added

- 3-second countdown before the round starts
- Timer and click counter in the UI (just felt like useful debug/play info)
- Pause and resume button
- Restart button
- Win screen with final stats when all animals are delivered
- Responsive scaling — works on mobile and small screens too
- Rules overlay — click "Rules" to open a paytable-style how-to-play screen; the game pauses automatically and resumes when closed

## Project Structure

```
entities/   Hero, Animal, Yard — each owns its own visuals and behavior
game/       App bootstrap, main scene, shared config constants
ui/         Score, timer, buttons — display only, no game logic
utils/      Small math helpers used in multiple places
```

I kept things simple on purpose. `GameScene` handles orchestration, each entity handles itself. If this grew into a larger game I'd split out separate systems for input, movement, spawning etc. — the folder structure already points in that direction.

## A few notes on the code

- State pattern for animals (`idle → following → delivered`) and for the game itself (`countdown → playing → paused → completed`)
- All magic numbers live in `GameConfig` so they're easy to find and tweak
- Movement is frame-rate independent — everything uses `deltaSeconds` so it runs the same on 30fps and 120fps
- UI buttons call `stopPropagation()` so clicking a button doesn't also move the hero
- TypeScript strict mode is on

## Code Style

- Strict TypeScript throughout
- No React, Vue, or any UI framework
- No external image assets — all graphics generated via `PixiJS Graphics`
