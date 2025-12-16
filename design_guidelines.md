# RFP Agent AI - Design Guidelines

## Design Approach
**System Selected:** Carbon Design System (IBM) - optimized for enterprise data-heavy applications with strong focus on clarity, information hierarchy, and productivity workflows.

**Rationale:** This B2B enterprise tool requires exceptional data readability, clear status communication, and efficient workflows for processing complex technical information (SKU matching, pricing tables, specifications).

---

## Typography System

**Font Stack:**
- Primary: IBM Plex Sans (via Google Fonts CDN)
- Monospace: IBM Plex Mono (for RFP text, SKU codes, technical specs)

**Type Scale:**
- Hero/Page Title: 2.5rem (40px), font-weight 600
- Section Headers: 1.5rem (24px), font-weight 600
- Card Titles: 1.125rem (18px), font-weight 600
- Body Text: 1rem (16px), font-weight 400
- Small/Meta: 0.875rem (14px), font-weight 400
- Technical Data: 0.875rem (14px), font-weight 500, monospace

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 24 for consistency
- Tight spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-6
- Section spacing: py-8, py-12, py-16
- Large gaps: gap-8, gap-12

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Sidebar: 320px fixed width (if needed)
- Two-column layout: 60/40 split (input/output)
- Responsive breakpoints: Mobile-first, stack columns on md and below

**Grid System:**
- Results grid: grid-cols-1 md:grid-cols-3 for SKU cards
- Pricing table: Full-width with responsive horizontal scroll
- Status indicators: Inline flex with gap-2

---

## Component Library

### Header
- Fixed header with site logo/icon, title, and subtitle
- Height: h-20
- Box shadow for elevation
- Optional action buttons (Settings, Help) aligned right

### Input Panel (Left Column)
**RFP Textarea:**
- Height: h-64 minimum
- Monospace font for technical readability
- Border width: border-2
- Rounded: rounded-lg
- Padding: p-4
- Placeholder text with clear instructions

**Action Buttons:**
- Primary CTA: Full-width, height h-12, rounded-lg, flex items-center justify-center
- Secondary actions: Outlined style, height h-10
- Icon + text labels for clarity
- Loading spinner: Centered within button, 20px diameter

### Results Panel (Right Column)

**Summary Card:**
- Rounded: rounded-xl
- Padding: p-6
- Border width: border
- Key-value pairs displayed in definition list format (dl/dt/dd structure)
- Line height: leading-relaxed for readability

**SKU Match Cards:**
- Display as grid: grid-cols-1 gap-4
- Each card: rounded-lg, p-6, border
- Match percentage: Large bold number (text-4xl) with % symbol
- SKU code: Monospace, font-weight 600
- Specifications: Compact list with small labels and values
- Base price: Prominent display (text-2xl, font-bold)

**Pricing Table:**
- Full-width table with striped rows
- Header: Sticky positioning, font-weight 600
- Cell padding: px-6 py-4
- Monospace for numerical values
- Total row: Border-top-2, font-weight 700
- Responsive: Horizontal scroll on mobile

### Status & Feedback Components

**Loading State:**
- Centered spinner with "Processing RFP..." text
- Progress indicators showing agent activity (Sales → Technical → Pricing)
- Animation: Pulsing or rotating spinner

**Error Messages:**
- Rounded: rounded-lg
- Padding: p-4
- Icon: Alert icon (24px) positioned left
- Text: 0.875rem, clear error description
- Dismissible close button (optional)

**Success Indicators:**
- Checkmark icons (20px) for completed steps
- Step progression: Numbered badges or timeline view

### "How It Works" Section
- Positioned below input panel
- Rounded: rounded-xl, padding: p-6
- Numbered steps (1-2-3) with circular badges
- Icons for each agent (Sales, Technical, Pricing)
- Concise descriptions per step

---

## Animations
**Minimal Approach - Use Sparingly:**
- Button hover: Subtle background transition (150ms)
- Loading spinner: Continuous rotation
- Card hover: Slight elevation change (transform: translateY(-2px))
- No scroll-triggered animations
- No elaborate entrance effects

---

## Accessibility
- All form inputs have associated labels
- Keyboard navigation supported throughout
- Focus states: 2px ring offset
- ARIA labels for icon-only buttons
- Minimum touch target: 44x44px for mobile
- Color contrast ratios meet WCAG AA standards (handled separately)

---

## Images
**No hero images required.** This is a utility-focused application where immediate functionality takes precedence over visual storytelling.

**Icon Usage:**
- Lucide React icons via npm (already in codebase)
- Consistent 20-24px sizing throughout
- Icons for: Upload, FileText, Zap, DollarSign, CheckCircle, AlertCircle, ChevronDown, Settings

---

## Special Considerations

**Data Visualization:**
- Match percentages: Circular progress indicators or bold percentage numbers
- Pricing breakdown: Hierarchical indentation for line items vs. totals
- Technical specs: Compact comparison table (RFP requirements vs. matched SKU)

**Responsive Behavior:**
- Desktop (lg+): Two-column layout (input | output)
- Tablet (md): Stacked layout with full-width panels
- Mobile: Single column, sticky action button at bottom

**Empty States:**
- When no results: Centered icon + message encouraging user to process RFP
- Sample RFP button prominently displayed for first-time users

**Professional Polish:**
- Consistent border-radius throughout (lg for cards, md for inputs)
- Subtle shadows for elevation hierarchy (shadow-sm, shadow-md, shadow-lg)
- Generous white space in data-dense areas
- Clear visual hierarchy: Headers → Cards → Tables → Actions