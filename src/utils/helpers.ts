export function extractProductIdentifier(sku: string): string | null {
    const match = sku.match(/vutuk_(\w+_\d+)/); // matches "vutuk_vase49"
    return match ? match[1] : null;
  }