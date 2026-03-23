import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";

const facts = [
  { title: "97% of Earth's Water is Saltwater", body: "Only 3% of the world's water is freshwater, and most of it is locked in ice caps. Only about 1% is accessible for human use." },
  { title: "Agriculture Uses 70% of Freshwater", body: "Farming accounts for about 70% of global freshwater withdrawals, making sustainable agriculture crucial." },
  { title: "A Leaky Faucet Wastes 3,000 Gallons/Year", body: "A single dripping faucet can waste more than 3,000 gallons of water per year — enough for 180 showers." },
  { title: "2 Billion People Lack Safe Water", body: "Around 2 billion people worldwide lack access to safely managed drinking water services." },
  { title: "Water Scarcity Affects Every Continent", body: "Water scarcity already affects every continent and is expected to worsen with climate change." },
];

const infographics = [
  { stat: "150L", label: "Average daily usage per person", icon: "🚿" },
  { stat: "10L", label: "Water per minute from a running tap", icon: "🚰" },
  { stat: "80L", label: "Average shower water usage", icon: "🛁" },
  { stat: "6L", label: "Recommended daily drinking water", icon: "💧" },
];

const Awareness = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📚 Water Awareness</h1>
          <p className="text-muted-foreground">Learn about water conservation and its global impact.</p>
        </div>

        {/* Infographic Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infographics.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-2xl font-bold gradient-text">{item.stat}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Accordion Facts */}
        <AnimatedCard delay={0.2}>
          <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Key Facts
          </h3>
          <div className="space-y-2">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                className="rounded-lg border border-border overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{fact.title}</span>
                  <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{fact.body}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default Awareness;
