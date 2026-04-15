"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/src/lib/utils";
import type { SiteContact } from "@/src/types";

const QUICK_REPLIES = [
  "Hello! I'd like to know more about your products.",
  "Hi! I need help with my order.",
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function FloatingWhatsApp({ contact }: { contact: SiteContact }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Pulse animation effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShouldPulse(true);
      setTimeout(() => setShouldPulse(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const baseUrl = buildWhatsAppUrl(
    contact.whatsappNumber,
    contact.whatsappMessage,
  );

  return (
    <div className="fixed bottom-4 right-4 z-[1001]">
      {/* Backdrop to prevent touch issues with underlying elements */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-transparent"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Card */}
      {isOpen && (
        <div className="relative z-[1001] mb-3 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl animate-slideUp">
          {/* Header */}
          <div className="flex items-center bg-[var(--color-accent)] p-3 text-white">
            <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 animate-float">
              <WhatsAppIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">WhatsApp Chat</h3>
              <p className="text-xs text-white/80">Online | Quick Response</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto rounded-full p-1 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="mb-3 inline-block max-w-[85%] rounded-lg rounded-bl-none bg-gray-100 p-3 text-sm text-gray-800 animate-fadeIn">
              Hello! How can I help you today?
            </div>

            <div className="space-y-2">
              {/* Quick Reply Buttons */}
              {QUICK_REPLIES.map((reply, index) => (
                <a
                  key={index}
                  href={`${baseUrl.split("?")[0]}?text=${encodeURIComponent(reply)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md bg-gray-100 px-3 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-gray-200"
                >
                  {reply}
                </a>
              ))}

              {/* Start Custom Chat Button */}
              <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md bg-[var(--color-accent)] px-3 py-2 text-center text-white transition-colors hover:bg-[var(--color-accent)]/90"
              >
                Start a custom chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        title="Chat on WhatsApp"
        className={`relative z-[1002] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-[0_22px_60px_rgba(185,92,46,0.35)] transition-all duration-300 hover:bg-[var(--color-accent)]/90 ${shouldPulse ? "animate-pulse" : ""
          } ${isOpen ? "scale-95 rotate-180" : ""}`}
      >
        {isOpen ? (
          <CloseIcon className="h-7 w-7" />
        ) : (
          <WhatsAppIcon className="h-7 w-7" />
        )}
      </button>

      {/* Notification Badge (only when closed) */}
      {!isOpen && (
        <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--color-accent)] text-[10px] font-medium text-white shadow ring-2 ring-white">
          !
        </span>
      )}
    </div>
  );
}
