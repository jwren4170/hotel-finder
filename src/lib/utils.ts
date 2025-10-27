import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Decodes HTML entities in a string
 * @param text - The text containing HTML entities
 * @returns The decoded text
 */
export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Removes HTML tags from a string and decodes HTML entities
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function truncateText(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    // If the string is longer than maxLength, truncate it and add an ellipsis
    return str.slice(0, maxLength - 3) + '...';
  } else {
    // Otherwise, return the original string
    return str;
  }
}
