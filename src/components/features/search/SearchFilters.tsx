"use client";

type SearchFiltersValue = {
  q: string;
  employmentType: "" | "internal" | "external";
  consultingFirm: string;
  skillId: string;
  minScore: string;
};

type SkillOption = {
  _id: string;
  name: string;
};

type SearchFiltersProps = {
  value: SearchFiltersValue;
  skillOptions: SkillOption[];
  onChange: (next: SearchFiltersValue) => void;
  onClear: () => void;
};

export function SearchFilters({ value, skillOptions, onChange, onClear }: SearchFiltersProps) {
  const chips: Array<{ key: keyof SearchFiltersValue; label: string }> = [];

  if (value.q) {
    chips.push({ key: "q", label: `Ad/Soyad: ${value.q}` });
  }

  if (value.employmentType) {
    chips.push({
      key: "employmentType",
      label: `Durum: ${value.employmentType === "internal" ? "Kurum içi" : "Kurum dışı"}`,
    });
  }

  if (value.consultingFirm) {
    chips.push({ key: "consultingFirm", label: `Firma: ${value.consultingFirm}` });
  }

  if (value.skillId) {
    const skillName = skillOptions.find((item) => item._id === value.skillId)?.name ?? value.skillId;
    chips.push({ key: "skillId", label: `Skill: ${skillName}` });
  }

  if (value.minScore) {
    chips.push({ key: "minScore", label: `Min Puan: ${value.minScore}` });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          value={value.q}
          onChange={(event) => onChange({ ...value, q: event.target.value })}
          placeholder="Ad / Soyad"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        <select
          value={value.employmentType}
          onChange={(event) =>
            onChange({
              ...value,
              employmentType: event.target.value as SearchFiltersValue["employmentType"],
            })
          }
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Kurum Durumu</option>
          <option value="internal">Kurum içi</option>
          <option value="external">Kurum dışı</option>
        </select>

        <input
          value={value.consultingFirm}
          onChange={(event) => onChange({ ...value, consultingFirm: event.target.value })}
          placeholder="Danışmanlık firmasi"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        <select
          value={value.skillId}
          onChange={(event) => onChange({ ...value, skillId: event.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Skill seçin</option>
          {skillOptions.map((skill) => (
            <option key={skill._id} value={skill._id}>
              {skill.name}
            </option>
          ))}
        </select>

        <input
          value={value.minScore}
          type="number"
          min={1}
          max={10}
          onChange={(event) => onChange({ ...value, minScore: event.target.value })}
          placeholder="Min puan"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onChange({ ...value, [chip.key]: "" })}
              className="rounded-full border border-border px-3 py-1 text-xs"
            >
              {chip.label} x
            </button>
          ))}
          {chips.length === 0 ? (
            <span className="text-xs text-muted-foreground">Filtre secilmedi.</span>
          ) : null}
        </div>

        <button type="button" onClick={onClear} className="text-sm underline">
          Tüm filtreleri temizle
        </button>
      </div>
    </div>
  );
}
