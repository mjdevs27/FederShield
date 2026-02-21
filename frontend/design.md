# FedAura Design Specification v1.0

This document defines the core design language for the FedAura platform, based on the high-end minimalist dark theme implemented in `LandingPage.tsx`. Use these tokens to ensure visual consistency across all feature pages.

## 1. Color Palette

| Category | Token | Hex/Value | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `bg-main` | `#050505` | Primary page background |
| **Surface** | `bg-surface` | `#080808` | Secondary sections / Value grids |
| **Glass** | `bg-glass` | `white/5%` | Navigation bars, bento cards |
| **Primary Accent**| `indigo-500`| `#6366f1` | Primary buttons, brand icons |
| **Secondary Accent**| `purple-600`| `#9333ea` | Navigation gradients, stats glow |
| **Text Primary** | `text-white` | `#ffffff` | Headings, bold statements |
| **Text Dimmed** | `text-muted`| `white/40%` | Subtitles, descriptions |
| **Text Data** | `text-info` | `indigo/purple`| Technical labels, status indicators |

## 2. Typography

We use **Inter** or a clean **System Sans** as the base font, emphasizing contrast through drastic weight changes.

### Font Weights
- **Extralight (200)**: Used for "Secure" or "Value Labels" to create an architectural, airy feel.
- **Light (300)**: Used for long-form descriptions to maintain readability without bulk.
- **Bold (700)**: Used for primary card headings.
- **Extrabold (900)**: Used for the core "Impact" words in headings.

### Header Scales
- **Hero Title**: `text-[12vw]` (Desktop) / `12vw` is the key to making the page look "Big".
- **Section Headers**: `text-4xl md:text-5xl`.
- **Card Titles**: `text-3xl`.

### Tracking & Leading
- **Wide Tracking**: `tracking-[0.2em]` to `tracking-[0.5em]` for technical labels and navigation links.
- **Tight Leading**: `leading-[0.9]` for the massive hero title to prevent it from splitting visually.

## 3. Atmospheric Elements

To achieve the "High-End" look, the following visual effects are mandatory:

- **Grainy Texture**: A low-opacity SVG noise overlay (`bg-[url('...') opacity-20]`) across the hero section.
- **Deep Blur Glows**: Large, blurry radial gradients (`blur-[160px]`) in the background to separate the 3D model from the text.
- **Glassmorphism**: Surfaces use `backdrop-blur-2xl` with a subtle white border (`border-white/10`).
- **Grayscale to Color**: Value stats start as grayscale with low opacity and transition to full color/opacity on hover.

## 4. UI Components & Patterns

### Navigation Bar
- **Style**: Floating pill-shape or full-width minimalist bar.
- **Blur**: `backdrop-blur-2xl`.
- **Text**: Small (`text-[11px]`), bold, uppercase, wide tracking.

### Buttons
- **Primary**: Solid white background, black text, wide tracking, uppercase.
- **Secondary (Ghost)**: `bg-white/5` border, backdrop blur, white text.
- **Rounded**: Always use `rounded-full`.

### Bento Cards
- **Corners**: `rounded-[3rem]` (Ultra-rounded).
- **Border**: Subtle `border-white/5`.
- **Hover**: Shift background from `bg-white/[0.02]` to `bg-white/[0.04]` and slight scale-up.

### Labels & Metadata
- **Vertical Accents**: Use `border-l` or `border-r` with thin white/20 lines to anchor floating labels.
- **Status Pills**: `bg-indigo-500/10` with matching text for versioning or status.

## 5. 3D Model Integration
- **Scale**: Linear control via `modelScale`.
- **Positioning**: Absolute centered horizontally, shifted vertically to rest exactly at the section break or bottom.
- **Refinement**: `opacity-70`, `saturate-[0.8]`, and `brightness-[1.2]` to blend the GLB model into the dark aesthetic.

## 6. Motion (Framer Motion Tokens)
- **Entrance**: `initial: { opacity: 0, scale: 0.95 }`, `animate: { opacity: 1, scale: 1 }`.
- **Ease**: `[0.16, 1, 0.3, 1]` (Custom cubic-bezier for a linear, buttery feel).
- **Float**: `animate: { y: [0, -15, 0] }` with `duration: 5` and `repeat: Infinity`.
