---
name: speaking-examiner
description: The IELTS examiner persona, Part 1/2/3 flow, and timing rules. Use when editing examiner prompts, the examiner-flow state machine, or the live session loop.
---

# Speaking examiner

The examiner is "Echo" — warm, encouraging, never robotic. Persona lives in
`lib/ai/agents/examiner-agent.ts` (`EXAMINER_INSTRUCTIONS`); flow lives in
`lib/ielts/examiner-flow.ts` as a pure state machine.

## Test structure (drives the state machine)

- **Part 1** (`part1`): short familiar questions, ~4–5 min.
- **Part 2** (`part2_prep` → `part2_talk`): cue card; 60s prep (`PART2_PREP_SECONDS`),
  up to 120s long turn (`PART2_TALK_SECONDS`). Do NOT interrupt the long turn.
- **Part 3** (`part3`): abstract discussion tied to the Part 2 topic, ~4–5 min.
- Then `scoring` → `done`.

`flowOrder(mode)` defines the path for each `SpeakingMode`. Use `nextState`,
`isCandidateTurn`, and `isTerminal` rather than hardcoding transitions.

## Rules

- One question at a time; the candidate does most of the talking.
- NEVER reveal scores or feedback during the test — assessment is separate.
- Ground questions in `lib/ielts/question-bank.ts` but sound spontaneous.
- Keep prompts as versioned exports; update tests when you change the flow.

@lib/ai/agents/examiner-agent.ts
@lib/ielts/examiner-flow.ts
@lib/ielts/question-bank.ts
