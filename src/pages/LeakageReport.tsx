import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Upload, Send, MapPin, AlertTriangle } from "lucide-react";
import { useState, useCallback } from "react";

const LeakageReport = () => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="rounded-full gradient-primary p-6"
          >
            <AlertTriangle className="h-12 w-12 text-primary-foreground" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-foreground">
            Report Submitted! 🎉
          </motion.h2>
          <p className="text-muted-foreground">Thank you for helping conserve water. Our team will review it shortly.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSubmitted(false); setImage(null); setDescription(""); setLocation(""); }}
            className="mt-4 rounded-lg gradient-primary px-6 py-2 text-primary-foreground font-medium"
          >
            Submit Another
          </motion.button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">🚨 Leakage Report</h1>
          <p className="text-muted-foreground">Report water leaks in your area to help save water.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload */}
          <AnimatedCard>
            <h3 className="font-semibold mb-4 text-foreground">Upload Evidence</h3>
            <motion.div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              whileHover={{ borderColor: "hsl(199, 89%, 48%)" }}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer transition-colors"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {image ? (
                <motion.img
                  src={image}
                  alt="Preview"
                  className="mx-auto max-h-52 rounded-lg object-cover"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-10 w-10" />
                  <p>Drag & drop an image or click to browse</p>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            </motion.div>
          </AnimatedCard>

          {/* Form */}
          <AnimatedCard delay={0.1}>
            <h3 className="font-semibold mb-4 text-foreground">Details</h3>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the leak..."
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-glow disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Report
                  </>
                )}
              </motion.button>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeakageReport;
