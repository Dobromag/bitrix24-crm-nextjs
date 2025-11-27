"use client";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  preview: string;
  onFileChange: (file: File | null) => void;
  onReset: () => void;
  disabled?: boolean;
  size: number;
  alt: string;
}

export default function Avatar({
  preview,
  onFileChange,
  onReset,
  disabled = false,
  size,
  alt,
}: AvatarProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    if (!disabled) document.getElementById("avatar-input")?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const text =
    preview === "/images/icons/default-avatar.svg"
      ? "Выбрать фото"
      : "Изменить фото";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        cursor: !disabled ? "pointer" : "default",
        border: "1px solid rgba(0,0,0,0.14)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <Image
        src={preview}
        alt={alt}
        width={size}
        height={size}
        style={{
          objectFit:
            preview === "/images/icons/default-avatar.svg"
              ? "contain"
              : "cover",
          display: "block",
          margin: "auto",
        }}
        priority
        unoptimized
        onError={() => console.error("Failed to load avatar:", preview)}
      />
      {isHovering && !disabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <AddPhotoAlternateIcon fontSize="large" />
          <Typography variant="body2">{text}</Typography>
          {preview !== "/images/icons/default-avatar.svg" && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              style={{ color: "#DA2323", marginTop: 8 }}
            >
              <DeleteIcon />
              <Typography variant="body2">Удалить</Typography>
            </IconButton>
          )}
        </div>
      )}
      <input
        id="avatar-input"
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
