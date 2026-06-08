export interface InfoBlock {
  title: string;
  body: string;
}

export interface FwStep {
  icon: string;
  text: string;
}

export interface FwBox {
  title: string;
  steps: FwStep[];
}

export interface Callout {
  type: "tip" | "example" | "warn" | "case";
  title: string;
  body: string;
}

export interface CodeBlock {
  header: string;
  tag: string;
  body: string;
}

export interface TimelineItem {
  year: string;
  text: string;
}

export interface ChecklistItem {
  text: string;
}

export interface Assignment {
  title: string;
  tasks: string[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface LessonBlock {
  num: string;
  title: string;
  body: string[];
  fwBox?: FwBox;
  callouts?: Callout[];
  subsections?: { title: string; body: string[] }[];
}

export interface ColorCard {
  swatch: string;
  name: string;
  meaning: string;
  bgBg: string;
  borderBg: string;
  textColor: string;
}

export interface RoadCard {
  phase: string;
  title: string;
  list: string;
}

export interface ResCard {
  icon: string;
  name: string;
  desc: string;
}

export interface AcademyPage {
  idx: number;
  badge: string;
  menuLabel: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stats?: { number: string; label: string }[];
  infoBox?: InfoBlock;
  letter?: { greeting: string; body: string[]; sig: string };
  timeline?: TimelineItem[];
  lessons?: LessonBlock[];
  assignment?: Assignment;
  quiz?: Quiz;
  checklist?: ChecklistItem[];
  colorGrid?: ColorCard[];
  roadmapGrid?: RoadCard[];
  resourceGrid?: ResCard[];
  kronBox?: { label: string; title: string; body: string };
}
