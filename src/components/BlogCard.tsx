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
          <div className="flex items-center gap-3 mb-3">
            {category && <Badge variant="secondary" className="text-xs">{category}</Badge>}
            {publishedAt && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(publishedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
          <h3 className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
