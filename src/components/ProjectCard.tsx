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
      <Card className="group overflow-hidden border-border card-elevated bg-card hover:border-primary/30 transition-colors">
        {featuredImage && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-sm font-semibold group-hover:text-primary transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>
          {description && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {category && (
              <Badge variant="secondary" className="text-[10px] font-mono">{category}</Badge>
            )}
            {tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] font-mono">{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
