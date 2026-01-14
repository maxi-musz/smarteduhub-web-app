/**
 * Text formatting utilities for consistent text formatting across the application
 */

/**
 * Formats a title string by:
 * - Trimming whitespace
 * - Capitalizing first letter of each word
 * - Removing extra spaces
 * - Handling special cases
 * - Normalizes ALL CAPS, lowercase, and Mixed Case to Title Case
 */
export function formatTitle(text: string): string {
  if (!text) return "";

  // First normalize: trim and remove extra spaces
  const normalized = text.trim().replace(/\s+/g, " ");
  
  // Split by spaces and format each word
  return normalized
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      
      // Handle common prepositions and articles (lowercase unless first word)
      
      
      // Handle words with special characters (like "GSM", "JSS1", etc.)
      // If word is all uppercase and 2-4 chars, keep it uppercase (acronyms)
      if (word.length <= 4 && /^[A-Z]+$/.test(word)) {
        return word;
      }
      
      // Handle words with numbers (like "JSS1", "Chapter1")
      if (/\d/.test(word)) {
        // If it's like "JSS1", "GSM2", etc., capitalize appropriately
        const match = word.match(/^([A-Za-z]+)(\d+)$/);
        if (match) {
          const [, letters, numbers] = match;
          // If letters are all uppercase and short, treat as acronym
          if (letters.length <= 4 && /^[A-Z]+$/.test(letters)) {
            return letters + numbers;
          }
          return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase() + numbers;
        }
        // Otherwise, capitalize first letter, lowercase rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      
      // Standard word: capitalize first letter, lowercase rest
      // Always capitalize first letter regardless of original case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Formats a description string by:
 * - Trimming whitespace
 * - Removing extra spaces and line breaks
 * - Capitalizing first letter
 */
export function formatDescription(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Replace multiple line breaks with single
    .split(". ")
    .map((sentence) => {
      const trimmed = sentence.trim();
      if (!trimmed) return "";
      
      // Capitalize first letter of each sentence
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .filter((s) => s.length > 0)
    .join(". ");
}

/**
 * Formats text for display (titles, headings, etc.)
 * - Trims whitespace
 * - Removes extra spaces
 * - Preserves original capitalization but cleans up spacing
 */
export function formatDisplayText(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " "); // Replace multiple spaces with single space
}

/**
 * Formats a code or identifier string
 * - Converts to uppercase
 * - Removes spaces and special characters (except hyphens and underscores)
 * - Trims whitespace
 */
export function formatCode(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "") // Remove special chars except hyphens and underscores
    .replace(/\s+/g, ""); // Remove all spaces
}

/**
 * Sanitizes text input by:
 * - Trimming whitespace
 * - Removing control characters
 * - Normalizing whitespace
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Formats chapter/topic title with smart capitalization
 * Handles cases like:
 * - "chapter 1: introduction" -> "Chapter 1: Introduction"
 * - "PART I - BASICS" -> "Part I - Basics"
 * - "INTRODUCTION TO GSM" -> "Introduction To GSM"
 * - "Basic components of mobile phone" -> "Basic Components Of Mobile Phone"
 */
export function formatChapterTitle(text: string): string {
  if (!text) return "";

  const trimmed = text.trim().replace(/\s+/g, " ");
  
  // Handle chapter/part/section prefixes with numbers or roman numerals
  const prefixMatch = trimmed.match(/^(chapter|part|section|unit)\s*(\d+|[ivxlcdm]+)[:.\-]?\s*(.*)$/i);
  if (prefixMatch) {
    const [, prefix, number, rest] = prefixMatch;
    const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
    const formattedRest = rest ? formatTitle(rest) : "";
    
    // Preserve the separator (:, ., or -) if it exists
    const separator = trimmed.match(/^(chapter|part|section|unit)\s*(\d+|[ivxlcdm]+)([:.\-])/i)?.[3] || ":";
    
    return `${formattedPrefix} ${number}${rest ? `${separator} ` : ""}${formattedRest}`;
  }
  
  // Default formatting - this will handle ALL CAPS, lowercase, and mixed case
  return formatTitle(trimmed);
}

/**
 * Formats topic title (simpler than chapter title)
 */
export function formatTopicTitle(text: string): string {
  if (!text) return "";
  
  return formatTitle(text);
}

