import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PublicLayout from "@/layouts/PublicLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, Terminal } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([{
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject || null,
      message: result.data.message,
    }]);
    setLoading(false);

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">mail -s "contact"</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Get in Touch<span className="text-primary animate-blink">_</span></h1>
            <p className="text-muted-foreground max-w-lg mb-12 text-sm">
              Need help with your infrastructure? Have a project in mind? Send a message.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-12">
            <AnimatedSection delay={0.1} className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-mono text-xs">hostname</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-xs">email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-mono text-xs">subject</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-mono text-xs">message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or infrastructure needs..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading} className="font-mono text-sm">
                  {loading ? "sending..." : "$ send_message"}
                </Button>
              </form>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-medium text-foreground">email</p>
                    <p className="text-muted-foreground text-sm">hello@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-medium text-foreground">location</p>
                    <p className="text-muted-foreground text-sm">Remote / Worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Terminal className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-medium text-foreground">availability</p>
                    <p className="text-muted-foreground text-sm">Open for contracts & consulting</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
