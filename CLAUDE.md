@AGENTS.md

# Template #2 — Claude Code Instructions

## 1. Project Overview

This project is a premium, modern SaaS landing-page template built with:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion
- Lucide or Tabler Icons

The template is intended to be a commercially reusable SaaS landing-page template.

The goal is to create a polished, production-quality design that feels premium, trustworthy, modern, and professional.

Do NOT make this template look like a copy of Template #1.

Template #1 uses a more neutral/minimal SaaS aesthetic. Template #2 should have its own distinct visual identity.

---

# 2. Core Design Direction

The overall visual personality should be:

- Premium
- Calm
- Modern
- Professional
- Trustworthy
- Slightly editorial
- Sophisticated
- Clean
- Product-focused

Avoid making the design feel:

- excessive overly flashy
- childish
- excessively colorful
- overly futuristic
- filled with excessive glassmorphism
- overly animated
- generic AI-startup style

The design should look suitable for:

- SaaS products
- B2B software
- AI products
- Productivity tools
- Developer tools
- Analytics platforms
- Business software
- Modern startups

The template should look believable as a real SaaS company's website.

---

# 3. Typography

Use:

### Heading Font

Plus Jakarta Sans

### Body Font

Inter

Typography should create a premium modern SaaS feeling.

Headings should generally be:

- Strong
- Clean
- Tight
- Confident
- Easy to scan

Use large headings where appropriate, but avoid making every section excessively large.

Recommended hero heading range:

- Desktop: approximately 60–72px
- Mobile: approximately 42–48px

Adjust based on the actual content and layout.

Use appropriate:

- `tracking-tight`
- `font-semibold`
- `leading-tight`

Do not use extremely heavy font weights everywhere.

Body text should remain readable and comfortable.

---

# 4. Color System

The primary visual direction uses a warm neutral palette rather than pure white/black.

## Light Mode

Background:

```text
#FAFAF7
```

Foreground:

```text
#171717
```

Muted text:

```text
#6B6B66
```

Border:

```text
#E7E5E0
```

Primary dark:

```text
#1F2937
```

Primary hover:

```text
#111827
```

Accent:

```text
#D97706
```

Accent soft:

```text
#FEF3C7
```

Use the amber accent carefully.

Do NOT make the entire design orange.

Accent colors should primarily appear in:

- badges
- small highlights
- icons
- active states
- small decorative elements
- charts
- important visual emphasis
- occasional CTA details

The main CTA can remain dark/neutral.

---

# 5. Dark Mode

Dark mode should feel warm rather than pure black.

Recommended colors:

Background:

```text
#11110F
```

Foreground:

```text
#F5F5F0
```

Card:

```text
#181815
```

Border:

```text
#2A2925
```

Muted text:

```text
#A1A19A
```

Accent:

```text
#F59E0B
```

Accent soft:

```text
#3A2A0B
```

Dark mode should not simply invert the light mode.

Maintain proper hierarchy and contrast.

---

# 6. Layout Philosophy

Prioritize:

- strong visual hierarchy
- generous whitespace
- balanced spacing
- clean alignment
- clear content hierarchy
- consistent container widths
- responsive layouts

Avoid excessive content density.

Use asymmetric layouts when they improve the design.

Do not force every section into a centered layout.

Different sections should have different compositions.

For example:

- split layouts
- centered sections
- asymmetric grids
- product showcases
- bento layouts
- editorial layouts

The page should have visual rhythm.

---

# 7. Hero Section

The hero should be substantially different from Template #1.

Prefer a split hero rather than a simple centered hero.

Suggested structure:

```text
Left:
Small label/badge
Large headline
Supporting description
Primary CTA
Secondary CTA

Right:
Product/dashboard visualization
```

The hero should feel like a real SaaS product rather than a generic marketing page.

Possible visual content:

- product interface
- metrics
- charts
- activity feed
- collaboration UI
- product screenshots
- abstract product visualization

Do not use random decorative shapes simply to fill space.

Every visual element should support the product story.

---

# 8. Cards

Use cards sparingly and intentionally.

Preferred:

```text
rounded-lg
rounded-xl
rounded-2xl
```

depending on the size and importance of the component.

Buttons can generally use:

```text
rounded-lg
```

Avoid excessive use of:

```text
rounded-full
rounded-3xl
```

Do not put a card around every piece of content.

Cards should use:

- subtle borders
- restrained shadows
- background contrast
- spacing
- typography

Do not rely heavily on large shadows.

Preferred visual approach:

```text
border + background + spacing
```

rather than:

```text
large shadow + heavy gradient
```

---

# 9. Bento Sections

Bento layouts are allowed and encouraged when they make sense.

However, do not create a bento grid simply because it is trendy.

The bento section should communicate actual SaaS functionality.

Possible content:

- analytics
- metrics
- product dashboard
- activity feed
- team collaboration
- integrations
- automation
- performance
- customer data

Example conceptual layout:

```text
┌─────────────────────────┬──────────────┐
│                         │    24.8K     │
│     Analytics           │    Users     │
│     visualization       ├──────────────┤
│                         │    +32.4%    │
│                         │    Growth    │
├─────────────────┬───────┴──────────────┤
│ Activity Feed   │ Team Collaboration   │
└─────────────────┴──────────────────────┘
```

The exact layout can change.

Do not reuse the same bento composition repeatedly.

---

# 10. Product Visualizations

Product visuals should look believable.

Prefer:

- dashboards
- charts
- tables
- metrics
- notifications
- activity feeds
- user avatars
- progress indicators
- workflow interfaces
- integration panels

