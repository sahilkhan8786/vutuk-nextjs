import { IconType } from 'react-icons';
export interface NavLinkProps {
    href: string;
    label: string;
    id: string;
  }
  




  export interface IconPosition {
    x: number;
    y: number;
  }
  
  export interface NavigationIcon {
    position: IconPosition;
    icon: IconType;
    initialPosition: IconPosition;
  }
  
  export interface HomeNavigationItem {
    id: string;
    title: string;
    isBorder: boolean;
    description: string;
    image: string;
    icons: NavigationIcon[];
    contentTitle: string;
    contentSubtitle: string;
    contentDescription: string;
    contentImage: string;
    features: string[];
    whyChooseUs: string;
  }


export interface AboutDetailsProps{
  id: string,
  title: string,
  description: string[],
  image: string,
  isReverse:boolean
}