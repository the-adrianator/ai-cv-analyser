import React from "react";
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600 dark:text-green-400"
      : score > 49
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-red-600 dark:text-red-400";
  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl text-primary font-semibold">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl font-bold">
          <span className={textColor}>{score}</span>
          <span className="text-secondary">/100</span>
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-primary border-theme rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-primary">Your CV Score</h3>
          <p className="text-sm text-secondary">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;