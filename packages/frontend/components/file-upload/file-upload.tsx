import React from "react";
import { DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import {
  File,
  LoaderCircle,
  //   SuccessIcon,
  //   ErrorIcon,
} from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File[]) => void;
  acceptedFileTypes?: {
    [key: string]: string[];
  };
  maxFileSize?: number;
  maxNumFiles?: number;
  files?: Array<{ name: string; status: string }>;
}
export function FileUploader({
  onUpload,
  maxFileSize,
  maxNumFiles,
  acceptedFileTypes,
  files,
}: FileUploadProps) {
  const maxFileSizeInMB = maxFileSize ? maxFileSize / (1024 * 1024) : 0;
  const FILE_ERROR_MESSAGES: {
    [key: string]: string;
  } = {
    "file-invalid-type": "File type is not supported",
    "file-too-large": `File exceeds the maximum file size of ${maxFileSizeInMB} MB`,
    "file-too-small": "File is too small",
    "too-many-files": `Only ${maxNumFiles} files are allowed`,
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onUpload,
    accept: acceptedFileTypes,
    maxFiles: maxNumFiles,
    maxSize: maxFileSize,
    onDropRejected: (fileRejection: FileRejection[]) => {
      const errorMessages = fileRejection.flatMap((f) =>
        f.errors.map((e) => FILE_ERROR_MESSAGES[e.code] || e.message)
      );

      // Display toast for each error message
      errorMessages.forEach((message) => {
        toast.error(message);
      });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload File</DialogTitle>
      </DialogHeader>

      <div className="mx-auto max-w-2xl" {...getRootProps()}>
        <div className="mb-4 flex w-full items-center justify-center">
          <div className="bg-secondary h-64 w-[450px] cursor-pointer rounded-lg border-2 border-dashed p-10">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="primary mb-3 h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-muted-foreground text-sm">
                Supported formats: CSV
              </p>
              <p className="text-muted-foreground text-sm">
                {maxFileSizeInMB} MB max file size
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              {...getInputProps()}
            />
          </div>
        </div>

        {/* Show the list of accepted files */}
        {files &&
          files.length > 0 &&
          files.map(({ name, status }) => {
            const formattedFileName = name.toLowerCase().replace(/\s/g, "_");
            return (
              <Card className="mb-2 h-[65px]" key={name}>
                <CardContent className="mt-2">
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-start">
                      <File className="mr-2 h-6 w-6" />
                      <p className="text-muted-foreground text-sm">
                        {formattedFileName}
                      </p>
                    </div>
                    {status === "UPLOADING" ? (
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : status === "SUCCESS" ? (
                      <p>Success</p>
                    ) : (
                      <p>Failed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </DialogContent>
  );
}
