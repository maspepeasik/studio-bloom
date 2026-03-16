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
    bio: "Systems administrator with a passion for automation, reliability engineering, and keeping uptime at five nines. I believe in infrastructure as code, monitoring everything, and writing runbooks before incidents happen.",
    image: "",
  };

  const experience = experienceContent?.items || [
    { title: "Senior Systems Administrator", company: "Enterprise Corp", period: "2022 – Present", description: "Managing hybrid cloud infrastructure across AWS and on-prem. Leading migration from legacy systems to containerized workloads." },
    { title: "DevOps Engineer", company: "Tech Startup", period: "2020 – 2022", description: "Built CI/CD pipelines, managed Kubernetes clusters, and automated infrastructure provisioning with Terraform." },
    { title: "Linux Systems Admin", company: "Hosting Company", period: "2018 – 2020", description: "Managed 200+ Linux servers, implemented monitoring with Prometheus/Grafana, and handled incident response." },
  ];

  const education = educationContent?.items || [
    { degree: "B.S. Computer Science", school: "University", year: "2018" },
    { degree: "RHCE Certification", school: "Red Hat", year: "2019" },
    { degree: "CKA - Certified Kubernetes Admin", school: "CNCF", year: "2021" },
  ];

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">cat /etc/about</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">{profile.name}<span className="text-primary animate-blink">_</span></h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">{profile.bio}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding border-t border-border">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">history | grep experience</p>
            <h2 className="font-heading text-2xl font-bold mb-10">Experience</h2>
          </AnimatedSection>
          <div className="space-y-8 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-primary/20 pl-8">
            {experience.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <p className="font-mono text-xs text-muted-foreground mb-1">{item.period}</p>
                  <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="text-primary text-sm font-mono">{item.company}</p>
                  <p className="mt-2 text-muted-foreground text-sm">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Education */}
      <section className="section-padding border-t border-border">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-2">ls ~/certs</p>
            <h2 className="font-heading text-2xl font-bold mb-8">Certifications & Education</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {education.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-4 rounded bg-card border border-border">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 font-mono text-xs">{item.year}</Badge>
                  <div>
                    <h3 className="font-heading text-sm font-semibold">{item.degree}</h3>
                    <p className="text-muted-foreground text-xs font-mono">{item.school}</p>
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
