/**
 * Browser compatibility helpers for frontend shared behavior.
 */

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand?.('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('Copy command failed');
    }

    return;
  }

  throw new Error('Clipboard API not available');
}

export function supportsMatchMedia(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return typeof window.matchMedia === 'function';
  } catch {
    return false;
  }
}
