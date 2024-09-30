/**
 * @param {import("express").CookieOptions} cookieOptions
 * @returns {import("express").CookieOptions}
 */
export function createCookieOptions(cookieOptions = {}) {
  const defaultOptions = {
    httpOnly: true, // The Cookie can only be accessed on the server
    secure: process.env.NODE_ENV === 'production', // Use `https` on production
    sameSite: 'strict', // Can only be accessed in the same domain
    maxAge: 1000 * 60 * 60, // Default to 1 hour
  };

  return { ...defaultOptions, ...cookieOptions };
}
