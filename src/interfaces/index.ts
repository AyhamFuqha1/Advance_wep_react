export interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
  num: string;
}

export interface Slide {
  img: string;
  title: string;
  desc: string;
}

export interface NavItem {
  label: string;
  path: string;
}