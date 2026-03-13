import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicLayout from "@/layouts/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, categories(name), project_tags(tags(name)), project_images(*)")
        .eq("slug", slug!)
        .maybeSingle();
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="section-padding container-narrow space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!project) {
    return (
      <PublicLayout>
        <div className="section-padding container-narrow text-center">
          <h1 className="font-heading text-3xl font-bold">Project not found</h1>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="section-padding">
        <div className="container-narrow">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.categories?.name && <Badge variant="secondary">{project.categories.name}</Badge>}
            {project.project_tags?.map((pt: any) => (
              <Badge key={pt.tags?.name} variant="outline">{pt.tags?.name}</Badge>
            ))}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>

          {project.description && (
            <p className="text-lg text-muted-foreground mb-8">{project.description}</p>
          )}

          <div className="flex gap-3 mb-10">
            {project.live_url && (
              <Button asChild size="sm">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Site
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline" size="sm">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Source
                </a>
              </Button>
            )}
          </div>

          {project.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-10">
              <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          {project.content && (
            <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
          )}

          {/* Additional images */}
          {project.project_images && project.project_images.length > 0 && (
            <div className="mt-12 grid md:grid-cols-2 gap-4">
              {project.project_images.map((img: any) => (
                <div key={img.id} className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <img src={img.url} alt={img.alt_text || project.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
