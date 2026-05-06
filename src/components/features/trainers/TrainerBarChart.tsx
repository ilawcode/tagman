"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrainerBarChartDatum = {
  year: number;
  count: number;
};

type TrainerBarChartProps = {
  data: TrainerBarChartDatum[];
};

export function TrainerBarChart({ data }: TrainerBarChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Yıllık eğitim istatistiği yok.</p>;
  }

  return (
    <div className="h-64 min-h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <XAxis dataKey="year" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
