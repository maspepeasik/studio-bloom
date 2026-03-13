import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PublicLayout from "@/layouts/PublicLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  const { data: aboutContent } = useQuery({
    queryKey: ["page-content", "about", "profile"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "about")
        .eq("section", "profile")
        .maybeSingle();
      return data?.content as Record<string, any> | null;
    },
  });

  const { data: experienceContent } = useQuery({
    queryKey: ["page-content", "about", "experience"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "about")
        .eq("section", "experience")
        .maybeSingle();
      return data?.content as { items?: Array<{ title: string; company: string; period: string; description: string }> } | null;
    },
  });

  const { data: educationContent } = useQuery({
    queryKey: ["page-content", "about", "education"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "about")
        .eq("section", "education")
        .maybeSingle();
      return data?.content as { items?: Array<{ degree: string; school: string; year: string }> } | null;
    },
  });

  const profile = aboutContent || {
    name: "Your Name",
    bio: "A passionate developer creating beautiful digital experiences.",
    image: "",
  };

  const experience = experienceContent?.items || [
    { title: "Senior Developer", company: "Company A", period: "2022 - Present", description: "Leading frontend development." },
    { title: "Full Stack Developer", company: "Company B", period: "2020 - 2022", description: "Building web applications." },
  ];

  const education = educationContent?.items || [
    { degree: "B.S. Computer Science", school: "University", year: "2020" },
  ];

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">About</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{profile.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{profile.bio}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-bold mb-10">Experience</h2>
          </AnimatedSection>
          <div className="space-y-8 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border pl-8">
            {experience.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                  <p className="text-sm text-muted-foreground mb-1">{item.period}</p>
                  <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="text-accent text-sm font-medium">{item.company}</p>
                  <p className="mt-2 text-muted-foreground text-sm">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-bold mb-8">Education</h2>
          </AnimatedSection>
          <div className="space-y-6">
            {education.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <Badge variant="secondary" className="mt-1 shrink-0">{item.year}</Badge>
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{item.degree}</h3>
                    <p className="text-muted-foreground text-sm">{item.school}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
