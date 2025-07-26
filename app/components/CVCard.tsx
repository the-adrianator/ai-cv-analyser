import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const CVCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [cvUrl, setCVUrl] = useState("");
  const [loadingCV, setLoadingCV] = useState(false);

  useEffect(() => {
    const loadCVs = async () => {
      setLoadingCV(true);
      const blob = await fs.read(imagePath);
      if (!blob) {
        setCVUrl(imagePath);
        setLoadingCV(false);
        return;
      }

      const url = URL.createObjectURL(blob);
      setCVUrl(url);
      setLoadingCV(false);
    };

    loadCVs();
  }, [imagePath]);
  return (
    <Link
      to={`/cv/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h3 className="text-lg break-words text-gray-500">CV</h3>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img
            src={loadingCV ? "/images/resume-scan-2.gif" : cvUrl}
            alt="cv"
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
          />
        </div>
      </div>
    </Link>
  );
};

export default CVCard;
