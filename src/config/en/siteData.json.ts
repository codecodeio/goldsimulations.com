import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Starter",
	// Your website's title and description (meta fields)
	title:
		"Starter - The kitchen sink starter for many types of sites like SaaS, business, and blogs. Remove what you don't need and deploy.",
	description:
		"Create an amazing website for your small business clients with our beautiful website theme designed using Astro and Tailwind CSS. Perfect for freelancers, developers, startups, and personal use.",

	// Your information for blog post purposes
	author: {
		name: "Cosmic Themes",
		email: "creator@cosmicthemes.com",
		twitter: "Cosmic_Themes",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/cosmic-themes-logo.jpg",
		alt: "Cosmic Themes logo",
	},
};

export default siteData;
