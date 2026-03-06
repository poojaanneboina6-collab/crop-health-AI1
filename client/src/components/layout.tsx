import { Link, useLocation } from "wouter";
import { Leaf, History, Sprout } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sprout className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
                  Crop Health <span className="text-primary">AI</span>
                </h1>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Smart Agriculture Diagnostic
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-2 md:gap-4">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location === "/"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <Leaf className="w-4 h-4" />
                <span className="hidden sm:inline">New Scan</span>
              </Link>
              
              <Link
                href="/history"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  location === "/history"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="py-8 text-center text-muted-foreground text-sm font-medium border-t border-black/5 mt-auto glass-panel">
        <p>© {new Date().getFullYear()} Crop Health AI. Precision farming made simple.</p>
      </footer>
    </div>
  );
}
