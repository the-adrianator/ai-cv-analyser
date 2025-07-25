import { prepareInstructions } from "constants";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyse = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading your CV...");

    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Failed to upload your CV");

    setStatusText("Converting your CV to image...");
    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file)
      return setStatusText("Failed to convert your CV to image");

    setStatusText("Uploading your CV image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Failed to upload your CV image");

    setStatusText("Preparing your CV for analysis...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      cvPath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`CV:${uuid}`, JSON.stringify(data));

    setStatusText("Analysing your CV...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
      })
    );

    if (!feedback) return setStatusText("Error: Failed to analyse your CV");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);

    await kv.set(`CV:${uuid}`, JSON.stringify(data));

    setStatusText(
      "Your CV analysis is complete, redirecting to feedback page..."
    );
    // console.log(data);
    // setIsProcessing(false);
    navigate(`/cv/${uuid}`);
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

    // console.log({ companyName, jobTitle, jobDescription, file });

    if (!companyName || !jobTitle || !jobDescription || !file) {
      setStatusText("Please fill in all fields and upload a CV");
      setIsProcessing(false);
      return;
    }

    handleAnalyse({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
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
