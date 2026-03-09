import dramaImage from "../assets/genres/drama/desktop.jpg";
import comedyImage from "../assets/genres/comedy/desktop.jpg";
import detectiveImage from "../assets/genres/detective/desktop.jpg";
import familyImage from "../assets/genres/family/desktop.jpg";
import historyImage from "../assets/genres/history/desktop.jpg";
import thrillerImage from "../assets/genres/thriller/desktop.jpg";
import fantasyImage from "../assets/genres/fantasy/desktop.jpg";
import adventureImage from "../assets/genres/adventure/desktop.jpg";

export const genreImages: Record<string, string> = {
  drama: dramaImage,
  comedy: comedyImage,
  detective: detectiveImage,
  family: familyImage,
  history: historyImage,
  thriller: thrillerImage,
  fantasy: fantasyImage,
  adventure: adventureImage,
};

export const getGenreTitle = (genre: string) => {
  const titles: Record<string, string> = {
    drama: "Драма",
    comedy: "Комедия",
    detective: "Детектив",
    family: "Семейное",
    history: "Историческое",
    thriller: "Триллер",
    fantasy: "Фантастика",
    adventure: "Приключения",
  };

  return titles[genre] ?? genre;
};