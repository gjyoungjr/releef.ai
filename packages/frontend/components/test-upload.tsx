"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Sparkles,
  BookText,
  UploadCloudIcon,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-upload/file-upload";
import { User } from "@releef.ai/types";
import { uploadFile } from "@/components/file-upload/actions";
import { Dialog } from "@/components/ui/dialog";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export default function Upload({ user }: { user: Pick<User, "id"> }) {
  const router = useRouter();

  const [isFileUploadOpen, setFileUploadOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<
    Array<{ name: string; status: string }> | undefined
  >(undefined);

  const onUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setFiles(files.map((f) => ({ name: f.name, status: "UPLOADING" }))); // default status

      const uploadResults = await Promise.all(
        files.map((file) => uploadFile(file, user.id))
      );

      // Update status for each file based on upload results
      setFiles((prevFiles) =>
        prevFiles?.map((f) => {
          const result = uploadResults.find((res) => res.fileName === f.name);
          if (result) {
            return { name: f.name, status: result.status };
          }
          return f;
        })
      );
      setFileUploadOpen(false);
      router.refresh();
    },
    [user.id]
  );
  return (
    <>
      <Button onClick={() => setFileUploadOpen(true)}>
        <UploadCloudIcon className="w-4 h-4 mr-2" />
        Upload
      </Button>
      <Dialog
        open={isFileUploadOpen}
        onOpenChange={(isOpen) => setFileUploadOpen(isOpen)}
      >
        <FileUploader
          onUpload={onUpload}
          maxNumFiles={1}
          acceptedFileTypes={{
            "application/pdf": [".pdf"],
          }}
          maxFileSize={MAX_FILE_SIZE}
          files={files}
        />
      </Dialog>
    </>
  );
}
