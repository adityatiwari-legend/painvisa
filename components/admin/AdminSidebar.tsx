"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bell,
  MapPin,
  DollarSign,
  Sparkles,
  Calendar,
  HelpCircle,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface AdminSidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function AdminSidebar({ userRole, userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Applicants Management", href: "/admin/applicants", icon: Users },
    { label: "Announcements & Alerts", href: "/admin/announcements", icon: Bell },
    { label: "Application Centres", href: "/admin/centres", icon: MapPin },
    { label: "Visa Fees & Tariffs", href: "/admin/fees", icon: DollarSign },
    { label: "Additional Services", href: "/admin/services", icon: Sparkles },
    { label: "Public Holidays", href: "/admin/holidays", icon: Calendar },
    { label: "FAQs Management", href: "/admin/faqs", icon: HelpCircle },
    { label: "Portal Settings & URLs", href: "/admin/settings", icon: Settings },
    { label: "Security & Audit Trail", href: "/admin/audit-logs", icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-[#333638] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-neutral-700/80">
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-neutral-700/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-between p-1.5 border border-neutral-600">
              <div className="w-full h-full flex flex-col justify-between py-0.5">
                <div className="h-1 w-full bg-[#C60B1E]" />
                <div className="h-2 w-full bg-[#FFC400]" />
                <div className="h-1 w-full bg-[#C60B1E]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block tracking-tight">
                SPAIN VISA ADMIN
              </span>
              <span className="text-[10px] text-[#C79A2B] uppercase tracking-wider font-semibold">
                Control Management
              </span>
            </div>
          </Link>
        </div>

        {/* User Badge */}
        <div className="px-5 py-3.5 bg-neutral-800/60 border-b border-neutral-700/50 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="font-bold text-xs text-white block truncate">{userName || "Administrator"}</span>
            <span className="text-[10px] text-neutral-400 block truncate">{userEmail || "admin@spainvisa-portal.com"}</span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-[#C79A2B]/20 text-[#E2CCA1] border border-[#C79A2B]/30 uppercase shrink-0">
            {userRole || "ADMIN"}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#C79A2B] text-white shadow-xs font-bold"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-neutral-700/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#C79A2B]" />
            <span>Open Public Site</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:text-white hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
}
