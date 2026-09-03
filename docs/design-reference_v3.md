# MindMarket — Style Reference
> Warm storybook on cream paper — a friendly editorial canvas where oversized Inter headlines and paper-cut characters share a soft, sticker-like surface, anchored by a teal accent with a small measure of ochre for action.

**Theme:** light

MindMarket is a warm, illustrated editorial system built on a cream-paper canvas rather than stark white, with massive Inter display type that fills the frame and a teal accent that anchors the brand across navigation strokes, borders, buttons, and the footer band, with ochre reserved for the few places that ask the reader to act. The visual language borrows from paper-cut storybook illustration — flat, vibrant character art sits directly on warm neutral backgrounds, never on photographic or gradient surfaces, and the UI chrome is deliberately minimal so the artwork leads. Components are generously rounded (50–64px radii on cards and nav), creating a soft, sticker-like quality. Color is a two-hue system with a strict ratio. Teal in three steps (Deep, Primary, Tint) is the structural hue: Primary Teal for borders, toggles and small blocks; Deep Teal for the footer band and primary service CTAs; Teal Tint as the only chromatic surface under long text. Ochre is the action hue, capped at roughly 5–8% of a page (never above 15%): one filled CTA per view, tag outlines, a small highlight block. There is no semantic state palette. The overall density is breathable and confident — few elements per screen, enormous type, wide margins, and the cream canvas doing the structural work that shadow systems usually handle in product UIs.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Primary Teal | `#5cb2a0` | `--color-primary-teal` | Structural accent — navigation strokes, card borders, menu toggle fill, CTA icon dots, tag outlines, small color blocks. Lines and small areas only; never large fills or body text |
| Deep Teal | `#2e9a82` | `--color-deep-teal` | The only large-area accent — footer band and primary service-card CTAs. Always white text on top |
| Teal Tint | `#d3e6df` | `--color-teal-tint` | The only chromatic surface allowed under long text — long-read blocks, selected tag chips. Sits close to cream so paragraphs stay quiet |
| Ochre | `#e9c64e` | `--color-ochre` | Action accent — one filled CTA per view, tag outlines, a single footer dot. Never a footer band or section background |
| Ochre Tint | `#f8eec9` | `--color-ochre-tint` | Highlight surface — a stat, a pull quote, one small card. Never under multi-paragraph text |
| Cream Paper | `#f6f2e8` | `--color-cream-paper` | Dominant page background and soft card surface. Warm off-white with a touch less yellow so teal sits cleanly on it |
| Sandstone | `#e3dcd0` | `--color-sandstone` | Secondary surface for inset or recessed cards and section backgrounds. Slightly deeper and a touch rosier than cream |
| Ink Black | `#2c2e2a` | `--color-ink-black` | Primary text, icons, nav borders, dominant hairline color. Warm near-black |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated cards, floating nav, text on Deep Teal |
| Stone Gray | `#80827f` | `--color-stone-gray` | Muted body text and secondary link borders |
| Hairline Mist | `#d5d5d4` | `--color-hairline-mist` | Subtle dividers and low-contrast borders |
| Pure Ink | `#000000` | `--color-pure-ink` | Icon fills and high-contrast borders only |

**Retired:** Fresh Grass `#8ed462`, Sky Pop `#2ba0ff`, Coral Pop `#ff705d`, Sunshine Pop `#f5e211`. Illustrations may keep their own flat fills; UI chrome uses only the palette above.

### Color Ratio (per full page)

| Group | Share | Notes |
|-------|-------|-------|
| Cream / Sandstone / White | ~70% | Paper does the structural work |
| Ink text & lines | ~10% | |
| Teal (Deep 5 · Primary 5 · Tint 5) | ~15% | Structure and one large band |
| Ochre + Ochre Tint | 5–8%, max 15% | Action only |

### Combination Rules

