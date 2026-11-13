export type RibbonProject = {
  src: string;
  pos: [number, number];
  name: string;
  meta: string;
  href: string | null;
  ar?: number;
  label?: string;
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
    line1: string;
    line2: string;
  };
  projects: RibbonProject[];
  services: ServiceItem[];
  about: {
    paragraphs: string[];
    portrait: HomeImage | null;
  };
  contact: {
    email: string;
    instagram: string;
  };
};
