import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  { icon: Zap, label: "AI-Powered" },
  { icon: Users, label: "Social" },
  { icon: Globe, label: "Global" },
];

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Atmospheric background orbs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="orb-1 absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.78_0.14_185/0.15)_0%,transparent_70%)]" />
        <div className="orb-2 absolute -bottom-60 -right-20 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.65_0.18_200/0.12)_0%,transparent_65%)]" />
        <div className="orb-3 absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.78_0.14_185/0.08)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.78 0.14 185) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 right-[15%] h-full w-px opacity-[0.06]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, oklch(0.78 0.14 185) 30%, oklch(0.78 0.14 185) 70%, transparent 100%)",
          }}
        />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full blur-2xl bg-[radial-gradient(circle,oklch(0.78_0.14_185/0.3)_0%,transparent_70%)] scale-150" />
            <img
              src="/assets/generated/rohit-ai-tech-logo-transparent.dim_400x400.png"
              alt="Rohit AI Tech Logo"
              className="relative h-24 w-24 md:h-28 md:w-28 object-contain drop-shadow-[0_0_20px_oklch(0.78_0.14_185/0.6)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium tracking-widest uppercase text-primary">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="font-display font-black leading-[1.05] tracking-tight">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Rohit
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl shimmer-text">
              AI Tech
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-10 max-w-sm text-base md:text-lg font-body text-muted-foreground leading-relaxed"
        >
          Your AI-powered social experience — connect, create, and grow with the
          future of social media.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-10 flex items-center gap-3"
        >
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              <Icon className="h-3 w-3 text-primary" />
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.75,
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <Button
            data-ocid="welcome.primary_button"
            size="lg"
            onClick={onGetStarted}
            className="btn-glow group relative h-14 min-w-[200px] rounded-full bg-primary text-primary-foreground font-display font-bold text-base tracking-wide px-8 transition-all duration-300 hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6 text-xs text-muted-foreground/60"
        >
          Join thousands already on the platform
        </motion.p>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-xs text-muted-foreground/40"
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline hover:text-muted-foreground/60 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </motion.p>
      </footer>
    </div>
  );
}
