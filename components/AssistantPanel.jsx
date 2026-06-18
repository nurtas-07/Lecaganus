import { Bot, Send } from "lucide-react";
import { recommend } from "../utils/recommendations.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function AssistantPanel({ profile, opportunities }) {
  const top = recommend(opportunities, profile, 2);
  return (
    <LiquidGlass className="assistant-panel">
      <div className="assistant-head">
        <Bot />
        <div>
          <strong>AI-ассистент</strong>
          <span>Mock logic + объяснимые теги</span>
        </div>
      </div>
      <p>По твоему профилю лучше начать с {top.map((item) => item.title).join(" и ")}. Причина: совпали интересы {profile.interests.slice(0, 3).join(", ")}.</p>
      <div className="assistant-input">
        <input placeholder="Спроси: что выбрать для поступления?" />
        <button><Send size={17} /></button>
      </div>
    </LiquidGlass>
  );
}
