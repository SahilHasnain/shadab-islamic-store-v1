"use client";

import Image from "next/image";
import { resolveAppwriteFileUrl } from "@/src/backend/appwrite/file-url";

interface UploadResult {
  fileId: string;
  name: string;
  url?: string;
}

interface ImageGalleryUploadFieldProps {
  label: string;
  description?: string;
  values: string[];
  uploading: boolean;
  onUpload: (file: File) => Promise<UploadResult>;
  onChange: (values: string[]) => void;
}

export function ImageGalleryUploadField({
  label,
  description,
  values,
  uploading,
  onUpload,
  onChange,
}: ImageGalleryUploadFieldProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        {values.length > 0 ? (
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {values.map((fileId, index) => {
              const previewUrl = resolveAppwriteFileUrl(fileId);

              return (
                <div key={`${fileId}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    {previewUrl ? (
                      <Image src={previewUrl} alt={`${label} ${index + 1}`} fill className="object-cover" unoptimized />
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">Image {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => onChange(values.filter((_, currentIndex) => currentIndex !== index))}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            No images uploaded yet
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          {uploading ? "Uploading..." : "Add images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length === 0) return;

              const uploadedIds: string[] = [];
              for (const file of files) {
                const uploaded = await onUpload(file);
                uploadedIds.push(uploaded.fileId);
              }

              onChange([...values, ...uploadedIds]);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
