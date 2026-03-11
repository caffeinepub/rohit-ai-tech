import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Globe,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { SessionData } from "../App";

const FEATURES = [
  { icon: Zap, label: "AI-Powered" },
  { icon: Users, label: "Social" },
  { icon: Globe, label: "Global" },
];

interface WelcomeScreenProps {
  onGetStarted: (data: SessionData) => void;
}

type AuthMode = "landing" | "google" | "email";
type FormMode = "login" | "signup";

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("landing");
  const [formMode, setFormMode] = useState<FormMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGetStarted({
        loggedIn: true,
        name: name.trim(),
        email: email.trim(),
        loginMethod: "google",
      });
    }, 800);
  };

  const handleEmailAuth = () => {
    if (formMode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const displayName =
        formMode === "signup" ? name.trim() : email.split("@")[0];
      onGetStarted({
        loggedIn: true,
        name: displayName,
        email: email.trim(),
        loginMethod: "email",
      });
    }, 800);
  };

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
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        {/* Logo + branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-5"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full blur-2xl bg-[radial-gradient(circle,oklch(0.78_0.14_185/0.3)_0%,transparent_70%)] scale-150" />
            <img
              src="/assets/generated/rohit-ai-tech-logo-transparent.dim_400x400.png"
              alt="Rohit AI Tech Logo"
              className="relative h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-[0_0_20px_oklch(0.78_0.14_185/0.6)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium tracking-widest uppercase text-primary">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-3 font-display font-black leading-tight tracking-tight"
        >
          <span className="block text-3xl sm:text-4xl text-foreground">
            Rohit
          </span>
          <span className="block text-4xl sm:text-5xl shimmer-text">
            AI Tech
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 max-w-xs text-sm font-body text-muted-foreground leading-relaxed"
        >
          Your AI-powered social experience — connect, create, and grow.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mb-8 flex items-center gap-2"
        >
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              <Icon className="h-3 w-3 text-primary" />
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Auth forms */}
        <AnimatePresence mode="wait">
          {authMode === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="w-full max-w-[320px] flex flex-col gap-3"
            >
              {/* Google login button */}
              <button
                data-ocid="welcome.google_button"
                type="button"
                onClick={() => setAuthMode("google")}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-white text-gray-800 font-semibold text-[14px] shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                {/* Google G icon */}
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-black"
                  style={{
                    background:
                      "linear-gradient(135deg, #4285F4 0%, #34A853 35%, #FBBC05 65%, #EA4335 100%)",
                    color: "white",
                  }}
                >
                  G
                </span>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                data-ocid="welcome.email_button"
                variant="outline"
                className="w-full h-12 rounded-xl border-border text-foreground font-semibold text-[14px]"
                onClick={() => setAuthMode("email")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Continue with Email
              </Button>

              <p className="text-[11px] text-muted-foreground/50 text-center mt-1">
                By continuing, you agree to our Terms &amp; Privacy Policy.
              </p>
            </motion.div>
          )}

          {authMode === "google" && (
            <motion.div
              key="google"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[320px] bg-secondary/40 border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-black flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #4285F4 0%, #34A853 35%, #FBBC05 65%, #EA4335 100%)",
                    color: "white",
                  }}
                >
                  G
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Sign in with Google
                </span>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-ocid="welcome.name_input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 bg-background/60 border-border text-foreground"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-ocid="welcome.email_input"
                  type="email"
                  placeholder="Gmail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-background/60 border-border text-foreground"
                />
              </div>

              {error && (
                <p
                  data-ocid="welcome.error_state"
                  className="text-[12px] text-red-400 text-center"
                >
                  {error}
                </p>
              )}

              <Button
                data-ocid="welcome.google_submit_button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Continue
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("landing");
                  setError("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}

          {authMode === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[320px] bg-secondary/40 border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              {/* Login / Signup toggle */}
              <div className="flex rounded-xl overflow-hidden border border-border mb-1">
                <button
                  data-ocid="welcome.login_tab"
                  type="button"
                  onClick={() => {
                    setFormMode("login");
                    setError("");
                  }}
                  className={`flex-1 py-2 text-[13px] font-semibold transition-colors ${
                    formMode === "login"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Log In
                </button>
                <button
                  data-ocid="welcome.signup_tab"
                  type="button"
                  onClick={() => {
                    setFormMode("signup");
                    setError("");
                  }}
                  className={`flex-1 py-2 text-[13px] font-semibold transition-colors ${
                    formMode === "signup"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence initial={false}>
                {formMode === "signup" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="relative pb-1">
                      <User className="absolute left-3 top-[calc(50%-8px)] h-4 w-4 text-muted-foreground" />
                      <Input
                        data-ocid="welcome.name_input"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-11 bg-background/60 border-border text-foreground"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-ocid="welcome.email_input"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-background/60 border-border text-foreground"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-ocid="welcome.password_input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEmailAuth();
                  }}
                  className="pl-9 h-11 bg-background/60 border-border text-foreground"
                />
              </div>

              {error && (
                <p
                  data-ocid="welcome.error_state"
                  className="text-[12px] text-red-400 text-center"
                >
                  {error}
                </p>
              )}

              <Button
                data-ocid="welcome.submit_button"
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {formMode === "login" ? "Log In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("landing");
                  setError("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
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
