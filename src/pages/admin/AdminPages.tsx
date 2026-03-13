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
import type { Json } from "@/integrations/supabase/types";

interface SectionData {
  [key: string]: string;
}

function PageSection({ page, section, title }: { page: string; section: string; title: string }) {
  const queryClient = useQueryClient();
  const [fields, setFields] = useState<SectionData>({});

  const { data } = useQuery({
    queryKey: ["page-content", page, section],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", page)
        .eq("section", section)
        .maybeSingle();
      return (data?.content as SectionData) || {};
    },
  });

  useEffect(() => {
    if (data) setFields(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_content")
        .upsert({ page, section, content: fields as unknown as Json }, { onConflict: "page,section" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-content", page, section] });
      toast.success(`${title} saved`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const addField = () => {
    const key = prompt("Field name:");
    if (key && !fields[key]) {
      setFields({ ...fields, [key]: "" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">{key}</Label>
            {typeof value === "string" && value.length > 100 ? (
              <Textarea value={value} onChange={(e) => setFields({ ...fields, [key]: e.target.value })} rows={3} />
            ) : (
              <Input value={String(value)} onChange={(e) => setFields({ ...fields, [key]: e.target.value })} />
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addField}>+ Add Field</Button>
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPages() {
  return (
    <AdminLayout>
      <h2 className="text-lg font-semibold mb-6">Page Content</h2>
      <div className="space-y-6">
        <h3 className="font-heading font-semibold text-muted-foreground uppercase text-sm tracking-wider">Home Page</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <PageSection page="home" section="hero" title="Hero Section" />
          <PageSection page="home" section="skills" title="Skills" />
        </div>

        <h3 className="font-heading font-semibold text-muted-foreground uppercase text-sm tracking-wider mt-8">About Page</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <PageSection page="about" section="profile" title="Profile" />
          <PageSection page="about" section="experience" title="Experience" />
          <PageSection page="about" section="education" title="Education" />
        </div>
      </div>
    </AdminLayout>
  );
}