Avoid random fake UI elements that have no purpose.

The product visualization should communicate what the SaaS product actually does.

---

# 11. Animation

Use Motion for purposeful animation.

Animation should feel:

- subtle
- smooth
- premium
- intentional

Good examples:

- hero entrance
- fade + slight movement
- card hover
- subtle floating product elements
- chart entrance
- dashboard transitions
- button interaction
- subtle border animation
- scroll reveal

Avoid:

- excessive bouncing
- constant movement
- unnecessary rotations
- every element animating independently
- distracting infinite animations

The design should still look good when animations are disabled.

Animation should enhance the design, not become the design.

---

# 12. Sections

Possible sections include:

1. Navbar
2. Hero
3. Logo Cloud
4. Features
5. Product Showcase
6. Bento Features
7. Metrics
8. Integrations
9. Testimonials
10. Pricing
11. FAQ
12. CTA
13. Footer

Not every section must be included.

Choose sections based on the overall page flow.

Avoid repetitive sections that communicate the same thing.

---

# 13. Section Design Rules

Every section should have a clear purpose.

Before implementing a section, determine:

1. What is this section communicating?
2. What is the primary visual focus?
3. What should the user notice first?
4. How does this section differ visually from the previous section?
5. Does it contribute something new to the page?

Do not create sections that simply repeat:

```text
heading
description
3 cards
```

over and over.

Vary compositions.

---

# 14. Responsive Design

The template must be fully responsive.

Always consider:

- desktop
- laptop
- tablet
- mobile

Important approximate breakpoints:

- mobile: < 640px
- tablet: 640–1024px
- desktop: > 1024px

Do not simply shrink desktop layouts.

Redesign layouts where necessary for smaller screens.

Pay special attention to:

- hero layout
- navigation
- bento grids
- pricing cards
- dashboards
- tables
- typography
- horizontal overflow

Never allow accidental horizontal scrolling.

---

# 15. Accessibility

Use semantic HTML.

Examples:

```text
<header>
<nav>
<main>
<section>
<footer>
```

Buttons should be actual buttons.

Links should be actual links.

Images should have appropriate alt text.

Interactive elements must be keyboard accessible.

Maintain sufficient color contrast.

Do not rely only on color to communicate important information.

---

# 16. Code Quality

Write clean, maintainable TypeScript.

Prefer reusable components.

If a section becomes complex, split it into smaller meaningful components.

Use clear component names.

Example:

```text
Hero.tsx
ProductShowcase.tsx
FeatureGrid.tsx
Pricing.tsx
Testimonials.tsx
FAQ.tsx
```

Avoid unnecessary abstractions.

Do not create complicated architecture for simple landing-page components.

Keep the code understandable for a developer who purchases the template.

---

# 17. Existing Project Conventions

Before creating a new component:

- inspect the existing project structure
- inspect existing reusable components
- inspect the Container component
- inspect shadcn components
- inspect existing CSS variables
- inspect the current typography setup
- inspect the current theme setup

Reuse existing components where appropriate.

Do not create duplicate components when an existing component already solves the problem.

---

# 18. Tailwind Guidelines

Prefer Tailwind utility classes.

Keep class names readable.

Use existing design tokens and CSS variables when available.

Do not introduce arbitrary colors everywhere.

Prefer the established color system.

Avoid excessive arbitrary values unless they are genuinely required for the design.

Do not add another CSS framework.

Do not introduce unnecessary dependencies.

---

# 19. Icons

Use Tabler Icons where appropriate.

Icons should support the content.

Do not use icons simply as decoration everywhere.

Keep icon sizes and stroke weights consistent.

Avoid mixing many unrelated icon styles.

---

# 20. Avoid Generic AI-Generated Design

This is extremely important.

Do not generate a generic landing page consisting of:

```text
Centered hero
↓
Logo cloud
↓
3 feature cards
↓
Bento
↓
Testimonials
↓
Pricing
↓
FAQ
↓
CTA
```

with the same visual treatment everywhere.

The final design should feel intentionally art-directed.

Use:

- varied layouts
- strong typography
- whitespace
- visual hierarchy
- meaningful product visuals
- subtle asymmetry
- thoughtful spacing

The page should look designed by a professional UI designer rather than automatically assembled.

---

# 21. Commercial Template Quality

Remember that this is a commercial template.

Prioritize:

- clean code
- easy customization
- responsive design
- reusable components
- consistent design tokens
- good accessibility
- good dark mode
- polished interactions
- realistic content
- no unnecessary dependencies

Avoid hardcoding unnecessary project-specific assumptions.

Content should be easy for a customer to replace.

---

# 22. Important Rule When Creating Sections

When asked to create a section:

1. Inspect the existing project first.
2. Follow the established design system.
3. Do not change unrelated components.
4. Do not install unnecessary packages.
5. Do not rewrite the entire project.
6. Keep the implementation production-ready.
7. Ensure light and dark mode work correctly.
8. Ensure responsive behavior.
9. Use Motion only where it adds value.
10. Keep the visual quality high.

If there are multiple reasonable design approaches, choose the one that creates the strongest and most distinctive SaaS landing-page experience.

---

# 23. Final Design Principle

The most important goal is:

> Build a premium SaaS template that feels cohesive, distinctive, calm, modern, and commercially usable.

Do not optimize for maximum visual effects.

Optimize for:

**Design quality**

**Clarity**

**Purposeful animation**

**Consistency**

**Real product UI**

**Professionalism**
