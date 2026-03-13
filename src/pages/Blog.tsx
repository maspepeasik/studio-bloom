import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import PublicLayout from "@/layouts/PublicLayout";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories", "blog"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").eq("type", "blog");
      return data ?? [];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*, categories(name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
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
            <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Blog</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Articles & Thoughts</h1>
            <p className="text-muted-foreground max-w-lg mb-8">
              Writing about development, design, and the things I learn along the way.
            </p>
          </AnimatedSection>

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
              {posts?.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.05}>
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
          )}

          {!isLoading && posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No posts yet. Check back soon!</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
