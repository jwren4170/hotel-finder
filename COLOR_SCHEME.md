# 🎨 Custom Color Scheme

This document describes the custom color palette applied to the Hotel Finder application.

## Color Palette

The application uses a custom color scheme based on the following colors, converted to OKLCH format for better color consistency:

### Original Hex Colors
- `#5f0f40` - Deep Magenta
- `#9a031e` - Crimson Red
- `#fb8b24` - Bright Orange
- `#e36414` - Dark Orange
- `#0f4c5c` - Deep Teal

### OKLCH Conversions
```css
--color-magenta: oklch(0.32 0.14 343);      /* Deep Magenta */
--color-crimson: oklch(0.42 0.18 18);       /* Crimson Red */
--color-orange: oklch(0.72 0.16 55);        /* Bright Orange */
--color-dark-orange: oklch(0.64 0.18 45);   /* Dark Orange */
--color-teal: oklch(0.35 0.08 220);         /* Deep Teal */
```

## Theme Application

### Light Mode
- **Primary**: Teal (`oklch(0.35 0.08 220)`) - Used for main actions, header, buttons
- **Secondary**: Dark Orange (`oklch(0.64 0.18 45)`) - Used for secondary actions
- **Accent**: Bright Orange (`oklch(0.72 0.16 55)`) - Used for highlights, prices
- **Destructive**: Crimson (`oklch(0.42 0.18 18)`) - Used for errors, warnings
- **Background**: Warm off-white (`oklch(0.98 0.005 55)`)
- **Foreground**: Dark with magenta tint (`oklch(0.2 0.02 343)`)

### Dark Mode
- **Primary**: Lighter Teal (`oklch(0.45 0.1 220)`) - Adjusted for dark backgrounds
- **Secondary**: Bright Orange (`oklch(0.72 0.16 55)`) - Pops against dark background
- **Accent**: Dark Orange (`oklch(0.64 0.18 45)`) - Warm accent color
- **Destructive**: Lighter Crimson (`oklch(0.5 0.2 18)`)
- **Background**: Deep magenta-tinted dark (`oklch(0.15 0.02 343)`)
- **Foreground**: Warm off-white (`oklch(0.95 0.01 55)`)

## Components Updated

### Header & Navigation
- Header background: `bg-primary`
- Header text: `text-primary-foreground`
- Sidebar: `bg-card` with `text-card-foreground`
- Active nav items: `bg-primary text-primary-foreground`

### Search Form
- Background gradient: `from-primary/10 to-accent/10`
- Form card: `bg-card` with `border-border`

### Hotel Cards
- Hover state: `group-hover:text-primary`
- Rating badge: `bg-primary text-primary-foreground`
- View details link: `text-primary`

### Hotel Detail Page
- Background: `bg-background`
- Rating badge: `bg-primary text-primary-foreground`
- Room price: `text-accent`
- Room cards hover: `hover:border-primary`

### Room Detail Page
- Price badge: `bg-accent text-accent-foreground`
- All text uses semantic color tokens

## Theme Toggle

A theme toggle component has been added to the header that:
- Switches between light and dark modes
- Saves preference to localStorage
- Respects system preference on first load
- Shows Moon icon in light mode, Sun icon in dark mode

## Usage

You can use the custom colors directly in your components:

```tsx
// Using theme colors
<div className="bg-primary text-primary-foreground">...</div>
<div className="bg-accent text-accent-foreground">...</div>

// Using custom palette colors directly
<div className="bg-magenta">...</div>
<div className="text-crimson">...</div>
<div className="border-orange">...</div>
<div className="bg-dark-orange">...</div>
<div className="text-teal">...</div>
```

## Benefits of OKLCH

OKLCH (Oklab Lightness Chroma Hue) provides:
- **Perceptual uniformity**: Colors appear more consistent to the human eye
- **Better gradients**: Smoother color transitions
- **Predictable lightness**: Easier to create accessible color variations
- **Wide gamut support**: Future-proof for modern displays

