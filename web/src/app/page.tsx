import Header from "@/components/Header";
import StudioHero from "@/components/StudioHero";
import ProductGrid from "@/components/ProductGrid";
import ServicesPitch from "@/components/ServicesPitch";
import OssShowcase from "@/components/OssShowcase";
import SkillsCallout from "@/components/SkillsCallout";
import { getSkills } from "@/data/skills";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Один запрос — нужен только counter для тизера skillsbd-каталога,
  // не сама лента.
  const skills = await getSkills().catch(() => []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <StudioHero />
        <ProductGrid />
        <ServicesPitch />
        <OssShowcase />
        <SkillsCallout totalSkills={skills.length || undefined} />
      </main>
    </>
  );
}
