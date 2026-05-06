"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Eğitmenler", href: "/trainers" },
  { label: "Eğitmen Arama", href: "/search" },
  { label: "Skill Katalogu", href: "/skills" },
  { label: "Eğitimler", href: "/trainings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col">
      <div className="p-6">
        <h1 className="text-sidebar-foreground font-semibold text-lg">Akademi Portali</h1>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sidebar-foreground hover:bg-white/5 transition-colors border-l-4 ${
                isActive ? "border-sidebar-primary bg-white/10" : "border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
