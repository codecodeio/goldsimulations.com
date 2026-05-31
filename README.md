# Gold Simulations

[goldsimulations.com](https://www.goldsimulations.com) — Economic simulation games for education and personal learning, built with EconRunes.

## Getting Started

1. Install dependencies: `pnpm install`
2. Run an initial build: `pnpm build`
3. Configure i18n (one or multiple languages): `pnpm config-i18n`
4. Start the dev server: `pnpm dev`

## Commands

All commands are run from the root of the project:

| Command              | Action                                           |
| :------------------- | :----------------------------------------------- |
| `pnpm install`       | Install dependencies                             |
| `pnpm dev`           | Start local dev server at `localhost:4321`        |
| `pnpm build`         | Build production site to `./dist/`               |
| `pnpm preview`       | Preview production build locally                 |
| `pnpm lint`          | Run ESLint checks                                |
| `pnpm format`        | ESLint fix + Prettier formatting                 |
| `pnpm astro ...`     | Run Astro CLI commands (`astro add`, `astro check`) |

## Tech Stack

- **[Astro](https://astro.build)** v5 — Static site framework
- **TypeScript** — Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** v4 — Utility-first styling
- **[Starwind UI](https://starwind.dev)** — Component library
- **[React](https://react.dev)** — Interactive components
- **[Keystatic](https://keystatic.com)** — Content management (accessible at `/admin`)
- **[Netlify](https://netlify.com)** — Deployment

## Project Structure

```
src/
├── pages/          # File-based routing
├── components/     # Astro components organized by feature
├── layouts/        # BaseLayout and specialized layouts
├── data/           # Content collections (blog, authors, services, etc.)
├── config/         # Site settings, translations
├── styles/         # Tailwind theme and global styles
├── js/             # Utility functions
└── assets/         # Images and videos
```

## Systems & Costs

External services this site depends on.

| System | What it does | Plan | Cost |
| :----- | :----------- | :--- | :--- |
| **[Netlify](https://netlify.com)** | Hosting, builds, and deploys (connected to the private repo). | Free (legacy) | $0 — well within free limits (custom domains, private repos, HTTPS, and 300 build min/mo are all included). |
| **[Supabase](https://supabase.com)** | Postgres database for `newsletter_subscribers`; shared project intended for cross-subdomain SSO with EconRunes and future games. | Pro | ~$25/mo base + compute. Two Micro Compute instances (`goldsimulations`, `codecode.io`) ≈ $8.82/mo each, offset by $10 compute credits. Projected ≈ **$35/mo** total. |
| **[Resend](https://resend.com)** | Transactional email (subscription confirmations) and the newsletter audience/segments. | Pro | $20/mo — shared with another site; Pro adds up to 10 verified sending domains. |
| **[Porkbun](https://porkbun.com)** | Domain registration for `goldsimulations.com`. | — | ~$11.08/yr (≈ $0.92/mo) at current renewal pricing. |
| **[Claude](https://www.anthropic.com/)** | AI development assistant (Claude Code). | Pro | $20/mo. |

### Approximate Total

| Period | Cost |
| :----- | :--- |
| Monthly | ≈ **$76/mo** (Netlify $0 + Supabase ~$35 + Resend $20 + Claude $20 + Porkbun ~$0.92) |
| Yearly | ≈ **$912/yr** |

## Content Management

Content is managed through [Keystatic CMS](https://keystatic.com) or by editing MDX/Markdown files directly in `src/data/`. Collections include blog posts, authors, services, projects, careers, and resume data.

To remove Keystatic: `pnpm remove-keystatic`

## Customization

- **Theme & colors**: `src/styles/tailwind-theme.css` and `src/styles/global.css`
- **Site settings**: `src/config/siteSettings.json.ts`
- **AI rules**: `.rules/` directory contains style guide, general rules, and i18n conventions

## Documentation

- [Style customization](https://cosmicthemes.com/docs/styles/)
- [Content editing](https://cosmicthemes.com/docs/content/)
- [Animations](https://cosmicthemes.com/docs/animations/)
- [Keystatic CMS](https://cosmicthemes.com/docs/keystatic/)
- [Forms](https://cosmicthemes.com/docs/contact-form/)
- [i18n](https://cosmicthemes.com/docs/i18n/)
- [Astro docs](https://docs.astro.build)

Built on the [Kitchen Sink Starter](https://starter.cosmicthemes.com/) by [Cosmic Themes](https://cosmicthemes.com/).
