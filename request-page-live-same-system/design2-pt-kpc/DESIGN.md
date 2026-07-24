---
name: Pratama Strategic Motion
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#445f8a'
  primary: '#001735'
  on-primary: '#ffffff'
  primary-container: '#0b2c54'
  on-primary-container: '#7994c2'
  inverse-primary: '#acc8f8'
  secondary: '#b22926'
  on-secondary: '#ffffff'
  secondary-container: '#ff6157'
  on-secondary-container: '#650006'
  tertiary: '#0c1829'
  on-tertiary: '#ffffff'
  tertiary-container: '#212c3e'
  on-tertiary-container: '#8893a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#acc8f8'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2b4771'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#900c12'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  diagonal-angle: 40deg
---

## Brand & Style
The design system is engineered to project reliability, speed, and precision for a global logistics leader. The brand personality is authoritative yet technologically forward, balancing traditional corporate stability with modern operational efficiency.

The visual style is **Corporate Modern with a Geometric Edge**. It utilizes sharp diagonal motifs and high-contrast layouts to evoke a sense of movement and "forward cargo flow." The interface avoids unnecessary decoration, focusing instead on structural integrity, clear information hierarchy, and a systematic approach to data density. The emotional response should be one of total confidence in the logistical pipeline.

## Colors
The palette is rooted in a deep **Primary Navy (#0B2C54)**, signaling institutional trust and stability. This is punctuated by **Accent Red (#A31D1D)**, used sparingly for critical calls-to-action, status alerts, and to draw the eye toward active movement or priority data points.

Backgrounds utilize a clean **Light (#FFFFFF)** foundation with **Muted Neutral (#F8FAFC)** surfaces used to define content areas without the need for heavy borders. Typography remains grounded in **Dark Text (#1E293B)** for maximum legibility, while **Muted Gray (#64748B)** manages secondary metadata.

## Typography
The typographic system creates a clear distinction between "structure" and "information." **Montserrat** is used for headlines to provide a bold, geometric, and professional presence. **Inter** is the functional workhorse for all body copy, data tables, and interface labels, chosen for its exceptional legibility in high-density logistics dashboards.

Large display headings should use tighter letter-spacing to emphasize the modern corporate aesthetic. Label styles for data points should utilize uppercase transformation and increased letter spacing to ensure they are easily scannable at small sizes.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout is defined by high-contrast sections and the signature "Cargo Slash"—a diagonal geometric background motif set at a **40-degree angle**. 

- **Desktop:** 24px gutters with 64px page margins.
- **Mobile:** 16px gutters with 16px page margins. 
- **The Diagonal Motif:** Decorative background elements or container masks should follow the 40-degree angle, appearing in the corners of sections to imply speed and directional movement from bottom-left to top-right.

## Elevation & Depth
Elevation is communicated through **Tonal Layering** rather than heavy shadows. In a professional logistics environment, clarity is paramount; therefore, depth is used to separate the workspace from the background.

- **Level 0 (Background):** #F8FAFC. Used for the main canvas.
- **Level 1 (Cards/Containers):** #FFFFFF. Pure white surfaces with a 1px stroke of #E2E8F0.
- **Level 2 (Interactive/Floating):** Subtle, ultra-diffused shadows (0px 4px 20px rgba(11, 44, 84, 0.05)).
- **Overlays:** 40% opacity Navy (#0B2C54) backdrop blurs for modals to maintain context without losing focus.

## Shapes
The shape language is primarily **Soft (0.25rem)**. This slight rounding provides a professional, modern feel that softens the "coldness" of a corporate system while maintaining a structured, architectural look. 

Buttons and input fields use the base 0.25rem radius. Large content cards and containers use a 0.5rem (Large) radius. The 40-degree diagonal "slash" remains a sharp geometric constant, never rounded, to provide a visual counter-point to the soft-radius UI components.

## Components
- **Buttons:** Primary buttons are Solid Navy (#0B2C54) with white text. Secondary buttons are outlined Navy. Critical actions use the Accent Red (#A31D1D). All buttons feature a subtle 2px horizontal slide-in hover effect to mimic movement.
- **Input Fields:** Clean white backgrounds with 1px #E2E8F0 borders. On focus, the border transitions to Primary Navy with a 2px inset accent.
- **Status Chips:** High-contrast pills for shipment status (e.g., "In Transit", "Delivered"). Use light background tints of success/warning colors with dark-toned text for accessibility.
- **Data Cards:** Content-heavy cards should feature a subtle vertical Navy accent bar on the left edge (4px width) to denote priority or active status.
- **Navigation:** A persistent sidebar or top-bar using a high-contrast dark theme (Primary Navy) to house administrative and operational tools.
- **Tracking Progress Bar:** A custom linear component using the 40-degree diagonal angle within the progress fill to indicate active momentum.