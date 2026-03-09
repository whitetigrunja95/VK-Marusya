import { HeroMovie } from "../../components/HeroMovie/HeroMovie";
import { TopMovies } from "../../components/TopMovies/TopMovies";
import { MainLayout } from "../../layouts/MainLayout";

export const HomePage = () => {
  return (
    <MainLayout>
      <HeroMovie />
      <TopMovies />
    </MainLayout>
  );
};