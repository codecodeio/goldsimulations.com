import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Gold Simulations",
  // Your website's title and description (meta fields)
  title:
    "Immersive simulations that bring your classroom to life.",
  description:
    "Turn economic concepts into hands-on learning with immersive simulations that bring your classroom to life. Let students explore, experiment, and truly understand how economies work. Built for high schools, colleges, and MBA programs.",

  // Your information for blog post purposes
  author: {
    name: "Gold Simulations",
    email: "blog@goldsimulations.com",
    twitter: "GoldSimulations",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/cosmic-themes-logo.jpg",
    alt: "Cosmic Themes logo",
  },
};

export default siteData;