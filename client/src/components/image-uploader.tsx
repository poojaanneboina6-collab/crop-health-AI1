import { useState, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onImageChange: (base64: string | null) => void;
  isLoading?: boolean;
}

export function ImageUploader({ onImageChange, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              relative w-full h-80 rounded-3xl border-3 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300
              ${isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-primary/20 bg-card hover:border-primary/50 hover:bg-primary/5"}
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              Upload leaf image
            </h3>
            <p className="text-muted-foreground font-medium max-w-sm">
              Drag and drop an image of the affected crop leaf here, or click to browse files.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 group bg-black"
          >
            <img 
              src={preview} 
              alt="Leaf preview" 
              className={`w-full h-80 object-cover opacity-90 transition-opacity duration-300 ${isLoading ? 'opacity-50' : ''}`}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {!isLoading && (
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white font-medium text-sm">
              <ImageIcon className="w-4 h-4" />
              Ready to analyze
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
