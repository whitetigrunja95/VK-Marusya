import { useEffect, useMemo } from "react";
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
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const embedUrl = useMemo(() => {
    return getYoutubeEmbedUrl(trailerUrl);
  }, [trailerUrl]);

  if (!isOpen || !embedUrl) {
    return null;
  }

  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button
        className="trailer-modal__overlay"
        type="button"
        aria-label="Закрыть трейлер"
        onClick={onClose}
      />

      <div className="trailer-modal__content">
        <button
          className="trailer-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть трейлер"
        >
          ×
        </button>

        <div className="trailer-modal__player">
          <iframe
            className="trailer-modal__iframe"
            src={embedUrl}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="trailer-modal__footer">
          <h2 className="trailer-modal__title">{title}</h2>
        </div>
      </div>
    </div>
  );
};