import { VkIcon } from "../icons/VkIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { OkIcon } from "../icons/OkIcon";
import { TelegramIcon } from "../icons/TelegramIcon";

import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__socials">

          <a
            className="footer__social-link"
            href="#"
            aria-label="VK"
          >
            <VkIcon />
          </a>

          <a
            className="footer__social-link"
            href="#"
            aria-label="YouTube"
          >
            <YoutubeIcon />
          </a>

          <a
            className="footer__social-link"
            href="#"
            aria-label="Одноклассники"
          >
            <OkIcon />
          </a>

          <a
            className="footer__social-link"
            href="#"
            aria-label="Telegram"
          >
            <TelegramIcon />
          </a>

        </div>
      </div>
    </footer>
  );
};