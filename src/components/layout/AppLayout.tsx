import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background">
        <div className="max-w-[1200px] mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