- One hue per component. A card carries either a Primary Teal border or an Ochre CTA, never both. A button is Deep Teal filled, Ochre filled, or a light ghost with a single Primary Teal dot.
- Within one viewport, a Deep Teal fill and an Ochre fill each appear at most once.
- Teal and Ochre may sit side by side at layout level (e.g. the Deep Teal footer band with one Ochre dot), never mixed inside a component.
- Body text lands only on Cream, White, Sandstone, or Teal Tint.
- Ochre appears only where the reader is asked to act, so it keeps its signal value.
- No color carries semantic state (success / error / warning).

## Tokens — Typography

### Inter — Single-family system: Inter carries everything from 9px micro-labels to 144px display headlines. The use of Inter at display scale is a signature choice — most editorial systems reach for a serif or custom display face; MindMarket trusts Inter's geometric clarity at extreme sizes, relying on tight letter-spacing (-0.06em at 140px+) and aggressive line-height compression (0.95–1.15) to create visual weight without switching families. · `--font-inter`
- **Substitute:** Inter (Google Fonts) — no substitute needed
- **Weights:** 400, 500
- **Sizes:** 9px, 15px, 17px, 18px, 20px, 30px, 53px, 81px, 140px, 144px
- **Line height:** 0.95–2.00 (display 0.95–1.20, body 1.50)
- **Letter spacing:** -0.06em at 81px and above, -0.04em at 53px, normal at body sizes
- **Role:** Single-family system: Inter carries everything from 9px micro-labels to 144px display headlines. The use of Inter at display scale is a signature choice — most editorial systems reach for a serif or custom display face; MindMarket trusts Inter's geometric clarity at extreme sizes, relying on tight letter-spacing (-0.06em at 140px+) and aggressive line-height compression (0.95–1.15) to create visual weight without switching families.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 53px | 1.15 | -2.12px | `--text-heading` |
| heading-lg | 81px | 1.2 | -4.86px | `--text-heading-lg` |
| display | 140px | 0.95 | -8.4px | `--text-display` |
| display-lg | 144px | 0.95 | -8.64px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 20 | 20px | `--spacing-20` |
| 60 | 60px | `--spacing-60` |
| 136 | 136px | `--spacing-136` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 50px |
| cards | 50px |
| small | 10px |
| buttons | 50px |
| illustration-containers | 63.75px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-21px
- **Element gap:** 17-21px

## Components

### Floating Pill Navigation Bar
**Role:** Primary site navigation container

