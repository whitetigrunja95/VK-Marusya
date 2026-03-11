export type GenreImageSet = {
  desktop: string;
  desktop2x: string;
  mobile: string;
  mobile2x: string;
};

export type Genre = {
  slug: string;
  title: string;
  image?: GenreImageSet;
};