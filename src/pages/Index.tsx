import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import PublicLayout from "@/layouts/PublicLayout";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: featuredProjects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, categories(name)")
        .eq("is_featured", true)
        .order("sort_order")
        .limit(3);
      return data ?? [];
    },
  });

  const { data: latestPosts } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*, categories(name)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const { data: heroContent } = useQuery({
    queryKey: ["page-content", "home", "hero"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "home")
        .eq("section", "hero")
        .maybeSingle();
      return data?.content as Record<string, string> | null;
    },
  });

  const { data: skillsContent } = useQuery({
    queryKey: ["page-content", "home", "skills"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "home")
        .eq("section", "skills")
        .maybeSingle();
      return data?.content as { skills?: string[] } | null;
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="section-padding min-h-[80vh] flex items-center" style={{ background: "var(--hero-gradient)" }}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-sm font-medium text-accent tracking-wider uppercase mb-4">
              {heroContent?.tagline || "Welcome"}
            </p>
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              {heroContent?.title || "Creative Developer & Designer"}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              {heroContent?.description || "I build beautiful, functional digital experiences that make a difference."}
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link to="/projects">View Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Portfolio</p>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">Featured Projects</h2>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex">
                  <Link to="/projects">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 0.1}>
                  <ProjectCard
                    title={project.title}
                    slug={project.slug}
                    description={project.description}
                    featuredImage={project.featured_image}
                    category={project.categories?.name}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Expertise</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">Skills & Technologies</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-3">
              {(skillsContent?.skills || [
                "React", "TypeScript", "Node.js", "Python", "PostgreSQL",
                "Tailwind CSS", "Figma", "AWS", "Docker", "GraphQL",
              ]).map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Blog</p>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">Latest Posts</h2>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex">
                  <Link to="/blog">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.1}>
                  <BlogCard
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    featuredImage={post.featured_image}
                    category={post.categories?.name}
                    publishedAt={post.published_at}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Let's Work Together</h2>
            <p className="mt-4 text-primary-foreground/70 max-w-md mx-auto">
              Have a project in mind? I'd love to hear about it and discuss how we can collaborate.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
}
