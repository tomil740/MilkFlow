import React, { useEffect, useState } from "react";

interface FetchImageProps {
  imgId: string;
  className?: string;
  loading?: "lazy" | "eager";
}

const FetchImage: React.FC<FetchImageProps> = ({
  imgId,
  className,
  loading = "lazy",
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const basePath = "productsImages/regular/"; // Prefix for regular images
  const fallbackSrc = "productsImages/logos/large_logo.webp"; // Static fallback
  const pngFallbackSrc = "productsImages/logos/large_logo.png"; // Static PNG fallback

  useEffect(() => {
    const image = new Image();
    const webpSrc = `${basePath}${imgId}.webp`;
    image.src = webpSrc;

    image.onload = () => setImageSrc(webpSrc); // WebP loaded successfully
    image.onerror = () => setImageSrc(fallbackSrc); // Fallback to default WebP
  }, [imgId]);

  return (
    <picture>
      <source srcSet={imageSrc} type="image/webp" />
      <img
        src={pngFallbackSrc} // Default PNG fallback
        loading={loading}
        className={className}
        alt=""
      />
    </picture>
  );
};

export default FetchImage;
