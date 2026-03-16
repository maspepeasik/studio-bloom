# Memory: index.md
Updated: now

CMS-powered portfolio with dark terminal/sysadmin aesthetic, green accent, monospace fonts.

## Design System
- Accent: HSL 142 72% 45% (terminal green)
- Background: HSL 220 15% 6% (dark navy-black)
- Fonts: JetBrains Mono (headings/mono), IBM Plex Sans (body)
- Style: Dark terminal aesthetic, monospace UI labels, blinking cursor effects
- No light mode — dark-only theme
- Border radius: 0.25rem (sharp, minimal)

## Architecture
- Public pages: Home, About, Projects, Blog, Contact
- Admin pages: /admin/* (dashboard, projects, blog, media, pages, messages, seo, settings)
- Auth: Supabase auth with admin role check via has_role() RPC
- DB: categories, tags, projects, blog_posts, media, page_content, contact_messages, seo_metadata, user_roles
- Storage: "media" bucket for uploads

## Security
- RLS on all tables, admin-only write via has_role() security definer function
- Contact messages: public INSERT, admin-only SELECT/UPDATE/DELETE
- Contact form INSERT WITH CHECK(true) is intentional for public form

## Theme Details
- Nav uses terminal-style paths (~, /about, /projects, etc.)
- Header brand: "sysadmin@portfolio" with Terminal icon
- Footer: shell-style copyright
- Default skills: Linux, Bash, Python, Ansible, Terraform, Docker, K8s, etc.
- Cards have green glow on hover
- Blog dates in ISO format (yyyy-MM-dd)
