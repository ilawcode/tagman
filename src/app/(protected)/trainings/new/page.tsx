import Link from "next/link";
import { TrainingWizard } from "@/components/features/trainings/TrainingWizard";

export default function NewTrainingPage() {
  return (
    <section className="space-y-4">
      <Link href="/trainings" className="text-sm underline">
        Eğitim Listesine Don
      </Link>
      <TrainingWizard />
    </section>
  );
}
