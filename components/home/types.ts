export type RibbonProject = {
  src: string;
  pos: [number, number];
  name: string;
  meta: string;
  href: string | null;
  ar?: number;
  label?: string;
  mobileSrc?: string;
  mobilePos?: [number, number];
  mobileAr?: number;
};

export type ServiceItem = {
  title: string;
  number: string;
  copy: string;
  peek: string;
};

export type HomeImage = {
  src: string;
  alt: string;
  position: string;
  ratio: string | null;
};

export type HomeContent = {
  hero: {
    image: HomeImage | null;
    mobileImage: HomeImage | null;
    line1: string;
    line2: string;
  };
  projects: RibbonProject[];
  services: ServiceItem[];
  about: {
    paragraphs: string[];
    portrait: HomeImage | null;
    base: string;
    disciplines: string;
  };
  contact: {
    email: string;
    instagram: string;
  };
};
