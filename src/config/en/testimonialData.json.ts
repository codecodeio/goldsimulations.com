import OCUM from "@images/testimonials/OCU-Meinders.webp";
import IndianaUniversity from "@images/testimonials/induanauniversity.webp";
import LCCC from "@images/testimonials/LCCC.webp";
import SGU from "@images/testimonials/SGU.webp";
import USCB from "@images/testimonials/uscb.webp";
import ColumbiaHS from "@images/testimonials/ColumbiaHS.webp";
import LanderValleyHS from "@images/testimonials/LanderValleyHS.webp";

import { type TestimonialItem } from "../types/configDataTypes";

export const testimonialData: TestimonialItem[] = [
  {
    avatar: USCB,
    name: "University of South Carolina",
    title: "Beaufort",
    testimonial: `It was by far the most popular component of my Microeconomics course. 
    The game allowed me to demonstrate to the students the results of their decision-making and they were able to translate concepts and theory into actual business situations. 
    `,
  },
  {
    avatar: IndianaUniversity,
    name: "Indiana University",
    title: "Southeast",
    testimonial: `I love using the Beat the Market simulation. 
    For me, it's about application. Students are learning about Price elasticity & profit maximization, but it doesn't really "hit home" or make sense until they utilize these ideas in the simulation. 
    The students learned what MC=MR is really about. because the decisions they made in the game had demand & profit consequences.
    `,
  },

  {
    avatar: OCUM,
    name: "Oklahoma City University",
    title: "Meinders School of Business",
    testimonial: `Beat the Market games are great for helping students understand different market structures. 
    Overall, I have persisted in using Beat the Market in my intermediate microeconomics class because it has, in my opinion, significantly improved the economic understanding and quantitative skills of my students relative to other methods I have tried. An added benefit is the enthusiasm of students to participate in the games. 
    They enjoy it quite a bit.
      `,
  },
  {
    avatar: SGU,
    name: "St. Gregory's University",
    title: "Shawnee, Oklahoma",
    testimonial: `I have used the Beat the Market business simulation in both graduate and undergraduate micro courses and I found the product to be overwhelmingly helpful in reaching the students and helping them to understand the material. 
    I highly recommend this product to any instructor desiring to step up their game!
      `,
  },
  {
    avatar: ColumbiaHS,
    name: "Columbia High School",
    title: "Columbia Station, Ohio",
    testimonial: `I have been using BTM (Beat the Market) for about a decade now with my college classes and at Columbia High School. 
    I find the simulation to be incredibly beneficial in Microeconomics. 
    `,
  },
  {
    avatar: LCCC,
    name: "Lorain County Community College",
    title: "Lorain County, Ohio",
    testimonial: `The simulation allows the students to engage in running a business, where their decision-making -- based on core economic concepts -- incites maximum effort from the students with respect to calculating elasticities critical to optimal decision-making, as well as a better understanding of macro variables impacting the economy. 
    I recommend BTM without reservation, as it has made a remarkable difference in my student’s mastery of the overall material in Microeconomics.
      `,
  },
  {
    avatar: USCB,
    name: "University of South Carolina",
    title: "Beaufort",
    testimonial: `The simulation was easy to use in a large class setting. 
    Administration of the BTM Game was straightforward, the tutorials were very effective. 
    I used the multi-player option with students organized in teams. Team rankings were used as a part of my course grade. 
    I would recommend the BTM Game to anyone teaching a basic microeconomics course - it would be effective in both undergraduate and graduate level courses.
      `,
  },
   {
    avatar: LanderValleyHS,
    name: "Lander Valley High School",
    title: "Lander, WY",
    testimonial: `The Beat The Market Simulation has been very beneficial for my Senior Economics students at Lander Valley High School. 
    We have used the simulation over the last 10 years and students report that it is great at cementing the concepts of Price Elasticity, Supply, Demand, Market Pricing, and competition. 
    Students report that it is their favorite activity of the semester each school year.
    `,
  },
];

export default testimonialData;