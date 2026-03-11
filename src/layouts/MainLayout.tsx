import type { ReactNode } from "react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">{children}</main>
      <Footer />
    </div>
  );
};