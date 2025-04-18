import { useState, useEffect, useCallback } from "react";

type LightboxProps = {
  thumb: string;
  fullsize: string;
  alt?: string;
  thumbnailClassName?: string;
};

export default function Lightbox({ thumb, fullsize, alt, thumbnailClassName }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <img
        src={thumb}
        alt={alt}
        className={thumbnailClassName}
        onClick={() => setIsOpen(true)}
        role="button"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={fullsize}
              alt={alt}
              className="w-full max-h-[80vh] object-contain mx-auto"
            />
            {alt && (
              <p className="mt-4 text-center text-sm text-gray-300">{alt}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

