import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  category?: string | null;
  publishedAt?: string | null;
}

export default function BlogCard({ title, slug, excerpt, featuredImage, category, publishedAt }: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`}>
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
          <div className="flex items-center gap-3 mb-2">
            {category && <Badge variant="secondary" className="text-[10px] font-mono">{category}</Badge>}
            {publishedAt && (
              <span className="text-[10px] text-muted-foreground font-mono">
                {format(new Date(publishedAt), "yyyy-MM-dd")}
              </span>
            )}
          </div>
          <h3 className="font-heading text-sm font-semibold group-hover:text-primary transition-colors">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{excerpt}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
