"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "URGENT";
}

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/content/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.announcements?.length > 0) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const severityStyles = {
    INFO: "bg-[#252525] text-white border-b border-[#333638]",
    WARNING: "bg-amber-950 text-amber-100 border-b border-amber-800",
    URGENT: "bg-red-950 text-red-100 border-b border-red-800",
  }[current.severity] || "bg-[#252525] text-white";

  const iconColor = {
    INFO: "text-[#C79A2B]",
    WARNING: "text-amber-400",
    URGENT: "text-red-400",
  }[current.severity];

  return (
    <div className={`relative px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${severityStyles} no-print`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {current.severity === "URGENT" ? (
            <AlertCircle className={`w-4 h-4 shrink-0 ${iconColor}`} />
          ) : current.severity === "WARNING" ? (
            <AlertTriangle className={`w-4 h-4 shrink-0 ${iconColor}`} />
          ) : (
            <Info className={`w-4 h-4 shrink-0 ${iconColor}`} />
          )}
          <div className="truncate">
            <span className="font-semibold text-[#C79A2B] uppercase tracking-wider text-[11px] mr-2">
              {current.title}:
            </span>
            <span className="opacity-95">{current.message}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {announcements.length > 1 && (
            <span className="text-[11px] opacity-75 hidden sm:inline">
              {currentIndex + 1} of {announcements.length}
            </span>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:opacity-100 opacity-70 transition-opacity rounded"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
