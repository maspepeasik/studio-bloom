import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  slug: string;
  description?: string | null;
  featuredImage?: string | null;
  category?: string | null;
  tags?: string[];
}

export default function ProjectCard({ title, slug, description, featuredImage, category, tags }: ProjectCardProps) {
  return (
    <Link to={`/projects/${slug}`}>
      <Card className="group overflow-hidden border-border card-elevated bg-card">
        {featuredImage && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1" />
          </div>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {category && (
              <Badge variant="secondary" className="text-xs">{category}</Badge>
            )}
            {tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
