/**
 * Icon registry for the SB Zoo kiosk.
 *
 * Drop icon files into assets/images/icons/ using the filenames below.
 * All icons are circular PNGs on a transparent background (see design kit).
 *
 * Usage:
 *   import { Icons } from '@/constants/icons';
 *   <Image source={Icons.feeding} style={{ width: 48, height: 48 }} />
 */

export const Icons = {
  /** Green circle - leaf icon. Feeding interaction trigger. */
  feeding: require("../assets/images/icons/icon-feeding.png"),

  /** Olive circle - bone icon. X-ray scanner, skeleton mode. */
  xraySkeleton: require("../assets/images/icons/icon-xray-skeleton.png"),

  /** Red/green circle - organ icon. X-ray scanner, organ mode. */
  xrayOrgan: require("../assets/images/icons/icon-xray-organ.png"),

  /** Grey circle - notepad icon. Research notes panel. */
  researchNotes: require("../assets/images/icons/icon-research-notes.png"),

  /** Yellow circle - left chevron. Main navigation previous. */
  navPrev: require("../assets/images/icons/icon-nav-prev.png"),

  /** Yellow circle - right chevron. Main navigation next. */
  navNext: require("../assets/images/icons/icon-nav-next.png"),
} as const;
