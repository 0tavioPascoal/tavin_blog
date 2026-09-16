import { FeaturedArticlesSection } from "@/components/home/featured-articles-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { HeroSection } from "@/components/home/hero-section";
import { ValuePillarsSection } from "@/components/home/value-pillars-section";
import { PageContainer } from "@/components/layout/page-container";
import { listFeaturedArticles } from "@/features/posts/repositories/posts-repository";
import { listFeaturedProjects } from "@/features/projects/repositories/projects-repository";

export default async function HomePage() {
  const [articles, projects] = await Promise.all([
    listFeaturedArticles(),
    listFeaturedProjects(),
  ]);

  return (
    <main>
      <HeroSection />

      <PageContainer>
        <section className="grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-5">
          <FeaturedArticlesSection articles={articles} />
          <FeaturedProjectsSection projects={projects} />
        </section>

        <section className="mt-14 border-t border-border/80 pt-12">
          <ValuePillarsSection />
        </section>
      </PageContainer>
    </main>
  );
}
