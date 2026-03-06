import { Layout } from "@/components/layout";
import { useScans } from "@/hooks/use-scans";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { History as HistoryIcon, Sprout, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function History() {
  const { data: scans, isLoading, error } = useScans();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Scan History</h2>
            <p className="text-muted-foreground font-medium">Review your previous crop diagnostics.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-panel rounded-3xl border-destructive/20 text-destructive font-medium">
            Failed to load history. Please try again later.
          </div>
        ) : !scans?.length ? (
          <div className="py-20 text-center glass-panel rounded-3xl flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Sprout className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">No scans yet</h3>
            <p className="text-muted-foreground font-medium mb-8 max-w-md">
              You haven't analyzed any crops. Head to the new scan page to detect your first disease.
            </p>
            <Link href="/" className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start Scanning
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan, i) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group glass-panel rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col"
              >
                <div className="relative h-48 bg-black overflow-hidden">
                  <img 
                    src={scan.imageUrl} 
                    alt={scan.diseaseName}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                      {scan.createdAt ? format(new Date(scan.createdAt), "MMM d, yyyy") : "Unknown date"}
                    </div>
                    <h4 className="text-lg font-display font-bold leading-tight line-clamp-1">{scan.diseaseName}</h4>
                  </div>
                </div>
                
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Treatment</p>
                    <p className="font-medium text-foreground line-clamp-2 leading-relaxed">{scan.treatment}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 text-accent-foreground text-xs font-bold">
                      {scan.diseaseConfidence.toFixed(0)}% Match
                    </span>
                    <button className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 group/btn">
                      Details 
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
