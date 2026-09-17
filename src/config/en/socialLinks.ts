/**
 * Social links, defined once and shared by the footer and the contact page.
 *
 * These were previously hardcoded in the footer only, which is how the Facebook
 * icon ended up pointing at twitter.com. Keep this the single source.
 *
 * TODO: confirm the Facebook URL. The handle is assumed to match the other
 * accounts; correct it here if the page lives somewhere else.
 */
export interface SocialLink {
  label: string;
  /** astro-icon name, e.g. "tabler/brand-facebook" */
  icon: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    icon: "tabler/brand-facebook",
    href: "https://www.facebook.com/goldsimulations",
  },
  {
    label: "X (Twitter)",
    icon: "tabler/brand-x",
    href: "https://twitter.com/goldsimulations",
  },
];
