"use client";

import { useQuery } from "@tanstack/react-query";

export type DashboardTrainingItem = {
  _id: string;
  subject: string;
  date: string;
  status: "planned" | "cancelled" | "completed";
};

type DashboardData = {
  weekRange: {
    start: string;
    end: string;
  };
  weeklyTrainings: DashboardTrainingItem[];
  upcoming30Days: DashboardTrainingItem[];
  scope: "all" | "mine";
};

export function useDashboard(scope: "all" | "mine") {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", scope],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard?scope=${scope}`, { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error?.message ?? "Dashboard verisi alinamadi");
      }

      return result.data as DashboardData;
    },
  });
}