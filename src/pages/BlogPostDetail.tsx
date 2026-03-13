import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicLayout from "@/layouts/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*, categories(name), blog_post_tags(tags(name))")
        .eq("slug", slug!)
        .eq("status", "published")
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

  if (!post) {
    return (
      <PublicLayout>
        <div className="section-padding container-narrow text-center">
          <h1 className="font-heading text-3xl font-bold">Post not found</h1>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
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
            <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.categories?.name && <Badge variant="secondary">{post.categories.name}</Badge>}
            {post.blog_post_tags?.map((pt: any) => (
              <Badge key={pt.tags?.name} variant="outline">{pt.tags?.name}</Badge>
            ))}
            {post.published_at && (
              <span className="text-sm text-muted-foreground">
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-10">
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {post.content && (
            <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
