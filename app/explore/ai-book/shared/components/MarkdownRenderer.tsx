"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Professional markdown renderer for AI chat responses
 * Handles code blocks, lists, headings, links, and other markdown features
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={{
        // Headings
        h1: ({ node, ...props }) => (
          <h1 className="text-lg font-bold text-brand-heading mt-4 mb-2 first:mt-0" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-base font-semibold text-brand-heading mt-3 mb-2 first:mt-0" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-sm font-semibold text-brand-heading mt-2 mb-1 first:mt-0" {...props} />
        ),
        // Paragraphs
        p: ({ node, ...props }) => (
          <p className="text-sm leading-relaxed text-brand-heading mb-2 last:mb-0" {...props} />
        ),
        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-brand-heading" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-brand-heading" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-sm leading-relaxed text-brand-heading" {...props} />
        ),
        // Code blocks
        code: ({ node, className, children, ...props }: any) => {
          const isInline = !className;
          return isInline ? (
            <code
              className="bg-brand-bg px-1.5 py-0.5 rounded text-xs font-mono text-brand-primary border border-brand-border/30"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="block bg-brand-bg p-3 rounded-md text-xs font-mono text-brand-heading border border-brand-border/30 overflow-x-auto mb-2"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ node, ...props }) => (
          <pre className="bg-brand-bg p-3 rounded-md border border-brand-border/30 overflow-x-auto mb-2" {...props} />
        ),
        // Links
        a: ({ node, ...props }) => (
          <a
            className="text-brand-primary hover:text-brand-primary-hover underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-brand-primary/30 pl-3 italic text-brand-light-accent-1 my-2"
            {...props}
          />
        ),
        // Horizontal rule
        hr: ({ node, ...props }) => (
          <hr className="border-brand-border my-3" {...props} />
        ),
        // Strong/Bold
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-brand-heading" {...props} />
        ),
        // Emphasis/Italic
        em: ({ node, ...props }) => (
          <em className="italic text-brand-heading" {...props} />
        ),
        // Tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border-collapse border border-brand-border rounded-md" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-brand-bg" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="border-b border-brand-border" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-3 py-2 text-left text-xs font-semibold text-brand-heading border-r border-brand-border last:border-r-0" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-3 py-2 text-sm text-brand-heading border-r border-brand-border last:border-r-0" {...props} />
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
