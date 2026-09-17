# Archived pages

Astro ignores files and folders in `src/pages/` whose name starts with `_`, so
nothing in this directory builds a route. The files are otherwise untouched and
still type-check, so they won't silently rot.

## What's here and why

`sign-up.astro`, `sign-in.astro`, `password-reset.astro` were pulled out of
routing for the newsletter launch. At that point EconRunes wasn't available and
these three pages had no backend at all - the forms in
`src/components/forms/SignUpForm.astro`, `SignInForm.astro` and
`PasswordResetForm.astro` have no `action`, no `method` and no submit handler,
and the "Sign up with Google" button is `href="#"`. Shipping them would have
given launch visitors buttons that do nothing.

Their form components are still in `src/components/forms/` and are only imported
from here, so they're preserved too.

## Restoring one

```bash
git mv src/pages/_archived/sign-up.astro src/pages/sign-up.astro
```

That's all it takes - the route comes straight back. Before restoring, wire the
form up to a real backend (Supabase Auth is already a dependency, and
`src/lib/supabase.ts` has a configured server client).

## Related

Pricing was *not* archived. `src/components/pricing/PricingFourCards.astro` has
a `SHOW_PRICING` flag at the top - set it to `true` to bring the real prices
back.

**Restore the auth pages first.** Flipping that flag also restores all four
plan CTAs, and every one of them points at `/sign-up` - a route that lives in
this directory. Setting `SHOW_PRICING = true` on its own turns the pricing page
into four buttons that 404.

A full snapshot of the site before launch prep is tagged in git:

```bash
git show pre-launch-full-site
```
