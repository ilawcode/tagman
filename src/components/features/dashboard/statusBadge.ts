export type DashboardTrainingStatus = "planned" | "cancelled" | "completed";

export const statusLabel: Record<DashboardTrainingStatus, string> = {
  planned: "Planlandi",
  cancelled: "İptal",
  completed: "Tamamlandi",
};

export const statusBadgeClass: Record<DashboardTrainingStatus, string> = {
  planned: "bg-[#dbeafe] text-[#1e3a8a]",
  cancelled: "bg-[#fee2e2] text-[#991b1b]",
  completed: "bg-[#dcfce7] text-[#166534]",
};