White (#ffffff) pill-shaped bar with 50px border-radius, floating over the cream canvas with generous margins. Contains brand logo container (rounded square, ~40px), nav links at 15px Inter 500 in #2c2e2a with 17–20px horizontal padding, a circular Primary Teal menu icon button, and a CTA. The entire bar reads as a single soft pill, not a rectangular header.

### Brand Logo Container
**Role:** Brand mark housing

Small rounded square (10–20px radius) containing the MindMarket mark, paired with the wordmark in 15–17px Inter 500 #2c2e2a. Sits at the left edge of the nav pill.

### Primary CTA Button
**Role:** Main action trigger (no distinct CTA background color)

Light/white pill button with 50px radius, ~11px vertical and 20px horizontal padding, 15px Inter 500 #2c2e2a text reading 'Get a quote'. Features a small circular Primary Teal (#5cb2a0) icon dot embedded at the right edge as a visual action indicator. The button is a ghost/light style — not a filled chromatic action.

### Menu Toggle Button
**Role:** Navigation menu trigger

Circular button (~40px diameter) with #5cb2a0 Primary Teal fill and a dark menu icon. Sits at the right edge of the nav pill, before the CTA.

### Content Card
**Role:** Feature/service content container

White (#ffffff) surface with 50–64px border-radius, 21px internal padding. Contains a heading, body text, and a CTA. Hairline border optional. Used for 'No more chaos' type messaging blocks and service descriptions.

### Service Card Link
**Role:** Navigable service entry

White or Sandstone card with a #2e9a82 Deep Teal filled button (pill shape, 50px radius, white text, small white circle icon at right) as the action trigger. Deep Teal is the primary service CTA. An #e9c64e Ochre filled pill (ink text, small ink circle at right) is the alternative action fill, limited to one per view. A card carries either a Primary Teal border or a filled CTA, not both.

### Hero Display Block
**Role:** Above-the-fold headline area

Full-bleed cream canvas section. Headline at 140–144px Inter weight 500, #2c2e2a, letter-spacing -0.06em, line-height 0.95. Subheadline at 17–20px weight 400. The headline is the dominant visual element — no competing imagery above the fold except the illustration bleeding from below.

### Illustration Hero Panel
**Role:** Decorative character art section

Paper-cut style character illustrations with flat color fills. Ideally the palette leans on teal, ochre, cream, ink and white; other flat fills are tolerated inside artwork but never echoed in UI chrome. Characters are dynamic, overlapping, and sit directly on the cream canvas. No frames, no rounded clipping — the art is the container. Used as hero and section dividers.

### Inline Text Link
**Role:** Navigable text link

#2c2e2a or #80827f text with an underline or hairline border in matching color. 15–18px Inter 400. Links carry a #80827f border-bottom as their visual affordance, not a chromatic color change.

### Footer Accent Block
**Role:** Footer highlight surface

#2e9a82 Deep Teal fill section at the page bottom with white (#ffffff) text and, optionally, a single 40px Ochre (#e9c64e) circle as the one warm mark. A solid, calm closing band that contrasts with the cream canvas above.

### Long-read Content Block
**Role:** Multi-paragraph reading surface

#d3e6df Teal Tint surface with 50px radius and 20px padding, body text in #2c2e2a. The only chromatic surface allowed under long text.

### Highlight Block
**Role:** Single stat or pull quote

#f8eec9 Ochre Tint surface, 50px radius, 20px padding, one large number or short quote in #2c2e2a with a Stone Gray caption. Never holds more than two lines of body copy.

## Do's and Don'ts

### Do
- Use #f6f2e8 cream as the page canvas — never #ffffff as the primary background. White is reserved for elevated cards and the floating nav.
- Set border-radius to 50px for all cards, buttons, and nav containers. Use 63.75px for illustration containers and 10px for inline micro-elements like tag chips.
- Set display headlines at 140–144px Inter weight 500 with letter-spacing -0.06em and line-height 0.95. This is the system's signature scale — shrinking to 53–81px for section headings.
- Use #5cb2a0 Primary Teal as the only brand-structural accent in UI chrome (nav strokes, borders, toggle fills, icon dots, small blocks). Never use it for body text or large surface fills.
- Use #2e9a82 Deep Teal for large fills only: the footer band and service CTAs. Put white text on it.
- Use #d3e6df Teal Tint for filled chips and long-read blocks.
- Use #e9c64e Ochre for at most one filled CTA per view, plus tag outlines or a single footer dot. Keep Ochre + Ochre Tint under 15% of the page, ideally 5–8%.
- Use #f8eec9 Ochre Tint for a stat or quote highlight, never for paragraphs.
- Use #2c2e2a for all primary text, borders, and icons. Never use pure #000000 for large body text on cream — it creates harsh contrast against the warm canvas.
- Embed a small Primary Teal circle icon inside ghost CTA buttons as the action affordance, rather than relying on background fill to signal interactivity.
- Float the navigation as a single white pill bar with 50px radius, centered or full-width with generous margin, rather than as a traditional rectangular header bar.

### Don't
- Don't introduce a second typeface for display headings — Inter at extreme sizes with tight tracking is the system's defining choice.
- Don't introduce a third accent hue (blue, coral, purple). Hierarchy comes from the three teal steps plus a small dose of ochre.
- Don't use Ochre as a footer band, section background, or under body text.
- Don't use teal or ochre as a functional state for success/error/warning.
- Don't use sharp corners (0–4px radius) on cards or buttons — the system reads as sticker-soft and relies on generous rounding for its identity.
- Don't place white cards directly on white backgrounds — always separate card surfaces from the cream canvas with either the white-on-cream elevation contrast or a hairline border.
- Don't use shadows or gradients for elevation — the cream-to-white surface stack and generous radii handle depth without shadow.
- Don't mix hues inside one component — a button is Deep Teal filled, Ochre filled, or light-ghost with a single Primary Teal dot; a card has either a Primary Teal border or a filled CTA, never both.
- Don't reduce display type below 53px for primary page headings — the system's authority comes from extreme scale, and shrinking it collapses the editorial feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f6f2e8` | Page canvas — the dominant warm background |
| 1 | Pure White | `#ffffff` | Elevated cards, floating navigation, inset content blocks |
| 2 | Sandstone | `#e3dcd0` | Recessed or secondary surface tone |
| 3 | Teal Tint | `#d3e6df` | Chromatic surface for chips and long-read blocks |
| 3 | Ochre Tint | `#f8eec9` | Highlight surface for a stat or quote |

## Elevation

MindMarket uses a cream-to-white surface stack and generous border-radii instead of box-shadows for elevation. The floating nav pill sits on the cream canvas without a shadow — its elevation is communicated by the white-on-cream color shift alone. Cards are differentiated from the canvas by surface color, not by drop shadow. This creates a flat, editorial, paper-like feel where everything feels printed rather than digitally raised.

## Imagery

Illustration-only visual language. No photography, no product screenshots, no 3D renders. All visuals are flat paper-cut style character illustrations with bold outlines and vivid flat color fills, leaning on teal, ochre, cream, ink and white. Characters are dynamic and overlapping, with limbs and props extending beyond implied boundaries. Illustrations sit directly on the cream canvas without frames, masks, or rounded clipping containers. The art style is editorial and storybook — human figures with exaggerated proportions, playful poses, and bright personality. Icons are minimal: simple geometric shapes (circles for menu toggles, small dots for CTA affordances) rather than a dedicated icon set. Imagery is decorative atmosphere rather than explanatory — it sets emotional tone for a market research brand that talks about 'real human insights.'

## Layout

Full-bleed sections on a cream canvas, with no fixed max-width grid constraining the illustrations. Content cards (white, 50–64px radius) float within sections and are constrained to ~600–700px width for readability. The hero is a centered headline stack at 140–144px with the illustration bleeding from the bottom edge into the next section. Navigation is a single floating white pill bar, horizontally centered or full-width, sitting above all content. Section rhythm alternates between illustration-led sections (art takes ~60% of the width) and text-card sections (white cards at ~50% width with generous surrounding cream). The page reads top-to-bottom as: floating nav → giant headline hero → illustration panel → text card section → illustration+card split. Vertical spacing between sections is generous (80–120px). No sidebar, no multi-column product grids, no pricing tables — the layout is editorial and single-column in its reading flow, with illustrations providing lateral visual interest.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2c2e2a
- background: #f6f2e8 (cream canvas)
- surface: #ffffff (elevated cards, floating nav); #e3dcd0 (recessed)
- border: #2c2e2a, #80827f, or #5cb2a0
- accent: #5cb2a0 (Primary Teal — buttons, borders, small blocks only)
- large-area accent: #2e9a82 (Deep Teal — footer, service CTAs)
- action accent: #e9c64e (Ochre — one filled CTA per view, tag outlines; ≤15% of page)
- chromatic surfaces: #d3e6df (Teal Tint, long text ok); #f8eec9 (Ochre Tint, highlights only)

**Example Component Prompts**

1. *Create a hero headline section:* Cream background (#f6f2e8). Headline at 140px Inter weight 500, #2c2e2a, letter-spacing -8.4px, line-height 0.95. Subheadline at 20px weight 400, #2c2e2a, centered or left-aligned. No card wrapper — text sits directly on cream canvas.

2. *Create a ghost CTA button:* Cream (#f6f2e8) or white pill, 50px radius, 11px/20px padding, 15px Inter 500 #2c2e2a text, with a 14px Primary Teal (#5cb2a0) circle at the right edge.

3. *Create a content card:* White (#ffffff) surface, 50px border-radius, 21px padding. Heading at 30px Inter weight 500 #2c2e2a, body text at 17px weight 400 #2c2e2a. No shadow; optional 1.5px Primary Teal (#5cb2a0) border. The card sits on the cream (#f6f2e8) canvas.

4. *Create a service action card:* Sandstone (#e3dcd0) or white card (50px radius, 21px padding) containing either a Deep Teal (#2e9a82) pill button (white text, small white circle at right) or an Ochre (#e9c64e) pill button (#2c2e2a text, small ink circle at right); 50px radius, 11px vertical and 20px horizontal padding, 15px Inter 500. No teal border on this card. Only one Ochre button per view.

5. *Create a footer accent band:* Full-width Deep Teal (#2e9a82) section at the page bottom, 50px+ padding, white (#ffffff) text, with one 40px Ochre (#e9c64e) circle as the single warm mark.
6. *Create a highlight block:* Ochre Tint (#f8eec9) card, 50px radius, 20px padding, one large Inter 500 number in #2c2e2a with a Stone Gray (#80827f) caption.

## Similar Brands

- **Duolingo** — Same playful illustrated character art on warm neutral backgrounds, with flat color fills and paper-cut aesthetic
- **Headspace** — Similar warm cream canvas, oversized friendly type, and generous rounded radii creating a soft approachable feel
- **Mailchimp** — Same editorial illustration-led approach with vivid accent colors used decoratively rather than as strict UI states
- **Figma Config** — Same floating pill navigation pattern and cream/warm-white surface treatment with oversized display type
- **Notion** — Similar light, breathable layout with minimal UI chrome letting content and illustration lead

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary-teal: #5cb2a0;
  --color-deep-teal: #2e9a82;
  --color-teal-tint: #d3e6df;
  --color-ochre: #e9c64e;
  --color-ochre-tint: #f8eec9;
  --color-cream-paper: #f6f2e8;
  --color-sandstone: #e3dcd0;
  --color-ink-black: #2c2e2a;
  --color-pure-white: #ffffff;
  --color-stone-gray: #80827f;
  --color-hairline-mist: #d5d5d4;
  --color-pure-ink: #000000;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 53px;
  --leading-heading: 1.15;
  --tracking-heading: -2.12px;
  --text-heading-lg: 81px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -4.86px;
  --text-display: 140px;
  --leading-display: 0.95;
  --tracking-display: -8.4px;
  --text-display-lg: 144px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -8.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-136: 136px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20-21px;
  --element-gap: 17-21px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25.5px;
  --radius-full: 50px;
  --radius-full-2: 63.75px;

  /* Named Radii */
  --radius-nav: 50px;
  --radius-cards: 50px;
  --radius-small: 10px;
  --radius-buttons: 50px;
  --radius-illustration-containers: 63.75px;

  /* Surfaces */
  --surface-cream-paper: #f6f2e8;
  --surface-pure-white: #ffffff;
  --surface-sandstone: #e3dcd0;
  --surface-teal-tint: #d3e6df;
  --surface-ochre-tint: #f8eec9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-primary-teal: #5cb2a0;
  --color-deep-teal: #2e9a82;
  --color-teal-tint: #d3e6df;
  --color-ochre: #e9c64e;
  --color-ochre-tint: #f8eec9;
  --color-cream-paper: #f6f2e8;
  --color-sandstone: #e3dcd0;
  --color-ink-black: #2c2e2a;
  --color-pure-white: #ffffff;
  --color-stone-gray: #80827f;
  --color-hairline-mist: #d5d5d4;
  --color-pure-ink: #000000;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 53px;
  --leading-heading: 1.15;
  --tracking-heading: -2.12px;
  --text-heading-lg: 81px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -4.86px;
  --text-display: 140px;
  --leading-display: 0.95;
  --tracking-display: -8.4px;
  --text-display-lg: 144px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -8.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-136: 136px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25.5px;
  --radius-full: 50px;
  --radius-full-2: 63.75px;
}
```
