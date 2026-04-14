"use client";

import Image from "next/image";
import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/file-url";

interface UploadResult {
  fileId: string;
  name: string;
  url?: string;
}

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  value?: string;
  onChange: (value?: string) => void;
  uploading: boolean;
  onUpload: (file: File) => Promise<UploadResult>;
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  uploading,
  onUpload,
}: ImageUploadFieldProps) {
  const previewUrl = resolveAppwriteFileUrl(value);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        {previewUrl ? (
          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-white">
            <Image src={previewUrl} alt={label} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            No image selected
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const uploaded = await onUpload(file);
                onChange(uploaded.fileId);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {value ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
