/**
 * Regular expression for validating usernames.
 *
 * Usernames are allowed to have:
 * - Letters (both uppercase and lowercase)
 * - Numbers (0-9)
 * - Dots (.)
 * - Underscores (_)
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;
