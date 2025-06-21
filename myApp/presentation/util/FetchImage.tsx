import React, { useState } from "react";

interface FetchImageProps {
  imgId: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

const FetchImage: React.FC<FetchImageProps> = ({
  imgId,
  alt,
  className,
  loading = "lazy",
}) => {
  const fallbackUrl = "https://cdn.jsdelivr.net/gh/tomil740/AssetsData@main/productsImages/logos/large_logo.webp";
  const imageUrl = `https://cdn.jsdelivr.net/gh/tomil740/AssetsData@main/productsImages/regular/${imgId}.webp`;

  const [src, setSrc] = useState(imageUrl);

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setSrc(fallbackUrl)}
    />
  );
};

export default FetchImage;
