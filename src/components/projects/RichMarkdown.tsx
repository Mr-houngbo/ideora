"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AccentTheme } from "@/lib/accent-themes";

interface RichMarkdownProps {
  content: string;
  theme: AccentTheme;
}

const RichMarkdown = ({ content, theme }: RichMarkdownProps) => {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-5 first:mt-0" style={{ color: theme.solid }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-4 first:mt-0" style={{ color: theme.solid }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h4
              className="text-sm font-bold uppercase tracking-[0.15em] mt-8 mb-3"
              style={{ color: theme.solid }}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-8 border-l-4 pl-6 py-1 italic text-xl md:text-2xl font-light leading-relaxed text-foreground"
              style={{ borderColor: theme.solid }}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => <strong className="font-semibold" style={{ color: theme.solid }} {...props} />,
          a: ({ node, ...props }) => <a className="underline underline-offset-2 hover:opacity-80" style={{ color: theme.solid }} {...props} />,
          ul: ({ node, ...props }) => <ul className="space-y-2 my-4 list-none pl-0" {...props} />,
          ol: ({ node, ...props }) => <ol className="space-y-2 my-4 list-decimal pl-5 marker:font-semibold" style={{ color: theme.solid }} {...props} />,
          li: ({ node, children, ...props }) => (
            <li className="flex items-start gap-3 text-muted-foreground" {...props}>
              <span className="mt-2.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: theme.solid }} />
              <span>{children}</span>
            </li>
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead style={{ background: theme.soft }} {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{ color: theme.solid }} {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3 border-t border-border text-muted-foreground" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed text-muted-foreground my-4" {...props} />,
          hr: ({ node, ...props }) => (
            <div className="my-10 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.solid}66, transparent)` }} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default RichMarkdown;
