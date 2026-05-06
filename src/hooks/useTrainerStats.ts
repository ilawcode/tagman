"use client";

import { useQuery } from "@tanstack/react-query";

type TrainerStats = {
  averageScore: number | null;
  trainingCountByYear: Array<{
    year: number;
    count: number;
  }>;
};

export function useTrainerStats(trainerId: string) {
  return useQuery<TrainerStats>({
    queryKey: ["trainers", trainerId, "stats"],
    queryFn: async () => {
      const response = await fetch(`/api/trainers/${trainerId}/stats`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error?.message ?? "Stats verisi alinamadi");
      }

      return result.data as TrainerStats;
    },
    enabled: Boolean(trainerId),
  });
}
