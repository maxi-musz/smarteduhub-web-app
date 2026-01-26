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
 * - Preserves punctuation and special characters
 */
export function formatTitle(text: string): string {
  if (!text) return "";

  // First normalize: trim and remove extra spaces
  let normalized = text.trim().replace(/\s+/g, " ");
  
  // Remove leading/trailing spaces around punctuation
  normalized = normalized.replace(/\s+([.,:;!?])/g, "$1");
  normalized = normalized.replace(/([.,:;!?])\s+/g, "$1 ");
  
  // Split by spaces and format each word
  return normalized
    .split(" ")
    .map((word, index) => {
      if (word.length === 0) return word;
      
      // Preserve punctuation at the end
      const punctuationMatch = word.match(/^(.+?)([.,:;!?\-]+)$/);
      const coreWord = punctuationMatch ? punctuationMatch[1] : word;
      const punctuation = punctuationMatch ? punctuationMatch[2] : "";
      
      if (coreWord.length === 0) return word;
      
      // Handle common prepositions and articles (lowercase unless first word)
      const lowercaseWords = ["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"];
      const isLowercaseWord = lowercaseWords.includes(coreWord.toLowerCase());
      
      // Always capitalize first word, or if it's not a lowercase word
      if (index === 0 || !isLowercaseWord) {
        // Handle words with special characters (like "GSM", "JSS1", etc.)
        // If word is all uppercase and 2-4 chars, keep it uppercase (acronyms)
        if (coreWord.length <= 4 && /^[A-Z]+$/.test(coreWord)) {
          return coreWord + punctuation;
        }
        
        // Handle words with numbers (like "JSS1", "Chapter1")
        if (/\d/.test(coreWord)) {
          // If it's like "JSS1", "GSM2", etc., capitalize appropriately
          const match = coreWord.match(/^([A-Za-z]+)(\d+)$/);
          if (match) {
            const [, letters, numbers] = match;
            // If letters are all uppercase and short, treat as acronym
            if (letters.length <= 4 && /^[A-Z]+$/.test(letters)) {
              return letters + numbers + punctuation;
            }
            return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase() + numbers + punctuation;
          }
          // Otherwise, capitalize first letter, lowercase rest
          return coreWord.charAt(0).toUpperCase() + coreWord.slice(1).toLowerCase() + punctuation;
        }
        
        // Standard word: capitalize first letter, lowercase rest
        return coreWord.charAt(0).toUpperCase() + coreWord.slice(1).toLowerCase() + punctuation;
      } else {
        // Lowercase word in the middle
        return coreWord.toLowerCase() + punctuation;
      }
    })
    .join(" ")
    .replace(/\s+/g, " ") // Final cleanup of any extra spaces
    .trim();
}

/**
 * Formats a description string by:
 * - Trimming whitespace
 * - Normalizing line breaks and spaces
 * - Capitalizing first letter of each sentence
 * - Properly formatting paragraphs
 */
export function formatDescription(text: string): string {
  if (!text) return "";

  // First, normalize the text
  let formatted = text.trim();
  
  // Replace multiple spaces/tabs with single space
  formatted = formatted.replace(/[ \t]+/g, " ");
  
  // Normalize line breaks: replace 3+ line breaks with double line break (paragraph break)
  formatted = formatted.replace(/\n{3,}/g, "\n\n");
  
  // Replace single line breaks (not paragraph breaks) with space
  formatted = formatted.replace(/([^\n])\n([^\n])/g, "$1 $2");
  
  // Split by sentence endings (period, exclamation, question mark followed by space)
  const sentences = formatted.split(/([.!?])\s+/);
  const result: string[] = [];
  
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i]?.trim();
    const punctuation = sentences[i + 1] || "";
    
    if (!sentence) continue;
    
    // Capitalize first letter of sentence, preserve rest of the text
    const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    
    if (punctuation) {
      result.push(capitalized + punctuation);
    } else {
      result.push(capitalized);
    }
  }
  
  return result
    .join(" ")
    .replace(/\s+/g, " ") // Final cleanup of any extra spaces
    .trim();
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
 * Formats topic title with enhanced formatting:
 * - Applies title case formatting
 * - Handles special cases like acronyms, numbers, and punctuation
 * - Preserves intentional formatting while normalizing case
 */
export function formatTopicTitle(text: string): string {
  if (!text) return "";
  
  // Apply base title formatting
  let formatted = formatTitle(text);
  
  // Handle special cases for topic titles
  // Preserve common academic/technical terms
  const specialTerms: Record<string, string> = {
    "api": "API",
    "http": "HTTP",
    "https": "HTTPS",
    "url": "URL",
    "html": "HTML",
    "css": "CSS",
    "js": "JS",
    "json": "JSON",
    "xml": "XML",
    "sql": "SQL",
    "db": "DB",
    "ui": "UI",
    "ux": "UX",
    "id": "ID",
    "ip": "IP",
    "os": "OS",
  };
  
  // Replace special terms (case-insensitive)
  Object.entries(specialTerms).forEach(([lower, upper]) => {
    const regex = new RegExp(`\\b${lower}\\b`, "gi");
    formatted = formatted.replace(regex, upper);
  });
  
  return formatted;
}

