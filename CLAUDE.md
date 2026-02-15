# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at localhost:4321
pnpm build        # Production build to ./dist/
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
pnpm format       # ESLint fix + Prettier with cache
```

## Architecture

**Astro v5** static site deployed to **Netlify**. Uses **TypeScript**, **Tailwind CSS v4**, and **React** (for interactive components only). Content managed via **Keystatic CMS** (accessible at `/admin` or `/keystatic`).

### Key Directories
- `src/pages/` — File-based routing (Astro)
- `src/components/` — Astro components organized by feature (hero/, pricing/, nav/, etc.)
- `src/data/` — Content collections (blog, authors, services, careers, projects) with Zod schemas in `src/content.config.ts`
- `src/layouts/` — BaseLayout and specialized layouts (BlogLayoutCenter, ServiceLayout, etc.)
- `src/styles/tailwind-theme.css` — Theme CSS variables (colors, fonts, spacing)
- `src/styles/global.css` — Global styles, heading classes (`h1`, `h2`, `h3`), `description` class
- `src/js/` — Utilities: `blogUtils.ts`, `localeUtils.ts`, `translationUtils.ts`, `textUtils.ts`, `jsonLD.ts`
- `src/config/translationData.json.ts` — i18n text and route translations
- `.rules/` — Detailed style guide and conventions (read these for full context)

### Component Libraries
- **Starwind UI** — Pre-built UI components (button, card, dialog, input, tabs, accordion, etc.) in `src/components/starwind/`
- **astro-icon** with **Tabler Icons** — `<Icon name="tabler/check" />` pattern
- **Swiper** — Carousels/sliders
- **Motion** — Animations

## Coding Conventions

### Styling
- **Always use Tailwind utilities** — never hardcode colors like "blue" or "white"
- Use semantic color variables: `bg-primary`, `text-primary-accent`, `bg-muted`, `text-foreground`, `border-border`
- Primary color is for accents only; base theme is black & white
- Hover backgrounds: `hover:bg-muted` (not primary)
- Headings: `<h1 class="h1">`, `<h2 class="h2">`, `<h3 class="h3">`
- Description text below headings: `<p class="description">`
- Use `class:list` for conditional classes (not template literals)

### Components
- Always use `<Button>` from `@/components/button/Button.astro` — never raw `<button>` or `<a>` for actions
- Images: always use Astro's `<Image />` from `astro:assets` with `width={...}` and `densities={[1.5, 2]}`
- All components should be `.astro` files

### i18n
- Currently English-only (`en` default locale, no prefix)
- Content collections organized by locale: `src/data/blog/en/`
- Text translations via `useTranslations()` from `@/js/translationUtils`
- Locale detection via `getLocaleFromUrl()` from `@/js/localeUtils`
- Content filtering via `filterCollectionByLanguage()` or `getAllPosts(locale)`

### Path Aliases
- `@/*` → `src/*`
- `@images/*` → `src/assets/images/*`
- `@videos/*` → `src/assets/videos/*`
