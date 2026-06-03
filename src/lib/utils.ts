// src/lib/utils.ts
/**
 * Merge class names together, filtering out falsy values.
 * Drop-in compatible with clsx / classnames.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function timeAgo(dateParam: string | Date): string {
  if (!dateParam) {
    return "";
  }
  
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  
  if (date.getFullYear() === 1970) {
    return "Unknown date";
  }

  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hr ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
}

export function stripHtml(html: string | undefined): string {
  if (!html) return "";
  // Basic regex to strip HTML tags
  return html.replace(/<[^>]*>?/gm, '');
}
