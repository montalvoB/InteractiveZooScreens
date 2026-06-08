// -- Color Palette
export const Colors = {
  // Primary
  darkGreen:  '#24442D', // headings
  green:      '#678B3D', // body text, icon backgrounds
  yellow:     '#F5C61B', // navigation buttons (avoid regular-weight white text)
  cream:      '#FFF4DF', // card backgrounds (use dark/green text, NOT yellow)

  // Secondary
  limeGreen:  '#296029',
  brown:      '#513E2E',
  orange:     '#EB924B', // "Explore iguana eyesight" button style

  // Neutrals
  white:      '#FFFFFF',
  black:      '#000000',
} as const;

// -- Typography sizes --
export const FontSize = {
  displayHeading: 72, // Neue Frutiger Black - main headings only
  subHeading1:    40, // Neue Frutiger Bold  - sub-heading & scientific name
  subHeading2:    40, // Neue Frutiger Regular
  body:           24, // National Park Regular
} as const;

// -- Border Radius --
export const Radius = {
  pill:   999,
  card:   14,
  small:  8,
} as const;

// -- Spacing --
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
} as const;
