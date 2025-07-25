import React, { useState } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;

    setIsProcessing(true);
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    console.log({ companyName, jobTitle, jobDescription, file });

    if (!companyName || !jobTitle || !jobDescription || !file) {
      setStatusText("Please fill in all fields and upload a CV");
      setIsProcessing(false);
      return;
    }
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart Feedback for Your CV</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Processing"
                className="w-full"
              />
            </>
          ) : (
            <h2>Upload your CV for an ATS score and improvement tips</h2>
          )}
        </div>
        {!isProcessing && (
          <form
            id="upload-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-8 max-w-2xl mx-auto"
          >
            <div className="form-div">
              <label htmlFor="company-name">Company name</label>
              <input
                type="text"
                id="company-name"
                name="company-name"
                placeholder="Enter company name"
              />
            </div>
            <div className="form-div">
              <label htmlFor="job-title">Job title</label>
              <input
                type="text"
                id="job-title"
                name="job-title"
                placeholder="Enter job title"
              />
            </div>
            <div className="form-div">
              <label htmlFor="job-description">Job description</label>
              <textarea
                rows={5}
                id="job-description"
                name="job-description"
                placeholder="Enter job description"
              />
            </div>
            <div className="form-div">
              <label htmlFor="uploader">Upload your CV</label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <button type="submit" className="primary-button">
              Analyse CV
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default upload;
