/**
 * * This file is used to define the navigation links for the site.
 * Notes:
 * 1 level of dropdown is supported
 * Mega menus look best with 3-5 columns, but supports anything > 2 columns
 * If using icons, the icon should be saved in the src/icons folder. If filename is "tabler/icon.svg" then input "tabler/icon"
 * Recommend getting icons from https://tabler.io/icons
 */

// types
import { type navItem } from "../types/configDataTypes";

// note: 1 level of dropdown is supported
const navConfig: navItem[] = [
  {
    text: "Features",
    link: "/features/",
  }, 
  // dropdown
  {
    text: "Games",
    dropdown: [
      {
        text: "Econ runes",
        link: "/games/econrunes/",
        icon: "tabler/triangle-square-circle",
      },
      {
        text: "Beat The Market",
        link: "/games/beat-the-market/",
        icon: "tabler/chart-line",
      },
    ],
  },
  // dropdown
  {
    text: "Resources",
    dropdown: [
      {
        text: "Syllabus",
        link: "/resources/syllabus/",
        icon: "tabler/file-description",
      },
      {
        text: "Learning Objectives",
        link: "/resources/learning-objectives/",
        icon: "tabler/target-arrow",
      },
    ],
  },
  {
    text: "Pricing",
    link: "/pricing/",
  },
  {
    text: "News",
    link: "/news/",
  },
];

export default navConfig;
