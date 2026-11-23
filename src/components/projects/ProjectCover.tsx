import { cn } from "@/lib/utils";
import { getAccentTheme } from "@/lib/accent-themes";
import { isEducationCategory, type Project } from "@/types/project";

/** Small, stable hash so a project always gets the same generated cover. */
function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Gradient stops for a project without an image: its accent theme, or the brand / academic gradient. */
function coverColors(project: Pick<Project, "accent_theme" | "categorie">): [string, string, string] {
  if (project.accent_theme) {
    const t = getAccentTheme(project.accent_theme);
    return [t.from, t.via, t.to];
  }
  if (isEducationCategory(project.categorie)) {
    return ["hsl(175 70% 38%)", "hsl(185 75% 45%)", "hsl(195 85% 52%)"];
  }
  return ["hsl(265 85% 52%)", "hsl(290 80% 58%)", "hsl(350 85% 60%)"];
}

const PATTERNS = ["rings", "grid", "waves", "dots"] as const;

function Pattern({ kind, seed }: { kind: (typeof PATTERNS)[number]; seed: number }) {
  const x = 20 + (seed % 60);
  const y = 15 + ((seed >> 8) % 50);
  switch (kind) {
    case "rings":
      return (
        <g fill="none" stroke="white" strokeOpacity="0.18">
          {[40, 80, 120, 160, 200, 240].map((r) => (
            <circle key={r} cx={`${x}%`} cy={`${y}%`} r={r} strokeWidth="1.2" />
          ))}
        </g>
      );
    case "grid":
      return (
        <g stroke="white" strokeOpacity="0.12">
          {Array.from({ length: 24 }, (_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="600" />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="960" y2={i * 40} />
          ))}
        </g>
      );
    case "waves":
      return (
        <g fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="1.5">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M0 ${80 + i * 55} C 240 ${20 + i * 55}, 480 ${140 + i * 55}, 960 ${60 + i * 55}`} />
          ))}
        </g>
      );
    case "dots":
      return (
        <g fill="white" fillOpacity="0.16">
          {Array.from({ length: 24 * 14 }, (_, i) => (
            <circle key={i} cx={(i % 24) * 40 + 20} cy={Math.floor(i / 24) * 40 + 20} r="2" />
          ))}
        </g>
      );
  }
}

interface ProjectCoverProps {
  project: Pick<Project, "id" | "titre" | "categorie" | "accent_theme" | "image_url">;
  className?: string;
  /** Show the project's initials as a large watermark (cards); the detail hero prints the title itself. */
  watermark?: boolean;
  imgClassName?: string;
  eager?: boolean;
}

/**
 * A project's cover: its uploaded image, or a generated one built from its
 * colours and a pattern picked from its id, so every project is recognisable
 * at a glance even without an image.
 */
export default function ProjectCover({ project, className, watermark = false, imgClassName, eager }: ProjectCoverProps) {
  if (project.image_url) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* Plain <img>: images come from the login-protected /api/images route, which next/image's
            server-side optimizer cannot fetch without the session cookie. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image_url}
          alt={project.titre}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
    );
  }

  const seed = hashString(project.id);
  const [from, via, to] = coverColors(project);
  const angle = 115 + (seed % 50);
  const pattern = PATTERNS[seed % PATTERNS.length];
  const initials = project.titre
    .split(/\s+/)
    // Skip short linking words ("à", "de", "la") so "Postuler à AIMS" reads PA, not PÀ.
    .filter((w) => /^[\p{L}\p{N}]/u.test(w) && (w.length > 2 || /^\p{Lu}/u.test(w)))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${via}, ${to})` }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice">
        <Pattern kind={pattern} seed={seed} />
      </svg>
      <div
        className="absolute -right-16 -top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ background: to, opacity: 0.45 }}
      />
      {watermark && initials && (
        <span className="absolute bottom-2 right-4 select-none text-7xl font-extrabold leading-none tracking-tighter text-white/25">
          {initials}
        </span>
      )}
    </div>
  );
}
