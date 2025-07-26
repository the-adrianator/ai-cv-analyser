import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import CVCard from "~/components/CVCard";
import { resumes } from "../../constants";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Engine" },
    { name: "description", content: "Smart feedback for your CV" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [fetchedCVs, setFetchedCVs] = useState<Resume[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadCVs = async () => {
      setLoadingCVs(true);
      const cvs = (await kv.list("CV:*", true)) as KVItem[];
      const parsedCVs = cvs?.map((cv) => JSON.parse(cv.value) as Resume);
      console.log("parsedCVs", parsedCVs);
      setFetchedCVs(parsedCVs || []);
      setLoadingCVs(false);
    };
    loadCVs();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>
            Track Your Applications &<br className="max-sm:hidden" /> CV Ratings
          </h1>
          {!loadingCVs && fetchedCVs?.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-4">
              <h2>No CVs found. Upload your first CV to get started.</h2>
              <Link
                to="/upload"
                className="primary-button w-fit text-xl font-semibold"
              >
                Upload CV
              </Link>
            </div>
          ) : (
            <h2>Review your submissions and get AI-powered feedback.</h2>
          )}
        </div>

        {loadingCVs && (
          <div className="flex flex-col justify-center items-center">
            <img
              src="/images/resume-scan-2.gif"
              className="w-[200px] max-sm:w-[100px]"
            />
          </div>
        )}

        {!loadingCVs && fetchedCVs.length > 0 ? (
          <div className="resumes-section mx-auto">
            {fetchedCVs.map((resume: Resume) => (
              <CVCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          resumes.length > 0 && (
            <div className="resumes-section mx-auto">
              {resumes.map((resume: Resume) => (
                <CVCard key={resume.id} resume={resume} />
              ))}
            </div>
          )
        )}
      </section>
    </main>
  );
}
