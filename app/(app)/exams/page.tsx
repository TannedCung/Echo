import { ExamManager } from "@/components/exams/exam-manager";

export const metadata = {
  title: "Exams — Echo Exam Library Management",
  description:
    "Manage, inspect, test, and browse exam sets across Speaking, Listening, Reading, and Writing.",
};

export default function ExamsPage() {
  return <ExamManager />;
}
