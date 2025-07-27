import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { ThemeToggleCompact } from "~/components/ThemeToggle";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { ArrowBigLeftDash } from "lucide-react";

export const meta = () => {
  return [
    { title: "CV Engine - Review" },
    { name: "description", content: "Detailed review of your CV" },
  ];
};

const CV = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [cvUrl, setcvUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/cv/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadCV = async () => {
      const cv = await kv.get(`CV:${id}`);

      if (!cv) return;

      const data = JSON.parse(cv);

      const cvBlob = await fs.read(data.cvPath);
      if (!cvBlob) return;

      const pdfBlob = new Blob([cvBlob], { type: "application/pdf" });
      const cvUrl = URL.createObjectURL(pdfBlob);
      setcvUrl(cvUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);

      // console.log({
      //   cvUrl,
      //   imageUrl,
      //   feedback: data.feedback,
      // });
    };

    loadCV();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <ArrowBigLeftDash className="w-4 h-4" />

          <span className="text-primary text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggleCompact />
        </div>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && cvUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="CV"
                  className="w-full h-full object-contain rounded-2xl"
                  title="CV"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            CV review
          </h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img
                src="/images/resume-scan-2.gif"
                className="w-full max-w-md"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CV;
