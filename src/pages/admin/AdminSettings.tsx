import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <h2 className="text-lg font-semibold mb-6">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Site settings and configuration will be available here.
            You can manage categories, tags, and other site-wide settings.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
