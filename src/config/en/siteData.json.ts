import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "Gold Simulations",
  // Your website's title and description (meta fields)
  title:
    "Gold Simulations — Economics simulation games for the classroom",
  description:
    "Gold Simulations builds immersive games that change how students learn economics. Designed for colleges, MBA programs, and high schools. Meet EconRunes.",

  // Your information for blog post purposes
  author: {
    name: "Gold Simulations",
    email: "news@goldsimulations.com",
    twitter: "GoldSimulations",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/cosmic-themes-logo.jpg",
    alt: "Cosmic Themes logo",
  },
};

export default siteData;