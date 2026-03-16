import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Terminal, Server, Shield } from "lucide-react";
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
      <section className="section-padding min-h-[85vh] flex items-center" style={{ background: "var(--hero-gradient)" }}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="h-4 w-4 text-primary" />
              <p className="font-mono text-xs text-primary tracking-wider uppercase glow-text">
                {heroContent?.tagline || "root@server:~#"}
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
              {heroContent?.title || "Systems Administrator"}
              <span className="text-primary animate-blink">_</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-lg font-body">
              {heroContent?.description || "Building resilient infrastructure, automating everything, and keeping systems running at scale. From bare metal to cloud-native."}
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="font-mono text-sm">
                <Link to="/projects">ls ~/projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono text-sm">
                <Link to="/contact">mail -s "hello"</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Quick Info */}
      <section className="section-padding border-b border-border">
        <div className="container-wide">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <Server className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">Infrastructure</p>
                  <p className="text-sm text-muted-foreground mt-1">Designing & managing production systems at scale</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">Security</p>
                  <p className="text-sm text-muted-foreground mt-1">Hardening systems, compliance, and incident response</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Terminal className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">Automation</p>
                  <p className="text-sm text-muted-foreground mt-1">IaC, CI/CD pipelines, and scripting workflows</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">~/projects</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Work</h2>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex font-mono text-xs">
                  <Link to="/projects">
                    ls -la <ArrowRight className="ml-2 h-4 w-4" />
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
      <section className="section-padding border-t border-border">
        <div className="container-wide">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">cat /proc/skills</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Stack & Tools</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {(skillsContent?.skills || [
                "Linux", "Bash", "Python", "Ansible", "Terraform",
                "Docker", "Kubernetes", "AWS", "GCP", "Nginx",
                "PostgreSQL", "Redis", "Prometheus", "Grafana", "Git",
                "CI/CD", "Networking", "Firewall", "DNS", "Systemd",
              ]).map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-xs font-mono">
                  {skill}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="section-padding border-t border-border">
          <div className="container-wide">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">/var/log/blog</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold">Latest Posts</h2>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex font-mono text-xs">
                  <Link to="/blog">
                    tail -f <ArrowRight className="ml-2 h-4 w-4" />
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
      <section className="section-padding bg-card border-t border-border">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary mb-4">$ ssh user@collaboration</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Let's Build Something Reliable</h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto text-sm">
              Need help with infrastructure, automation, or scaling your systems? Let's connect.
            </p>
            <Button asChild size="lg" className="mt-8 font-mono text-sm">
              <Link to="/contact">ping me</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
}
