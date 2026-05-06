"use client";

import { useEffect, useState } from "react";

type SkillItem = {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    const response = await fetch("/api/skills", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) {
      setError(result?.error?.message ?? "Skill listesi alinamadi");
      return;
    }
    setSkills(result.data.skills);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSkills().catch(() => {
      setError("Skill listesi alinamadi");
    });
  }, []);

  const handleCreateSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result?.error?.message ?? "Skill oluşturulamadi");
      setLoading(false);
      return;
    }

    setName("");
    await fetchSkills();
    setLoading(false);
  };

  const handleDeactivate = async (id: string) => {
    setError(null);

    const response = await fetch(`/api/skills/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: false }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result?.error?.message ?? "Skill pasife alinamadi");
      return;
    }

    await fetchSkills();
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Skill Katalogu</h1>
        <p className="text-sm text-muted-foreground">Yeni skill ekleyin veya mevcut skillleri pasife alin.</p>
      </header>

      <form onSubmit={handleCreateSkill} className="flex gap-3 items-start">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="skillName" className="text-sm font-medium">
            Skill Adi *
          </label>
          <input
            id="skillName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Orn. React"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Ekleniyor..." : "Skill Ekle"}
        </button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3">Skill</th>
              <th className="text-left px-4 py-3">Eklenme Tarihi</th>
              <th className="text-left px-4 py-3">Durum</th>
              <th className="text-right px-4 py-3">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  Henüz skill eklenmemis.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill._id} className="border-t border-border">
                  <td className="px-4 py-3">{skill.name}</td>
                  <td className="px-4 py-3">{new Date(skill.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        skill.isActive
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                    >
                      {skill.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={!skill.isActive}
                      onClick={() => handleDeactivate(skill._id)}
                      className="rounded-md border border-border px-3 py-1.5 disabled:opacity-50"
                    >
                      Pasife Al
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
