import { motion } from "framer-motion";
import { ShieldAlert, Droplets, MapPin, Languages, CheckCircle2 } from "lucide-react";
import type { Scan } from "@shared/schema";

export function ScanResult({ scan }: { scan: Scan }) {
  // Stagger animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const confidenceColor = 
    scan.diseaseConfidence > 85 ? "text-green-500" : 
    scan.diseaseConfidence > 60 ? "text-accent" : 
    "text-destructive";

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4 border-b border-black/5 pb-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Analysis Complete</h2>
          <p className="text-muted-foreground font-medium">Here are the diagnostics and recommended actions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diagnosis Card */}
        <motion.div variants={item} className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Diagnosis</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{scan.diseaseName}</p>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-muted-foreground">Confidence:</span>
            <span className={`font-bold ${confidenceColor}`}>
              {scan.diseaseConfidence.toFixed(1)}%
            </span>
          </div>
        </motion.div>

        {/* Treatment Card */}
        <motion.div variants={item} className="bg-gradient-to-br from-card to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">Recommended Treatment</h3>
          </div>
          <p className="text-lg font-medium text-foreground leading-relaxed">
            {scan.treatment}
          </p>
        </motion.div>

        {/* Supplier Card */}
        <motion.div variants={item} className="bg-gradient-to-br from-card to-accent/10 rounded-2xl p-6 border border-accent/20 shadow-sm md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-full bg-accent/20 text-accent-foreground shrink-0">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-foreground mb-1">Nearest Supplier</h3>
            <p className="text-xl font-bold text-foreground">{scan.supplierName}</p>
            <p className="text-muted-foreground font-medium mt-1">{scan.supplierAddress}</p>
          </div>
        </motion.div>
      </div>

      {/* Translated Output */}
      {scan.translatedOutput && scan.language !== 'en' && (
        <motion.div variants={item} className="bg-black/5 rounded-2xl p-6 border border-black/5 mt-2">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display font-bold text-lg text-foreground">Translated Summary ({scan.language})</h3>
          </div>
          <p className="text-foreground/80 font-medium text-lg italic border-l-4 border-primary/40 pl-4 py-1">
            "{scan.translatedOutput}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
