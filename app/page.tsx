import { FeaturedProjects } from '@/components/web/FeaturedProjects';
import { Hero } from '@/components/web/Hero';
import { SkillsSection } from '@/components/web/SkillsSection';

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsSection />
      <FeaturedProjects />
    </>
  );
}
