import { FeaturedArticlesSection } from "@/components/home/featured-articles-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { HeroSection } from "@/components/home/hero-section";
import { ValuePillarsSection } from "@/components/home/value-pillars-section";
import { listFeaturedArticles } from "@/features/posts/repositories/posts-repository";
import { listFeaturedProjects } from "@/features/projects/repositories/projects-repository";

export default async function HomePage() {
  const [articles, projects] = await Promise.all([
    listFeaturedArticles(),
    listFeaturedProjects(),
  ]);

  return (
    <>
      <HeroSection />

      <main className="border-t border-border/60 bg-background">
        <div className="w-full px-6 py-10 sm:px-10 lg:px-[7vw]">
          <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr]">
            <FeaturedArticlesSection articles={articles} />
            <FeaturedProjectsSection projects={projects} />
          </div>

          <div className="mt-10">
            <ValuePillarsSection />
          </div>
        </div>
      </main>
    </>
  );
}