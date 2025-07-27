import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeStyle = "";
  let label = "";

  if (score > 69) {
    badgeStyle = "score-badge green";
    label = "Strong";
  } else if (score > 49) {
    badgeStyle = "score-badge yellow";
    label = "Good Start";
  } else {
    badgeStyle = "score-badge red";
    label = "Needs Work";
  }

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300 ${badgeStyle}`}
    >
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
