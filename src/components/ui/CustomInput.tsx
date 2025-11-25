// components/CustomInput.tsx
"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "./CustomInput.module.scss";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";

interface CustomInputProps {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "password";
  placeholder?: string;
  disabled?: boolean;
  hasAdornment?: boolean;
  autoComplete?: string;
  inputMode?:
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
}

export default function CustomInput({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  hasAdornment = false,
  autoComplete,
  inputMode,
}: CustomInputProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <label style={{ fontSize: 14, marginBottom: 4 }}>{label}</label>

      {type === "tel" ? (
        <Controller
          name={name}
          control={control}
          rules={{
            validate: (value) =>
              isValidPhoneNumber(value || "") || "Неверный номер телефона",
          }}
          render={({ field }) => (
            <PhoneInput
              {...field}
              defaultCountry="KZ"
              international={true}
              disabled={disabled}
              placeholder={placeholder || "+7 (___) ___-__-__"}
              className={`${styles.phoneInput} ${error ? styles.error : ""}`}
              autoComplete={autoComplete}
              inputMode={inputMode}
              onChange={(value) => {
                if (!value || value === "+7") {
                  field.onChange(null);
                  return;
                } else {
                  const rawDigits = value.replace(/\D/g, "");
                  if (rawDigits.length > 11) {
                    const trimmed = "+" + rawDigits.slice(0, 11);
                    field.onChange(trimmed);
                  } else {
                    field.onChange(value);
                  }
                }
              }}
              onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                const input = e.currentTarget;
                const value = input.value;
                const selectionStart = input.selectionStart || 0;
                const selectionEnd = input.selectionEnd || 0;
                const inputChar = (e.nativeEvent as InputEvent).data || "";

                const rawDigits = value.replace(/\D/g, "");
                const isDigit = /^\d$/.test(inputChar);

                let newDigitsCount = rawDigits.length;

                if (selectionStart !== selectionEnd) {
                  const selectedText = value.slice(
                    selectionStart,
                    selectionEnd
                  );
                  const selectedDigits = selectedText.replace(/\D/g, "").length;
                  newDigitsCount -= selectedDigits;
                }

                if (isDigit) {
                  newDigitsCount += 1;
                }

                if (newDigitsCount > 11) {
                  e.preventDefault();
                }
              }}
              onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                const paste = e.clipboardData.getData("Text");
                const digits = paste.replace(/\D/g, "");

                if (digits.length > 11) {
                  e.preventDefault();

                  // Можно вставить только первые 11 цифр
                  const trimmed = "+" + digits.slice(0, 11);

                  // Обновляем значение вручную через field.onChange
                  field.onChange(trimmed);
                }
              }}
            />
          )}
        />
      ) : (
        <OutlinedInput
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name)}
          sx={{
            height: 48,
            "& input": { fontSize: 16, padding: "8px 12px" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#DA2323" : "rgba(0,0,0,0.16)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#DA2323" : "#0147FF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0147FF",
            },
          }}
          endAdornment={
            <>
              {hasAdornment && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )}
              {error && (
                <InputAdornment position="end">
                  <ErrorOutlineIcon
                    color="error"
                    fontSize="small"
                    sx={{ opacity: 0.8 }}
                  />
                </InputAdornment>
              )}
            </>
          }
        />
      )}

      <FormHelperText>{error?.message as string}</FormHelperText>
    </FormControl>
  );
}
