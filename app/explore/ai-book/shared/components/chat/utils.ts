/**
 * Utility functions for Chat Interface
 */

/**
 * Convert markdown to plain text
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return "";
  
  let text = markdown;
  
  // Remove code blocks (```code```)
  text = text.replace(/```[\s\S]*?```/g, "");
  
  // Remove inline code (`code`)
  text = text.replace(/`([^`]+)`/g, "$1");
  
  // Remove headers (# Header)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, "$1");
  
  // Remove bold (**text** or __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  
  // Remove italic (*text* or _text_)
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  
  // Remove links [text](url)
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  
  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");
  
  // Remove strikethrough (~~text~~)
  text = text.replace(/~~([^~]+)~~/g, "$1");
  
  // Remove blockquotes (> text)
  text = text.replace(/^>\s+(.+)$/gm, "$1");
  
  // Remove horizontal rules (--- or ***)
  text = text.replace(/^[-*]{3,}$/gm, "");
  
  // Remove list markers (-, *, +, 1.)
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, "$1");
  text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, "$1");
  
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, "\n\n");
  
  // Trim whitespace
  text = text.trim();
  
  return text;
}
