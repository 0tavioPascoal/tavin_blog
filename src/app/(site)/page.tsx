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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <FeaturedArticlesSection articles={articles} />
        <FeaturedProjectsSection projects={projects} />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <ValuePillarsSection />
      </div>
    </>
  );
}
