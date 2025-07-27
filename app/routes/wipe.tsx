import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showSelectConfirmation, setShowSelectConfirmation] = useState(false);

  const loadFiles = async () => {
    try {
      const files = (await fs.readDir("./")) as FSItem[];
      setFiles(files);
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setDeletedCount(0);

    try {
      // Delete files with progress tracking
      for (let i = 0; i < files.length; i++) {
        await fs.delete(files[i].path);
        setDeletedCount(i + 1);
      }

      // Clear key-value store
      await kv.flush();

      // Reload files
      await loadFiles();

      // Show success message briefly
      setTimeout(() => {
        setShowConfirmation(false);
        setIsDeleting(false);
        setSelectedFiles(new Set());
      }, 2000);
    } catch (err) {
      console.error("Error during deletion:", err);
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    setDeletedCount(0);

    try {
      const filesToDelete = files.filter((file) => selectedFiles.has(file.id));

      // Delete selected files with progress tracking
      for (let i = 0; i < filesToDelete.length; i++) {
        await fs.delete(filesToDelete[i].path);
        setDeletedCount(i + 1);
      }

      // Reload files
      await loadFiles();

      // Show success message briefly
      setTimeout(() => {
        setShowSelectConfirmation(false);
        setIsDeleting(false);
        setSelectedFiles(new Set());
      }, 2000);
    } catch (err) {
      console.error("Error during deletion:", err);
      setIsDeleting(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(files.map((file) => file.id)));
  };

  const deselectAllFiles = () => {
    setSelectedFiles(new Set());
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.includes(".pdf")) return "📄";
    if (fileName.includes(".json")) return "⚙️";
    if (fileName.includes(".txt")) return "📝";
    return "📁";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-primary rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-primary rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-primary mb-2">Error</h2>
          <p className="text-secondary mb-4">{error}</p>
          <button
            onClick={clearError}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-primary rounded-2xl shadow-lg p-6 mb-6 border-theme">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Data Management
              </h1>
              <p className="text-secondary mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-blue-600">
                  {auth.user?.username}
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {files.length}
              </div>
              <div className="text-sm text-secondary">Files Found</div>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-primary">About This Page</h3>
                <p className="text-sm text-secondary">
                  This tool allows you to clear all your stored data and files.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-primary rounded-2xl shadow-lg p-6 mb-6 border-theme">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Quick Navigation
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              <span>Go to Homepage</span>
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Upload Your CV</span>
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-primary rounded-2xl shadow-lg p-6 mb-6 border-theme">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Your Files</h2>
            {files.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={selectAllFiles}
                  className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllFiles}
                  className="text-sm text-secondary hover:text-primary px-2 py-1 rounded"
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>

          {files.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-secondary">No files found</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    selectedFiles.has(file.id)
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                      : "bg-secondary border-transparent hover:bg-secondary"
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xl">{getFileIcon(file.name)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-primary">{file.name}</p>
                    <p className="text-xs text-secondary">
                      {file.size
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : "Unknown size"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.size > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? "s" : ""}{" "}
                selected
              </p>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="bg-primary rounded-2xl shadow-lg p-6 border-theme">
          <div className="space-y-4">
            {/* Clear All Option */}
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Clear All Data
                </h2>
                <p className="text-secondary">
                  This will permanently delete all your files and stored data.
                </p>
              </div>

              <button
                onClick={() => setShowConfirmation(true)}
                disabled={files.length === 0 || isDeleting}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Clearing... ({deletedCount}/{files.length})
                  </>
                ) : (
                  <>🗑️ Clear All Data</>
                )}
              </button>
            </div>

            {/* Clear Selected Option */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Clear Selected Files
                </h2>
                <p className="text-secondary">
                  Delete only the files you've selected. More control over your
                  data.
                </p>
              </div>

              <button
                onClick={() => setShowSelectConfirmation(true)}
                disabled={selectedFiles.size === 0 || isDeleting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Clearing... ({deletedCount}/{selectedFiles.size})
                  </>
                ) : (
                  <>🗑️ Clear Selected ({selectedFiles.size})</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal for All Files */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-primary rounded-2xl shadow-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Are you sure?
                </h3>
                <p className="text-secondary mb-6">
                  This action will permanently delete all {files.length} files
                  and clear all stored data. This cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-secondary hover:bg-gray-300 text-primary px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Yes, Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Selected Files */}
        {showSelectConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-primary rounded-2xl shadow-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="text-blue-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Delete Selected Files?
                </h3>
                <p className="text-secondary mb-6">
                  This action will permanently delete {selectedFiles.size}{" "}
                  selected file{selectedFiles.size !== 1 ? "s" : ""}. This
                  cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSelectConfirmation(false)}
                    className="flex-1 bg-secondary hover:bg-gray-300 text-primary px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Yes, Delete Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {deletedCount > 0 && deletedCount === files.length && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>All data cleared successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WipeApp;