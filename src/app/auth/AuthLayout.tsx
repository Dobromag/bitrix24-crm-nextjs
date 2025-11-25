"use client";

import styles from "@/styles/auth/login.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Link from "next/link";
import { useState } from "react";
import { useForm, UseFormSetError } from "react-hook-form";
import * as yup from "yup";

// Тип для конфигурации полей
export interface FieldConfig {
  name: string;
  placeholder: string;
  component?: "text" | "password";
  hasAdornment?: boolean;
}

// Тип для формы
type FormData = Record<string, string | undefined>;

export default function AuthLayout({
  title,
  fieldsConfig,
  onSubmit,
  buttonText,
  linkText,
  linkHref,
  variant = "login",
  inputHeight = 48,
  inputFontSize = 16,
  buttonHeight = 48,
  buttonFontSize = 16,
}: {
  title: string;
  fieldsConfig: FieldConfig[];
  onSubmit: (
    data: FormData,
    setError: UseFormSetError<FormData>
  ) => Promise<void>;

  buttonText: string;
  linkText: string;
  linkHref: string;
  variant?: "login" | "register";
  inputHeight?: number;
  inputFontSize?: number;
  buttonHeight?: number;
  buttonFontSize?: number;
}) {
  // Динамическая схема валидации
  const dynamicSchema = yup.object(
    fieldsConfig.reduce((schema, field) => {
      if (field.name === "name") {
        schema[field.name] = yup
          .string()
          .required("Имя обязательно")
          .min(3, "Имя должно содержать минимум 3 символа");
      } else if (field.name === "email") {
        schema[field.name] = yup
          .string()
          .required("Email обязателен")
          .email("Пожалуйста, введите корректный адрес электронной почты");
      } else if (field.name === "password") {
        schema[field.name] = yup
          .string()
          .required("Пароль обязателен")
          .matches(
            /^(?=.*[A-Z])(?=.*\d).{6,}$/,
            "Пароль должен содержать минимум 6 символов, одну заглавную букву и одну цифру"
          );
      } else if (field.name === "confirmPassword") {
        schema[field.name] = yup
          .string()
          .oneOf([yup.ref("password")], "Пароли должны совпадать")
          .required("Повторите пароль");
      } else {
        schema[field.name] = yup
          .string()
          .required(`${field.placeholder} обязателен`);
      }
      return schema;
    }, {} as Record<string, yup.StringSchema>)
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: variant === "register" ? yupResolver(dynamicSchema) : undefined,
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleClickShowPassword = (fieldName: string) =>
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className={`${styles.container} ${styles[variant]}`}>
      <div className={styles.formWrapper}>
        <div className={styles.logo}>Логотип</div>
        <h1 className={styles.title}>{title}</h1>

        <form
          className={styles.form}
          onSubmit={handleSubmit((data) => onSubmit(data, setError))}
        >
          {fieldsConfig.map((field) => (
            <div key={field.name}>
              <div className={styles.label}>{field.placeholder}</div>
              <FormControl
                variant="outlined"
                fullWidth
                margin="none"
                sx={{ marginTop: "4px" }}
                error={!!errors[field.name]}
              >
                <OutlinedInput
                  type={
                    field.component === "password" && !showPassword[field.name]
                      ? "password"
                      : "text"
                  }
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  sx={{
                    height: inputHeight,
                    "& input": {
                      fontSize: inputFontSize,
                      padding: "8px 10px",
                    },
                  }}
                  endAdornment={
                    <>
                      {field.hasAdornment && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleClickShowPassword(field.name)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword[field.name] ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )}
                      {errors[field.name] && (
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
                <FormHelperText>{errors[field.name]?.message}</FormHelperText>
              </FormControl>
            </div>
          ))}

          {errors.root && (
            <p className={styles.error}>{errors.root.message as string}</p>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || isSubmitting}
            className={styles.button}
            sx={{
              height: buttonHeight,
              fontSize: buttonFontSize,
              textTransform: "none",
            }}
          >
            {isSubmitting ? "Загрузка..." : buttonText}
          </Button>
        </form>

        <div className={styles.orWrapper}>
          <span className={styles.line}></span>
          <span className={styles.or}>или</span>
          <span className={styles.line}></span>
        </div>

        <Link href={linkHref} className={styles.registerLink}>
          {linkText}
        </Link>
      </div>

      <div className={styles.imageWrapper}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(/images/auth/login-car.jpg)` }}
        ></div>
      </div>
    </div>
  );
}
