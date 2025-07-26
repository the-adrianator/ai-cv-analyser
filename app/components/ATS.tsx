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
  // Determine gradient background based on score
  let gradientClass = "";
  let iconSrc = "";

  if (score > 69) {
    gradientClass = "from-green-100";
    iconSrc = "/icons/ats-good.svg";
  } else if (score > 49) {
    gradientClass = "from-yellow-100";
    iconSrc = "/icons/ats-warning.svg";
  } else {
    gradientClass = "from-red-100";
    iconSrc = "/icons/ats-bad.svg";
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} to-white rounded-2xl shadow-md p-6 w-full`}
    >
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Status" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            ATS Score - {score}/100
          </h2>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Applicant Tracking System Compatibility
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your CV was scanned like an employer would. Here's how it performed.
        </p>
      </div>

      {/* Suggestions List */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Key Areas:</h4>
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
              <p className="text-sm text-gray-700 leading-relaxed">
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Encouragement */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 italic">
          Keep improving your CV to increase your chances of getting noticed by
          recruiters and passing through automated screening systems.
        </p>
      </div>
    </div>
  );
};

export default ATS;
