import { copyTextToClipboard, supportsMatchMedia } from '@/src/lib/browser';

describe('Browser compatibility helpers', () => {
  const originalClipboard = global.navigator.clipboard;
  const originalExecCommand = document.execCommand;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: originalClipboard,
    });

    document.execCommand = originalExecCommand;
    window.matchMedia = originalMatchMedia;
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: originalClipboard,
    });
    document.execCommand = originalExecCommand;
    window.matchMedia = originalMatchMedia;
  });

  it('copies text using navigator.clipboard when available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: { writeText },
    });

    await copyTextToClipboard('test-copy');

    expect(writeText).toHaveBeenCalledWith('test-copy');
  });

  it('falls back to execCommand copy when clipboard API is unavailable', async () => {
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const execCommand = jest.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    await copyTextToClipboard('fallback-copy');

    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('rejects when neither clipboard API nor execCommand are available', async () => {
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    document.execCommand = jest.fn().mockReturnValue(false);

    await expect(copyTextToClipboard('failure-copy')).rejects.toThrow(
      'Copy command failed'
    );
  });

  it('reports unsupported matchMedia safely', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    expect(supportsMatchMedia()).toBe(false);
  });
});
