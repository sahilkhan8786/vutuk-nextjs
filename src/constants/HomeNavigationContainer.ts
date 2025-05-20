import { FaHtml5} from "react-icons/fa6";

import { 
  SiAdobepremierepro, 
  SiAdobeaftereffects, 
  SiAdobephotoshop, 
  SiAdobeillustrator, 
  SiBlender,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  
  SiCinema4D
} from "react-icons/si";
import { HomeNavigationItem } from "@/types/types";

export const homeNavigation: HomeNavigationItem[] = [
  {
    id: 'web-development',
    title: 'WEB',
    isBorder: true,
    description: "Full-stack web development services from concept to deployment. We build fast, responsive, and scalable web applications.",
    image: '/vutuk-media.png',
    contentTitle: 'WEB DEVELOPMENT SERVICES',
    contentSubtitle: 'Modern Web Solutions',
    contentDescription: 'We specialize in building performant web applications using cutting-edge technologies. Our full-stack solutions are tailored to your business needs and optimized for user experience.',
    contentImage: '/vutuk-media.png',
    features: [
      'Custom Web Applications',
      'E-Commerce Solutions',
      'API Development',
      'Performance Optimization',
      'Progressive Web Apps'
    ],
    whyChooseUs: 'Our developer-first approach ensures your website is not just beautiful, but also performs exceptionally well with clean, maintainable code.',
    icons: [
      {
        position: { x: 0, y: 0 },
        initialPosition: { x: -35, y: 0 },
        icon: FaHtml5,
      },
      {
        position: { x: 95, y: 10 },
        initialPosition: { x: 95, y: 110 },
        icon: SiTypescript,
      },
      {
        position: { x: 0, y: 95 },
        initialPosition: { x: -20, y: 110 },
        icon: SiNextdotjs,
      },
      {
        position: { x: 95, y: 95 },
        initialPosition: { x: 110, y: 110 },
        icon: SiTailwindcss,
      },
    ],
  },
  {
    id: 'media',
    title: 'MEDIA',
    isBorder: true,
    description: "Professional video production and editing services for commercials, social media, and corporate videos.",
    image: '/vutuk-media.png',
    contentTitle: 'MEDIA PRODUCTION SERVICES',
    contentSubtitle: 'Cinematic Storytelling',
    contentDescription: 'From concept to final cut, our video production team creates stunning visuals that tell your story with impact. We specialize in corporate videos, commercials, and social media content.',
    contentImage: '/vutuk-media.png',
    features: [
      '4K Video Production',
      'Motion Graphics',
      'Color Grading',
      'Sound Design',
      'Animation'
    ],
    whyChooseUs: 'Our award-winning team has worked with major brands to create compelling video content that drives engagement and results.',
    icons: [
      {
        position: { x: 0, y: 0 },
        initialPosition: { x: -35, y: 0 },
        icon: SiAdobepremierepro,
      },
      {
        position: { x: 95, y: 10 },
        initialPosition: { x: 95, y: 110 },
        icon: SiAdobeaftereffects,
      },
      {
        position: { x: 0, y: 95 },
        initialPosition: { x: -20, y: 110 },
        icon: SiCinema4D,
      },
      {
        position: { x: 95, y: 95 },
        initialPosition: { x: 110, y: 110 },
        icon: SiAdobeillustrator,
      },
    ],
  },
  {
    id: 'design',
    title: 'DESIGN',
    isBorder: false,
    description: "Creative design solutions including branding, UI/UX, and marketing materials that make your brand stand out.",
    image: '/vutuk-design.png',
    contentTitle: 'DESIGN SERVICES',
    contentSubtitle: 'Visual Brand Identity',
    contentDescription: 'We create memorable brand identities and marketing materials that communicate your message effectively. Logos, brochures, packaging - we do it all with a strategic approach.',
    contentImage: '/vutuk-design.png',
    features: [
      'Brand Identity',
      'UI/UX Design',
      'Print Materials',
      'Digital Assets',
      '3D Modeling'
    ],
    whyChooseUs: 'With a focus on strategy and aesthetics, we design visuals that resonate with your target audience and elevate your brand perception.',
    icons: [
      {
        position: { x: 0, y: 0 },
        initialPosition: { x: -35, y: 0 },
        icon: SiFigma,
      },
      {
        position: { x: 95, y: 10 },
        initialPosition: { x: 95, y: 110 },
        icon: SiAdobephotoshop,
      },
      {
        position: { x: 0, y: 95 },
        initialPosition: { x: -20, y: 110 },
        icon: SiBlender,
      },
      {
        position: { x: 95, y: 95 },
        initialPosition: { x: 110, y: 110 },
        icon: SiAdobeillustrator,
      },
    ],
  }
];