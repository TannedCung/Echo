import { BookOpen, Headphones, Mic, PenLine, type LucideIcon } from "lucide-react";

export interface PracticeSkill {
  id: "speaking" | "writing" | "reading" | "listening";
  label: string;
  href: string;
  icon: LucideIcon;
  /** Warm one-line description for the practice hub and dashboard. */
  blurb: string;
  /** How the paper is scored, shown as a small hint. */
  scoring: string;
  tint: "primary" | "accent" | "success" | "warning";
}

/**
 * The four IELTS papers Echo covers. Single source of truth for the practice hub
 * and the dashboard grid, so every entry point offers the full test.
 */
export const PRACTICE_SKILLS: PracticeSkill[] = [
  {
    id: "speaking",
    label: "Speaking",
    href: "/practice/speaking",
    icon: Mic,
    blurb: "Talk with a friendly examiner through Parts 1–3.",
    scoring: "Scored live on the four Speaking criteria",
    tint: "primary",
  },
  {
    id: "writing",
    label: "Writing",
    href: "/practice/writing",
    icon: PenLine,
    blurb: "Respond to Task 1 and Task 2 prompts in your own words.",
    scoring: "Scored on the four Writing criteria",
    tint: "accent",
  },
  {
    id: "reading",
    label: "Reading",
    href: "/practice/reading",
    icon: BookOpen,
    blurb: "Read a passage and answer exam-style questions.",
    scoring: "Marked to a band from the raw score",
    tint: "success",
  },
  {
    id: "listening",
    label: "Listening",
    href: "/practice/listening",
    icon: Headphones,
    blurb: "Listen to a recording and answer as you go.",
    scoring: "Marked to a band from the raw score",
    tint: "warning",
  },
];
