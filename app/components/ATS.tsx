import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass =
    score > 69
      ? "from-green-100 dark:from-green-900/40"
      : score > 49
      ? "from-yellow-100 dark:from-yellow-900/40"
      : "from-red-100 dark:from-red-900/40";

  // Determine icon based on score
  const iconSrc =
    score > 69
      ? "/icons/ats-good.svg"
      : score > 49
      ? "/icons/ats-warning.svg"
      : "/icons/ats-bad.svg";

  // Determine subtitle based on score
  const subtitle =
    score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} to-primary border-theme rounded-2xl shadow-md p-6 w-full`}
    >
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Status" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold text-primary">
            ATS Score - {score}/100
          </h2>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Applicant Tracking System Compatibility - {subtitle}
        </h3>
        <p className="text-secondary mb-4">
          This score represents how well your CV is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3">
            <img
              src={
                suggestion.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              alt={suggestion.type === "good" ? "Good" : "Improve"}
              className="w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <p className="text-md text-primary leading-relaxed font-medium">
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Closing Encouragement */}
      <div className="border-t border-theme pt-4">
        <p className="text-sm text-secondary italic">
          Keep improving your CV to increase your chances of getting noticed by
          recruiters and passing through automated screening systems.
        </p>
      </div>
    </div>
  );
};

export default ATS;
