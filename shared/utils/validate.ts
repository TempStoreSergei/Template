/**
 * Checks if a given path is an external link.
 * An external link is defined as a path starting with `http://`, `https://`, `mailto:`, or `tel:`.
 *
 * @param path - The URL or path to be checked.
 * @returns True if the path is an external link; otherwise, false.
 *
 * Example:
 * ```
 * isExternal('https://example.com'); // true
 * isExternal('mailto:someone@example.com'); // true
 * isExternal('/internal/path'); // false
 * ```
 */
export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
