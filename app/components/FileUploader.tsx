import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;

      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024;

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      multiple: false,
      accept: {
        "application/pdf": [".pdf"],
      },
      onDrop,
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/images/pdf.png"
                  alt="pdf"
                  className="size-10 object-contain"
                />
                <div>
                  <p className="text-sm text-primary font-medium truncate max-w-xs">
                    <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-sm text-secondary">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer hover:bg-secondary rounded-lg transition-colors duration-200"
                onClick={(e) => onFileSelect?.(null)}
                aria-label="Remove file"
              >
                <img src="/icons/cross.svg" alt="cross" className="size-4" />
              </button>
            </div>
          ) : (
            <div className="text-center uplader-drag-area">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-secondary">
                <span className="font-semibold">Click to upload</span> or drag
                and drop your CV here
              </p>
              <p className="text-lg text-secondary">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;