type ConflictItem = {
  trainingId: string;
  subject: string;
  date: string;
  conflictingTrainerIds: string[];
};

type ConflictWarningProps = {
  conflicts: ConflictItem[];
};

export function ConflictWarning({ conflicts }: ConflictWarningProps) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border p-3" style={{ borderColor: "#F59E0B", backgroundColor: "#FFFBEB" }}>
      <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
        Çakışma Uyarısı
      </p>
      <p className="text-sm mt-1" style={{ color: "#92400E" }}>
        Seçilen eğitmenlerden bazıları aynı tarihte başka planlı eğitimlerde görünüyor. Yine de devam edebilirsiniz.
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm" style={{ color: "#92400E" }}>
        {conflicts.map((conflict) => (
          <li key={conflict.trainingId}>
            {conflict.subject} - {new Date(conflict.date).toLocaleDateString("tr-TR")}
          </li>
        ))}
      </ul>
    </div>
  );
}
