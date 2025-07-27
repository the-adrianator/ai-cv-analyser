import { ThemeToggle, ThemeToggleCompact } from "~/components/ThemeToggle";
import { useThemeStore } from "~/lib/theme";
import CVCard from "~/components/CVCard";
import FileUploader from "~/components/FileUploader";
import ScoreCircle from "~/components/ScoreCircle";

export default function ThemeTest() {
  const { theme } = useThemeStore();

  const mockResume = {
    id: "test-1",
    companyName: "Example Company",
    jobTitle: "Software Engineer",
    feedback: { overallScore: 85 },
    imagePath: "/images/sample-cv.jpg"
  };

  return (
    <main className="min-h-screen bg-primary text-primary p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">
            Theme System Demo
          </h1>
          <p className="text-xl text-secondary">
            Current theme: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </div>

        {/* Theme Toggles */}
        <div className="bg-secondary p-8 rounded-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Theme Toggle Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Full Toggle</h3>
              <div className="flex justify-center p-4 bg-primary border-theme rounded-lg">
                <ThemeToggle />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Compact Toggle</h3>
              <div className="flex justify-center p-4 bg-primary border-theme rounded-lg">
                <ThemeToggleCompact />
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="space-y-8">
          
          {/* Score Circles */}
          <div className="bg-secondary p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">Score Circles</h2>
            <div className="flex flex-wrap gap-8 justify-center">
              <div className="text-center space-y-2">
                <ScoreCircle score={92} />
                <p className="text-secondary">Excellent</p>
              </div>
              <div className="text-center space-y-2">
                <ScoreCircle score={75} />
                <p className="text-secondary">Good</p>
              </div>
              <div className="text-center space-y-2">
                <ScoreCircle score={45} />
                <p className="text-secondary">Needs Work</p>
              </div>
            </div>
          </div>

          {/* File Uploader */}
          <div className="bg-secondary p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">File Uploader</h2>
            <div className="max-w-md mx-auto">
              <FileUploader onFileSelect={(file) => console.log('Selected:', file)} />
            </div>
          </div>

          {/* Form Elements */}
          <div className="bg-secondary p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">Form Elements</h2>
            <form className="max-w-md mx-auto space-y-6">
              <div className="form-div">
                <label htmlFor="test-input">Test Input</label>
                <input 
                  id="test-input"
                  type="text" 
                  placeholder="Type something here..."
                  className="w-full"
                />
              </div>
              
              <div className="form-div">
                <label htmlFor="test-textarea">Test Textarea</label>
                <textarea 
                  id="test-textarea"
                  placeholder="Enter some text..."
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <button type="button" className="primary-button">
                Test Button
              </button>
            </form>
          </div>

          {/* Color Palette Display */}
          <div className="bg-secondary p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-primary mb-6">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary border-theme rounded-lg"></div>
                <p className="text-sm text-secondary text-center">Primary BG</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-16 bg-secondary border-theme rounded-lg"></div>
                <p className="text-sm text-secondary text-center">Secondary BG</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary border-theme rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold">Primary Text</span>
                </div>
                <p className="text-sm text-secondary text-center">Primary Text</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary border-theme rounded-lg flex items-center justify-center">
                  <span className="text-secondary font-semibold">Secondary Text</span>
                </div>
                <p className="text-sm text-secondary text-center">Secondary Text</p>
              </div>
              
            </div>
          </div>

        </div>

        {/* Instructions */}
        <div className="text-center space-y-4 py-8">
          <p className="text-secondary">
            Use the toggle switches above to switch between light and dark themes.
          </p>
          <p className="text-sm text-secondary">
            Your preference will be saved automatically and persist across sessions.
          </p>
        </div>

      </div>
    </main>
  );
}