import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, MapPinOff, MapPin, Globe } from "lucide-react";
import { Layout } from "@/components/layout";
import { ImageUploader } from "@/components/image-uploader";
import { ScanResult } from "@/components/scan-result";
import { useCreateScan } from "@/hooks/use-scans";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
];

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"pending" | "success" | "error">("pending");
  
  const { toast } = useToast();
  const createScan = useCreateScan();

  // Try to get location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("success");
        },
        () => {
          setLocationStatus("error");
        },
        { timeout: 5000 }
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  const handleAnalyze = () => {
    if (!image) {
      toast({ title: "Image required", description: "Please upload a photo of the affected leaf first.", variant: "destructive" });
      return;
    }
    
    createScan.mutate({
      image,
      language,
      latitude: location?.lat,
      longitude: location?.lng
    }, {
      onError: (err) => {
        toast({
          title: "Analysis Failed",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    });
  };

  const resetForm = () => {
    setImage(null);
    createScan.reset();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">
            Identify Crop Diseases Instantly
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Upload a photo of an affected leaf to get instant AI-powered diagnostics, treatment recommendations, and locate your nearest supplier.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!createScan.data ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 md:p-8 rounded-3xl"
            >
              <div className="space-y-8">
                {/* Uploader */}
                <ImageUploader 
                  onImageChange={setImage} 
                  isLoading={createScan.isPending} 
                />

                {/* Controls grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Language Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      Output Language
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={createScan.isPending}
                        className="w-full appearance-none bg-card border-2 border-border rounded-xl px-4 py-3.5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Location Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      {locationStatus === "success" ? <MapPin className="w-4 h-4 text-primary" /> : <MapPinOff className="w-4 h-4 text-muted-foreground" />}
                      Location Status
                    </label>
                    <div className={`w-full border-2 rounded-xl px-4 py-3.5 flex items-center gap-3 font-medium transition-colors ${
                      locationStatus === "success" 
                        ? "bg-primary/5 border-primary/20 text-primary-foreground" 
                        : "bg-black/5 border-transparent text-muted-foreground"
                    }`}>
                      {locationStatus === "success" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-foreground">Coordinates acquired</span>
                        </>
                      ) : locationStatus === "pending" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Detecting location...</span>
                        </>
                      ) : (
                        <span>Location unavailable (Optional)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!image || createScan.isPending}
                  className="w-full relative overflow-hidden group px-6 py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-3">
                    {createScan.isPending ? (
                      <>
                        <ScanSearch className="w-6 h-6 animate-pulse" />
                        Analyzing Crop...
                      </>
                    ) : (
                      <>
                        <ScanSearch className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Analyze Disease
                      </>
                    )}
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ScanResult scan={createScan.data} />
              
              <div className="mt-8 text-center">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white font-bold text-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Scan Another Leaf
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
