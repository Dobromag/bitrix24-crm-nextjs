"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.scss";

const navLinks = [
  { href: "/dashboard", label: "Дашборд", icon: "/images/icons/dashboard.svg" },
  { href: "/profile", label: "Профиль", icon: "/images/icons/profile.svg" },
  { href: "/orders", label: "Заказы", icon: "/images/icons/orders.svg" },
  { href: "/payments", label: "Платежи", icon: "/images/icons/payments.svg" },
  { href: "/stream", label: "Трасляция", icon: "/images/icons/stream.svg" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["userData"], null);

    // Затем делаем рефетч для нового пользователя
    queryClient.invalidateQueries({ queryKey: ["userData"] });

    router.push("/auth/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link href="/">
          {/* <Image
            src="/images/icons/logo.svg"
            alt="Logo"
            width={120}
            height={40}
          /> */}
          <span className={styles.logoText}>Логотип</span>
        </Link>
      </div>

      {/* Навигация */}
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${
                  pathname === link.href ? styles.active : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={18}
                  height={18}
                  className={`${styles.icon} ${
                    pathname === link.href ? styles.activeIcon : ""
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className={styles.logout}>
          <span>Выйти</span>
        </button>
      </nav>

      {/* Бургер */}
      <button
        className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
