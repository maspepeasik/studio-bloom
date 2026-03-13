import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface SeoForm {
  page_path: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const defaultPages = ["/", "/about", "/projects", "/blog", "/contact"];

export default function AdminSeo() {
  const queryClient = useQueryClient();

  const { data: seoEntries } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_metadata").select("*").order("page_path");
      return data ?? [];
    },
  });

  return (
    <AdminLayout>
      <h2 className="text-lg font-semibold mb-6">SEO Manager</h2>
      <div className="space-y-6">
        {defaultPages.map((path) => {
          const existing = seoEntries?.find((e) => e.page_path === path);
          return <SeoCard key={path} pagePath={path} existing={existing} />;
        })}
      </div>
    </AdminLayout>
  );
}

function SeoCard({ pagePath, existing }: { pagePath: string; existing?: any }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SeoForm>({
    page_path: pagePath,
    meta_title: "",
    meta_description: "",
    og_image: "",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        page_path: pagePath,
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || "",
        og_image: existing.og_image || "",
      });
    }
  }, [existing, pagePath]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("seo_metadata")
        .upsert(form, { onConflict: "page_path" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-seo"] });
      toast.success(`SEO for ${pagePath} saved`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-heading">{pagePath}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="Page title (max 60 chars)" maxLength={60} />
        </div>
        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} placeholder="Page description (max 160 chars)" maxLength={160} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>OG Image URL</Label>
          <Input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} placeholder="https://..." />
        </div>
        <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
