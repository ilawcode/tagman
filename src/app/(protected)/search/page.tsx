"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchFilters } from "@/components/features/search/SearchFilters";

type SkillOption = {
  _id: string;
  name: string;
};

type SearchFiltersValue = {
  q: string;
  employmentType: "" | "internal" | "external";
  consultingFirm: string;
  skillId: string;
  minScore: string;
};

type TrainerSearchResult = {
  _id: string;
  firstName: string;
  lastName: string;
  employmentType: "internal" | "external";
  consultingFirm?: string;
  averageScore: number | null;
  skills: Array<{
    name?: string;
    score: number;
  }>;
};

const defaultFilters: SearchFiltersValue = {
  q: "",
  employmentType: "",
  consultingFirm: "",
  skillId: "",
  minScore: "",
};

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFiltersValue>(defaultFilters);
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const [trainers, setTrainers] = useState<TrainerSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.q) {
      params.set("q", filters.q);
    }

    if (filters.employmentType) {
      params.set("employmentType", filters.employmentType);
    }

    if (filters.consultingFirm) {
      params.set("consultingFirm", filters.consultingFirm);
    }

    if (filters.skillId) {
      params.set("skillId", filters.skillId);
    }

    if (filters.minScore) {
      params.set("minScore", filters.minScore);
    }

    return params.toString();
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    const fetchSkills = async () => {
      const response = await fetch("/api/skills?activeOnly=true", { cache: "no-store" });
      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setError(result?.error?.message ?? "Skill listesi alinamadi");
        return;
      }

      setSkillOptions((result?.data?.skills ?? []) as SkillOption[]);
    };

    void fetchSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchSearch = async () => {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/trainers/search?${queryString}`, { cache: "no-store" });
      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setError(result?.error?.message ?? "Arama sonucu alinamadi");
        setLoading(false);
        return;
      }

      setTrainers((result?.data?.trainers ?? []) as TrainerSearchResult[]);
      setLoading(false);
    };

    void fetchSearch();

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Eğitmen Arama</h1>
        <p className="text-sm text-muted-foreground">Chip filtrelerle AND mantiginda arama yapin.</p>
      </header>

      <SearchFilters
        value={filters}
        skillOptions={skillOptions}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
      />

      <div>
        <button
          type="button"
          disabled={exporting || trainers.length === 0}
          onClick={async () => {
            setExporting(true);
            try {
              const response = await fetch(`/api/trainers/export?${queryString}`);
              if (!response.ok) {
                const result = await response.json();
                setError(result?.error?.message ?? "CSV export basarisiz");
                return;
              }

              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "trainer-search-export.csv";
              anchor.click();
              URL.revokeObjectURL(url);
            } finally {
              setExporting(false);
            }
          }}
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {exporting ? "CSV hazirlaniyor..." : "CSV Indir"}
        </button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {loading ? <p className="text-sm text-muted-foreground">Araniyor...</p> : null}

      {!loading && trainers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Filtrelere uygun eğitmen bulunamadı.</p>
          <button type="button" className="text-sm underline" onClick={() => setFilters(defaultFilters)}>
            Filtreleri temizle
          </button>
        </div>
      ) : null}

      {!loading && trainers.length > 0 ? (
        <div className="rounded-lg border border-border divide-y divide-border">
          {trainers.map((trainer) => (
            <article key={trainer._id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {trainer.firstName} {trainer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {trainer.employmentType === "internal" ? "Kurum içi" : "Kurum dışı"}
                    {trainer.consultingFirm ? ` - ${trainer.consultingFirm}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-accent px-2 py-1 text-xs font-medium">
                  Ort. Puan: {trainer.averageScore ?? "-"}
                </span>
              </div>

              <details>
                <summary className="text-sm cursor-pointer">Skill listesini göster</summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {trainer.skills.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Skill bilgisi yok</span>
                  ) : (
                    trainer.skills.map((skill, index) => (
                      <span key={`${trainer._id}-${index}`} className="rounded-full border border-border px-2 py-1 text-xs">
                        {skill.name ?? "Isimsiz skill"}: {skill.score}
                      </span>
                    ))
                  )}
                </div>
              </details>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
