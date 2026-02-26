import { parseSpec } from "@/lib/parser";
import DashboardClient from "@/components/DashboardClient";
import type { SerializedSpec } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const spec = parseSpec();

  // Serialize dates for client component
  const serializedSpec: SerializedSpec = {
    literature: spec.literature,
    concepts: spec.concepts,
    prototypes: spec.prototypes.map((p) => ({
      ...p,
      lastModified: p.lastModified.toISOString(),
    })),
    progress: spec.progress,
    todo: spec.todo,
  };

  return (
    <main className="min-h-screen bg-background">
      <DashboardClient spec={serializedSpec} />
    </main>
  );
}
