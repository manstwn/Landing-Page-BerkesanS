---
name: KCARGO Industrial Corporate
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
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2e'
  on-tertiary-container: '#77859a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
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
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system for the logistics sector centers on reliability, precision, and global reach. It balances a heavy industrial foundation with modern corporate sophistication. The target audience includes B2B partners, freight forwarders, and logistics managers who require a sense of stability and institutional trust.

The design style is **Modern Corporate** with a focus on high-end industrial aesthetics. It utilizes a structured grid, generous whitespace to convey operational clarity, and high-contrast accents to guide user action. The visual language avoids decorative clutter, opting instead for refined borders and purposeful gold highlights that signal value and premium service.

## Colors
The palette is anchored by **Deep Navy Blue**, representing the depth of the ocean and the stability of the industrial sector. **Industrial Warm Gold** serves as the functional accent, reserved for primary actions, status indicators, and critical call-to-outs.

- **Primary (Navy):** Used for navigation, headings, and high-emphasis backgrounds.
- **Secondary (Gold):** Used for interactive states, call-to-action buttons, and progress indicators.
- **Background (Light Grey):** A cool-toned off-white that reduces eye strain and provides a clean canvas for data-heavy interfaces.
- **Surface/Neutral:** Slate grays are used for secondary text and borders to maintain a professional, monochromatic depth.

## Typography
This design system utilizes **Plus Jakarta Sans** exclusively to maintain a contemporary, legible, and unified corporate voice. 

Headings are set with tighter letter spacing and heavy weights to project authority and confidence. Body text uses a standard weight with generous line height to ensure readability in data-intensive logistics dashboards. Labels are occasionally set in uppercase with increased letter spacing for categorization and metadata to distinguish them from actionable body text.

## Layout & Spacing
The layout follows a **Fluid Grid** logic with a maximum container width of 1440px for desktop to maintain optimal line lengths. 

- **Desktop:** 12-column grid, 24px gutters, 48px side margins.
- **Tablet:** 8-column grid, 16px gutters, 32px side margins.
- **Mobile:** 4-column grid, 16px gutters, 16px side margins.

Spacing follows a linear 4px/8px base unit system. Use larger increments (40px+) to separate distinct content sections (e.g., Hero from Fleet Statistics), and smaller increments (8px-16px) for internal component spacing.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**. Surfaces do not "float" aggressively; instead, they lift slightly from the background to indicate interactivity or modularity.

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Containers):** Solid #FFFFFF with a subtle 1px border (#E2E8F0).
- **Level 2 (Dropdowns/Hover):** A soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.08)).
- **Interactive Depth:** When a user hovers over a primary card, the border-color should transition to the Primary Navy or Secondary Gold to indicate focus without requiring a heavy shadow shift.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a professional "technical" feel—avoiding the clinical sharpness of 0px corners while staying far enough away from the playfulness of fully rounded circles. 

Large containers (cards) should use `rounded-lg` (0.5rem) to soften the industrial density, while smaller elements like input fields and tags remain at the base `rounded` (0.25rem).

## Components

### Buttons
- **Primary:** Deep Navy background with white text. High-contrast and authoritative.
- **Secondary/Action:** Industrial Gold background with Navy text. Used for "Track Shipment" or "Book Now."
- **Ghost:** Navy border and text with a transparent background. Used for secondary navigation or "Cancel" actions.

### Input Fields
Inputs should feature a solid 1px border (#E2E8F0) and a white background. On focus, the border transitions to Industrial Gold with a subtle 2px outer glow of the same color at 20% opacity. Labels must always be visible above the field in `label-sm`.

### Cards
Cards are the primary organizational unit. They use a white background, a 1px slate-grey border, and no shadow in their default state. Upon hover, they gain the "Level 2" ambient shadow and a 2px Gold left-accent border to signify selection.

### Status Chips
Logistics requires clear status tracking. Use a "Pill" shape (fully rounded) with low-saturation backgrounds:
- **In Transit:** Light Blue background / Navy text.
- **Delivered:** Light Green background / Dark Green text.
- **Delayed:** Light Gold background / Gold text.

### Data Tables
Tables are the backbone of the system. Use "Deep Navy" for header text with a light grey (#F1F5F9) header background. Rows should have a subtle hover effect (changing to #F8FAFC) to help users track horizontal data across wide screens.