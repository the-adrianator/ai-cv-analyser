import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeStyle = "";
  let label = "";

  if (score > 70) {
    badgeStyle = "bg-green-100 text-green-600 border-green-200";
    label = "Strong";
  } else if (score > 49) {
    badgeStyle = "bg-yellow-100 text-yellow-600 border-yellow-200";
    label = "Good Start";
  } else {
    badgeStyle = "bg-red-100 text-red-600 border-red-200";
    label = "Needs Work";
  }

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}
    >
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
