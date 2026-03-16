import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "~", path: "/" },
  { label: "/about", path: "/about" },
  { label: "/projects", path: "/projects" },
  { label: "/blog", path: "/blog" },
  { label: "/contact", path: "/contact" },
];

function PublicHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container-wide flex items-center justify-between h-14 px-6">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm font-medium text-primary">
          <Terminal className="h-4 w-4" />
          <span className="glow-text">sysadmin@portfolio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-b border-border bg-background px-6 py-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 font-mono text-sm transition-colors ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary">$</span> echo "© {new Date().getFullYear()} — all systems nominal"
        </p>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
            /admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 pt-14">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
