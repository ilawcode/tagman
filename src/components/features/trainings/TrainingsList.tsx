"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type TrainingItem = {
  _id: string;
  subject: string;
  date: string;
  status: "planned" | "cancelled" | "completed";
  cancelNote?: string;
  completionScore?: number;
};

type TrainingsListProps = {
  initialTrainings: TrainingItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

function statusLabel(status: TrainingItem["status"]) {
  if (status === "planned") {
    return "Planlandi";
  }

  if (status === "completed") {
    return "Tamamlandi";
  }

  return "İptal";
}

export function TrainingsList({ initialTrainings }: TrainingsListProps) {
  const queryClient = useQueryClient();
  const [trainings, setTrainings] = useState(initialTrainings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [completeScore, setCompleteScore] = useState<number>(0);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);

  const openCancel = (id: string) => {
    setCancelError(null);
    setCancelNote("");
    setCompletingId(null);
    setCancellingId(id);
  };

  const openComplete = (id: string) => {
    setCompleteError(null);
    setCompleteScore(0);
    setCancellingId(null);
    setCompletingId(id);
  };

  const applyCancel = async () => {
    if (!cancellingId) {
      return;
    }

    setCancelError(null);

    const response = await fetch(`/api/trainings/${cancellingId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancelNote }),
    });

    const result = await response.json();

    if (!response.ok) {
      setCancelError(result?.error?.message ?? "İptal islemi basarisiz");
      return;
    }

    setTrainings((prev) =>
      prev.map((training) =>
        training._id === cancellingId
          ? {
              ...training,
              status: "cancelled",
              cancelNote,
            }
          : training,
      ),
    );

    setCancellingId(null);
    setCancelNote("");
  };

  const applyComplete = async () => {
    if (!completingId) {
      return;
    }

    setCompleteError(null);

    const response = await fetch(`/api/trainings/${completingId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: completeScore }),
    });

    const result = await response.json();

    if (!response.ok) {
      setCompleteError(result?.error?.message ?? "Tamamlama islemi basarisiz");
      return;
    }

    const affectedTrainerIds = (result?.data?.affectedTrainerIds ?? []) as string[];
    await Promise.all(
      affectedTrainerIds.map((trainerId) =>
        queryClient.invalidateQueries({ queryKey: ["trainers", trainerId, "stats"] }),
      ),
    );

    setTrainings((prev) =>
      prev.map((training) =>
        training._id === completingId
          ? {
              ...training,
              status: "completed",
              completionScore: completeScore,
            }
          : training,
      ),
    );

    setCompletingId(null);
    setCompleteScore(0);
  };

  return (
    <div className="rounded-lg border border-border divide-y divide-border">
      {trainings.map((training) => {
        const cancelled = training.status === "cancelled";
        const completed = training.status === "completed";

        return (
          <div
            key={training._id}
            className={`px-4 py-3 ${cancelled ? "bg-red-50" : completed ? "bg-green-50" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{training.subject}</p>
                <p className="text-sm text-muted-foreground">{formatDate(training.date)}</p>
                {cancelled && training.cancelNote ? (
                  <p className="text-sm text-red-700 mt-1">İptal Notu: {training.cancelNote}</p>
                ) : null}
                {completed ? (
                  <p className="text-sm text-green-700 mt-1">Puan: {training.completionScore ?? "-"}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    cancelled
                      ? "bg-red-100 text-red-700"
                      : completed
                        ? "bg-green-100 text-green-700"
                        : "bg-accent"
                  }`}
                >
                  {statusLabel(training.status)}
                </span>
                {training.status === "planned" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openComplete(training._id)}
                      className="rounded-md border border-green-300 text-green-700 px-3 py-1 text-xs font-semibold"
                    >
                      Tamamla
                    </button>
                    <button
                      type="button"
                      onClick={() => openCancel(training._id)}
                      className="rounded-md border border-red-300 text-red-700 px-3 py-1 text-xs font-semibold"
                    >
                      İptal Et
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {cancellingId === training._id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  rows={3}
                  value={cancelNote}
                  onChange={(event) => setCancelNote(event.target.value)}
                  placeholder="İptal notunu girin (zorunlu)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {cancelError ? <p className="text-sm text-destructive">{cancelError}</p> : null}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyCancel}
                    className="rounded-md bg-red-600 text-white px-3 py-2 text-xs font-semibold"
                  >
                    İptali Onayla
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancellingId(null)}
                    className="rounded-md border border-border px-3 py-2 text-xs font-semibold"
                  >
                    Vazgec
                  </button>
                </div>
              </div>
            ) : null}

            {completingId === training._id ? (
              <div className="mt-3 space-y-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={completeScore || ""}
                  onChange={(event) => setCompleteScore(Number(event.target.value))}
                  placeholder="Puan (1-10)"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {completeError ? <p className="text-sm text-destructive">{completeError}</p> : null}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyComplete}
                    className="rounded-md bg-green-600 text-white px-3 py-2 text-xs font-semibold"
                  >
                    Tamamlamayi Onayla
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompletingId(null)}
                    className="rounded-md border border-border px-3 py-2 text-xs font-semibold"
                  >
                    Vazgec
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
