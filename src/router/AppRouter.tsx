import { Routes, Route } from "react-router-dom"
import { HomePage } from "../pages/HomePage/HomePage"
import { GenresPage } from "../pages/GenresPage/GenresPage"
import { GenreMoviesPage } from "../pages/GenreMoviesPage/GenreMoviesPage"
import { MoviePage } from "../pages/MoviePage/MoviePage"
import { AccountPage } from "../pages/AccountPage/AccountPage"

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/genres" element={<GenresPage />} />
      <Route path="/genres/:genre" element={<GenreMoviesPage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  )
}