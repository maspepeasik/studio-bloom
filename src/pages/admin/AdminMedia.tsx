import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

      await supabase.from("media").insert([{
        filename: file.name,
        url: urlData.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id || null,
      }]);
    }

    setUploading(false);
    queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    toast.success("Upload complete");
    e.target.value = "";
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("Media deleted");
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Media Library</h2>
        <div>
          <Label htmlFor="media-upload" className="cursor-pointer">
            <Button asChild disabled={uploading}>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Files"}
              </span>
            </Button>
          </Label>
          <Input
            id="media-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : mediaItems?.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center text-muted-foreground">
            No media files yet. Upload some images to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems?.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={item.url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{item.filename}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
