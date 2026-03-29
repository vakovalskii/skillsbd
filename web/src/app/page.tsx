import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Leaderboard from "@/components/Leaderboard";
import { getSkills, getTotalInstalls, getTotalTrending } from "@/data/skills";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const params = await searchParams;
  const [skills, totalInstalls, totalTrending] = await Promise.all([
    getSkills(),
    getTotalInstalls(),
    getTotalTrending(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(300px,400px)_1fr] lg:gap-12 py-4">
          <aside className="lg:sticky lg:top-14 lg:self-start">
            <Hero />
          </aside>
          <section>
            <Leaderboard
              initialSkills={skills}
              totalInstalls={totalInstalls}
              totalTrending={totalTrending}
              initialFilter={params.filter === "russian" ? "__ru__" : ""}
            />
          </section>
        </div>
      </main>
    </>
  );
}
