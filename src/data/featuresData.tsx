import { PiTargetLight } from "react-icons/pi";
import { BsLightningCharge, BsGraphUp, BsBook } from "react-icons/bs";

import type { FeatureCard } from "../interfaces/index";

export const cards: FeatureCard[] = [
  {
    icon: <PiTargetLight />,
    title: "AI Summaries",
    desc: "Instantly turn study materials into clear, simple summaries.",
    num: "01",
  },
  {
    icon: <BsLightningCharge />,
    title: "Smart Quizzes",
    desc: "Generate interactive quizzes to test your understanding.",
    num: "02",
  },
  {
    icon: <BsGraphUp />,
    title: "Progress Tracking",
    desc: "Follow your learning progress across all subjects.",
    num: "03",
  },
  {
    icon: <BsBook />,
    title: "Study Plan",
    desc: "Get personalized study recommendations powered by AI.",
    num: "04",
  },
];