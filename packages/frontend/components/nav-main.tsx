"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState, useCallback } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  Home,
  Sparkles,
  BookText,
  UploadCloudIcon,
  ClipboardCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FileUploader } from "@/components/file-upload/file-upload";
import { uploadFile } from "@/components/file-upload/actions";
import { User } from "@releef.ai/types";
import { useRouter } from "next/navigation";

const data = [
  {
    title: "Upload",
    url: "#",
    icon: UploadCloudIcon,
  },
  {
    title: "Ask AI",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Compliance",
    url: "/dashboard/compliance",
    icon: ClipboardCheck,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BookText,
  },
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function NavMain({ user }: { user: Pick<User, "id"> }) {
  const router = useRouter();
  const currentPathName = usePathname();
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
      router.replace("/dashboard/reports");
      router.refresh();
    },
    [user.id]
  );

  return (
    <SidebarMenu>
      {data.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.url === currentPathName}>
            {item.title === "Upload" ? (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setFileUploadOpen(true);
                }}
                className="cursor-pointer"
              >
                <item.icon />
                <span>{item.title}</span>
              </a>
            ) : (
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

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
    </SidebarMenu>
  );
}
