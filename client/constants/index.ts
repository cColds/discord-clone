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
export const STATUS = {
  Online: { mask: "url(#svg-mask-status-online)", color: "rgb(35, 165, 90)" },
  Offline: { mask: "url(#svg-mask-status-offline)", color: "#80848e" },
  Invisible: { mask: "url(#svg-mask-status-offline)", color: "#80848e" },
  Idle: { mask: "url(#svg-mask-status-idle)", color: "rgb(240, 178, 50)" },
  "Do Not Disturb": {
    mask: "url(#svg-mask-status-dnd)",
    color: "rgb(242, 63, 67)",
  },
};
