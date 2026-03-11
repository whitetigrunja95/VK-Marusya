import dramaDesktop from "../assets/genres/drama/desktop.jpg";
import dramaDesktop2x from "../assets/genres/drama/desktop@2x.jpg";
import dramaMobile from "../assets/genres/drama/mobile.jpg";
import dramaMobile2x from "../assets/genres/drama/mobile@2x.jpg";

import comedyDesktop from "../assets/genres/comedy/desktop.jpg";
import comedyDesktop2x from "../assets/genres/comedy/desktop@2x.jpg";
import comedyMobile from "../assets/genres/comedy/mobile.jpg";
import comedyMobile2x from "../assets/genres/comedy/mobile@2x.jpg";

import detectiveDesktop from "../assets/genres/detective/desktop.jpg";
import detectiveDesktop2x from "../assets/genres/detective/desktop@2x.jpg";
import detectiveMobile from "../assets/genres/detective/mobile.jpg";
import detectiveMobile2x from "../assets/genres/detective/mobile@2x.jpg";

import familyDesktop from "../assets/genres/family/desktop.jpg";
import familyDesktop2x from "../assets/genres/family/desktop@2x.jpg";
import familyMobile from "../assets/genres/family/mobile.jpg";
import familyMobile2x from "../assets/genres/family/mobile@2x.jpg";

import historyDesktop from "../assets/genres/history/desktop.jpg";
import historyDesktop2x from "../assets/genres/history/desktop@2x.jpg";
import historyMobile from "../assets/genres/history/mobile.jpg";
import historyMobile2x from "../assets/genres/history/mobile@2x.jpg";

import thrillerDesktop from "../assets/genres/thriller/desktop.jpg";
import thrillerDesktop2x from "../assets/genres/thriller/desktop@2x.jpg";
import thrillerMobile from "../assets/genres/thriller/mobile.jpg";
import thrillerMobile2x from "../assets/genres/thriller/mobile@2x.jpg";

import fantasyDesktop from "../assets/genres/fantasy/desktop.jpg";
import fantasyDesktop2x from "../assets/genres/fantasy/desktop@2x.jpg";
import fantasyMobile from "../assets/genres/fantasy/mobile.jpg";
import fantasyMobile2x from "../assets/genres/fantasy/mobile@2x.jpg";

import adventureDesktop from "../assets/genres/adventure/desktop.jpg";
import adventureDesktop2x from "../assets/genres/adventure/desktop@2x.jpg";
import adventureMobile from "../assets/genres/adventure/mobile.jpg";
import adventureMobile2x from "../assets/genres/adventure/mobile@2x.jpg";

export const genreImages = {
  drama: {
    desktop: dramaDesktop,
    desktop2x: dramaDesktop2x,
    mobile: dramaMobile,
    mobile2x: dramaMobile2x,
  },
  comedy: {
    desktop: comedyDesktop,
    desktop2x: comedyDesktop2x,
    mobile: comedyMobile,
    mobile2x: comedyMobile2x,
  },
  detective: {
    desktop: detectiveDesktop,
    desktop2x: detectiveDesktop2x,
    mobile: detectiveMobile,
    mobile2x: detectiveMobile2x,
  },
  family: {
    desktop: familyDesktop,
    desktop2x: familyDesktop2x,
    mobile: familyMobile,
    mobile2x: familyMobile2x,
  },
  history: {
    desktop: historyDesktop,
    desktop2x: historyDesktop2x,
    mobile: historyMobile,
    mobile2x: historyMobile2x,
  },
  thriller: {
    desktop: thrillerDesktop,
    desktop2x: thrillerDesktop2x,
    mobile: thrillerMobile,
    mobile2x: thrillerMobile2x,
  },
  fantasy: {
    desktop: fantasyDesktop,
    desktop2x: fantasyDesktop2x,
    mobile: fantasyMobile,
    mobile2x: fantasyMobile2x,
  },
  adventure: {
    desktop: adventureDesktop,
    desktop2x: adventureDesktop2x,
    mobile: adventureMobile,
    mobile2x: adventureMobile2x,
  },
} as const;

export type GenreSlug = keyof typeof genreImages;

export const getGenreTitle = (genre: GenreSlug) => {
  const titles: Record<GenreSlug, string> = {
    drama: "Драма",
    comedy: "Комедия",
    detective: "Детектив",
    family: "Семейное",
    history: "Историческое",
    thriller: "Триллер",
    fantasy: "Фантастика",
    adventure: "Приключения",
  };

  return titles[genre];
};