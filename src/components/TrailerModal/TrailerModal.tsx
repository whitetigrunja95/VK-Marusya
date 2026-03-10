import { useEffect, useMemo, useState } from "react";
import "./TrailerModal.css";

type TrailerModalProps = {
  isOpen: boolean;
  trailerUrl?: string;
  title: string;
  onClose: () => void;
};

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }

    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.searchParams.get("v")
    ) {
      const videoId = parsedUrl.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }

    return url;
  } catch (error) {
    console.error("Не удалось преобразовать ссылку трейлера:", error);
    return url;
  }
};

export const TrailerModal = ({
  isOpen,
  trailerUrl,
  title,
  onClose,
}: TrailerModalProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPaused(false);
      setIsHovered(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const embedUrl = useMemo(() => {
    return getYoutubeEmbedUrl(trailerUrl);
  }, [trailerUrl]);

  if (!isOpen || !embedUrl) {
    return null;
  }

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="trailer-modal">
      <div className="trailer-modal__overlay" onClick={onClose} />

      <div className="trailer-modal__content">
        <button
          className="trailer-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть трейлер"
        >
          ×
        </button>

        <div
          className={`trailer-modal__player ${
            isPaused ? "trailer-modal__player--paused" : ""
          }`}
          onClick={handleTogglePause}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <iframe
            className="trailer-modal__iframe"
            src={embedUrl}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />

          {isPaused && (
            <div
              className={`trailer-modal__pause-overlay ${
                isHovered ? "trailer-modal__pause-overlay--hovered" : ""
              }`}
            >
              <div className="trailer-modal__pause-center">
                <span className="trailer-modal__pause-icon">▶</span>
              </div>

              <div className="trailer-modal__title-bar">
                <span className="trailer-modal__title">{title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};