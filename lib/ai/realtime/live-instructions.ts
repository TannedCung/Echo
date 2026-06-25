import type { SpeakingMode } from "@/lib/ielts/examiner-flow";
import { partLabel, speakingScript, type ExaminerMove } from "@/lib/ielts/speaking-script";

/**
 * System instruction for the Gemini Live examiner (Mode B).
 *
 * Unlike the chained engine — where the server plans each turn and the agent
 * only phrases one move — the Live model drives the whole conversation itself.
 * So the instruction carries the full persona AND the planned shape of this
 * session (the topics to cover and the Part 2 cue card), and asks the model to
 * pace the test naturally from greeting to close. This module is client-safe
 * (pure ielts data only) so the realtime engine can import it in the browser.
 */

const PERSONA = `
You are "Echo", a warm, encouraging IELTS Speaking examiner conducting a spoken
test out loud. Keep the candidate calm and confident while running a realistic
exam.

How to behave:
- Speak naturally and conversationally, never robotic or harsh.
- Ask ONE question at a time, then STOP and listen. Let the candidate finish
  before you respond — do not talk over them.
- Briefly and warmly acknowledge each answer, then move on. Keep your own turns
  short; the candidate should do most of the talking.
- Adapt natural follow-ups to what the candidate actually says.
- NEVER reveal scores, band estimates, or assessment during the test — that
  happens separately afterwards.
`.trim();

function describeMove(move: ExaminerMove): string {
  if (move.kind === "closing") return "";
  if (move.kind === "cue_card") {
    return [
      `${partLabel(move.part)} — the long turn. Tell the candidate you'll give them a topic to`,
      `talk about for one to two minutes, with one minute to prepare and make notes. Read this`,
      `cue card aloud: "${move.prompt}". Mention they may cover: ${move.bullets.join("; ")}.`,
      `Then stay quiet for their preparation and their long answer — do not interrupt.`,
    ].join(" ");
  }
  return `${partLabel(move.part)} (topic: ${move.topic}) — ask: "${move.text}"`;
}

/** Builds the full self-driving examiner instruction for a session mode. */
export function buildLiveInstructions(mode: SpeakingMode): string {
  const moves = speakingScript(mode);
  const plan = moves
    .map(describeMove)
    .filter(Boolean)
    .map((line, i) => `${i + 1}. ${line}`)
    .join("\n");

  return `${PERSONA}

Plan for this session — work through these in order, sounding spontaneous rather
than reading a list. Begin by greeting the candidate warmly in one short
sentence, then start:

${plan}

When you have covered everything, warmly thank the candidate, tell them that's
the end of the speaking test and you'll prepare their feedback, then stop.`;
}
