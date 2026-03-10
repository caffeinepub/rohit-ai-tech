import { Play, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TILE_GRADIENTS = [
  {
    from: "from-[#1a0050]",
    via: "via-[#2d0080]",
    to: "to-[#0f0035]",
    accent:
      "radial-gradient(ellipse 80% 60% at 40% 40%, oklch(0.55 0.28 300 / 0.55) 0%, transparent 70%)",
  },
  {
    from: "from-[#001f3f]",
    via: "via-[#003366]",
    to: "to-[#001a2e]",
    accent:
      "radial-gradient(ellipse 70% 70% at 60% 50%, oklch(0.58 0.2 240 / 0.5) 0%, transparent 65%)",
  },
  {
    from: "from-[#001a1a]",
    via: "via-[#003333]",
    to: "to-[#002020]",
    accent:
      "radial-gradient(ellipse 75% 55% at 50% 60%, oklch(0.65 0.18 185 / 0.55) 0%, transparent 65%)",
  },
  {
    from: "from-[#1f0a00]",
    via: "via-[#3d1500]",
    to: "to-[#2a0800]",
    accent:
      "radial-gradient(ellipse 65% 70% at 60% 35%, oklch(0.65 0.22 35 / 0.55) 0%, transparent 60%)",
  },
  {
    from: "from-[#0d001f]",
    via: "via-[#200040]",
    to: "to-[#0a0015]",
    accent:
      "radial-gradient(ellipse 80% 65% at 45% 45%, oklch(0.6 0.25 320 / 0.5) 0%, transparent 70%)",
  },
  {
    from: "from-[#001a0d]",
    via: "via-[#003020]",
    to: "to-[#001510]",
    accent:
      "radial-gradient(ellipse 70% 60% at 40% 55%, oklch(0.62 0.2 155 / 0.5) 0%, transparent 65%)",
  },
  {
    from: "from-[#1a1200]",
    via: "via-[#3a2800]",
    to: "to-[#1a1000]",
    accent:
      "radial-gradient(ellipse 75% 65% at 55% 40%, oklch(0.68 0.2 75 / 0.5) 0%, transparent 65%)",
  },
  {
    from: "from-[#00101f]",
    via: "via-[#001f3a]",
    to: "to-[#000d18]",
    accent:
      "radial-gradient(ellipse 85% 60% at 50% 50%, oklch(0.6 0.22 220 / 0.5) 0%, transparent 70%)",
  },
  {
    from: "from-[#1f001a]",
    via: "via-[#3a0035]",
    to: "to-[#150012]",
    accent:
      "radial-gradient(ellipse 70% 70% at 45% 45%, oklch(0.58 0.25 340 / 0.5) 0%, transparent 65%)",
  },
];

const TILES = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  isVideo: i % 3 === 2,
  gradient: TILE_GRADIENTS[i % TILE_GRADIENTS.length],
  label: [
    "AI Art Studio",
    "Neural Landscapes",
    "Deep Dream",
    "Quantum Visuals",
    "Tech Horizons",
    "Data Waves",
    "Cyber Gardens",
    "Pixel Dreams",
    "Code Poetry",
    "Light Fractals",
    "Neon Nights",
    "Digital Bloom",
    "Void Canvas",
    "Prism Reality",
    "Signal Drift",
    "Echo Chambers",
    "Infinity Loop",
    "Stargate Vision",
  ][i],
}));

// Layout pattern for 9-item cycle
function getTileStyle(index: number): React.CSSProperties {
  const pos = index % 9;
  switch (pos) {
    case 0:
      return { gridRow: "span 2", gridColumn: "span 2" };
    case 1:
      return {};
    case 2:
      return {};
    case 3:
      return {};
    case 4:
      return { gridRow: "span 2" };
    case 5:
      return {};
    case 6:
      return { gridColumn: "span 2" };
    case 7:
      return {};
    case 8:
      return {};
    default:
      return {};
  }
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? TILES.filter((t) => t.label.toLowerCase().includes(query.toLowerCase()))
    : TILES;

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-white/[0.06] px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <input
            data-ocid="explore.search_input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Rohit AI Tech..."
            className="w-full h-10 bg-white/[0.07] border border-white/[0.1] rounded-full pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Mosaic Grid */}
      <div
        className="grid gap-[2px] p-0"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {filtered.map((tile, index) => (
          <motion.div
            key={tile.id}
            data-ocid={`explore.item.${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            style={getTileStyle(index)}
            className="relative overflow-hidden cursor-pointer group"
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tile.gradient.from} ${tile.gradient.via} ${tile.gradient.to}`}
            />
            <div
              className="absolute inset-0"
              style={{ background: tile.gradient.accent }}
            />
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "100px 100px",
              }}
            />
            {/* Aspect ratio spacer for 1x1 cells */}
            {!getTileStyle(index).gridRow &&
              !getTileStyle(index).gridColumn && (
                <div style={{ paddingBottom: "100%" }} />
              )}
            {/* Tall (span 2 rows) — needs height anchor */}
            {getTileStyle(index).gridRow === "span 2" &&
              !getTileStyle(index).gridColumn && (
                <div style={{ paddingBottom: "200%" }} />
              )}
            {/* Wide (span 2 cols) */}
            {getTileStyle(index).gridColumn === "span 2" &&
              !getTileStyle(index).gridRow && (
                <div style={{ paddingBottom: "50%" }} />
              )}
            {/* Large (span 2x2) */}
            {getTileStyle(index).gridRow === "span 2" &&
              getTileStyle(index).gridColumn === "span 2" && (
                <div style={{ paddingBottom: "100%" }} />
              )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

            {/* Video play icon */}
            {tile.isVideo && (
              <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <Play className="h-3.5 w-3.5 text-white fill-white" />
              </div>
            )}

            {/* Label on hover */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-[10px] font-medium text-white/90 truncate">
                {tile.label}
              </p>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div
            data-ocid="explore.empty_state"
            className="col-span-3 flex flex-col items-center justify-center py-20 text-center"
          >
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground/50">
              No results for "{query}"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-8 text-center mt-auto">
        <p className="text-[11px] text-muted-foreground/30">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/50 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
