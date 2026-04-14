"use client";

interface AdminNoticeBannerProps {
  message: string | null;
}

export function AdminNoticeBanner({ message }: AdminNoticeBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="sticky top-4 z-20 rounded-[1.5rem] border border-emerald-300 bg-emerald-50 px-5 py-4 shadow-sm">
      <p className="text-sm font-semibold text-emerald-800">{message}</p>
    </div>
  );
}
