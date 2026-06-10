import Link from "next/link";
import { Bot, ChartNoAxesColumnIncreasing, FlaskConical, GraduationCap, Home, Laptop, LogIn, MessageSquareText, Settings, Workflow } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesColumnIncreasing },
  { href: "/missions", label: "Missions", icon: Workflow },
  { href: "/learning", label: "Learning", icon: GraduationCap },
  { href: "/scenarios", label: "Scenarios", icon: Workflow },
  { href: "/studio", label: "Studio", icon: Laptop },
  { href: "/practice", label: "Practice Lab", icon: FlaskConical },
  { href: "/ai-feedback", label: "AI Feedback", icon: MessageSquareText },
  { href: "/auth", label: "Sign in", icon: LogIn },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </span>
            UiPath Practice Lab
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
