import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import CVCard from "~/components/CVCard";
import { resumes } from "../../constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Engine" },
    { name: "description", content: "Smart feedback for your CV" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>
            Track Your Applications &<br className="max-sm:hidden" /> CV Ratings
          </h1>
          <h2>Review your submissions and get AI-powered feedback.</h2>
        </div>
      </section>

      {resumes.length > 0 && (
        <div className="resumes-section mx-auto">
          {resumes.map((resume: Resume) => (
            <CVCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
