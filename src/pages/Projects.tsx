import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import PublicLayout from "@/layouts/PublicLayout";
import AnimatedSection from "@/components/AnimatedSection";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories", "project"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").eq("type", "project");
      return data ?? [];
    },
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*, categories(name), project_tags(tags(name))")
        .order("sort_order");
      if (selectedCategory) query = query.eq("category_id", selectedCategory);
      const { data } = await query;
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Portfolio</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Projects</h1>
            <p className="text-muted-foreground max-w-lg mb-8">
              A collection of work spanning design, development, and everything in between.
            </p>
          </AnimatedSection>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-10">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 0.05}>
                  <ProjectCard
                    title={project.title}
                    slug={project.slug}
                    description={project.description}
                    featuredImage={project.featured_image}
                    category={project.categories?.name}
                    tags={project.project_tags?.map((pt: any) => pt.tags?.name).filter(Boolean)}
                  />
                </AnimatedSection>
              ))}
            </div>
          )}

          {!isLoading && projects?.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No projects yet. Check back soon!</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
