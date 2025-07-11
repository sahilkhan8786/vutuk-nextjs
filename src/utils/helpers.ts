export function extractProductIdentifier(sku: string): string | null {
    const match = sku.match(/vutuk_(\w+_\d+)/); // matches "vutuk_vase49"
    return match ? match[1] : null;
}
  
export function getInitials(name: string): string {
  if (!name) return '';

  const words = name.trim().split(' ').filter(Boolean);
  const initials = words.slice(0, 2).map(word => word[0].toUpperCase());

  // If only one word, return first 2 letters from that word
  if (initials.length === 1 && words[0].length > 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return initials.join('');
}

export function formatReadableDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  });
}