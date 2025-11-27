# Bitrix24 CRM Next.js Test App

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://typescriptlang.org/) [![Bitrix24](https://img.shields.io/badge/Bitrix24-API-blue?style=flat&logo=bitrix24)](https://www.bitrix24.com/) [![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-blueviolet?style=flat&logo=railway)](https://railway.app)

Добро пожаловать в Тестовое приложение реализована на Next.js для работы с Bitrix24 CRM: аутентификация, дашборд, профиль, заказы, платежи, трансляция. Реализовано с fallback на mock данные при downtime Bitrix, adaptive UI, React Query for data, Zod validation.

Live demo: [bitrix24-crm-nextjs-production.up.railway.app](https://bitrix24-crm-nextjs-production.up.railway.app/profile)

## Features
- **Аутентификация**: Регистрация/логин с Bitrix contact create (sync queue if API down), JWT, password hash (bcrypt).
- **Дашборд**: Orders Swiper (mock/Bitrix deals), profile preview, stream preview, payments table with filter dropdown.
- **Профиль**: Edit name/email/phone/address/avatar, password change with history check.
- **Заказы**: Bitrix deals list (pagination), status mapping, repeat deal (copy fields + new contactId).
- **Платежи**: Bitrix invoices list, status update, filters (search, status, date range).
- **Трансляция**: Static ver-stka with CSS animation.
- **Bitrix Integration**: Webhook for CRM (deals/invoices/contacts), fallback mock/pending sync.
- **Adaptive**: MUI + SCSS media queries (desktop/mobile).
- **Perf/Security**: React Query cache/invalidate, Zod TS-safe validation, middleware token check.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.
- **State/Data**: React Query (TanStack), React Hook Form + Zod.
- **UI**: MUI 7, SCSS modules, Swiper 12.
- **Backend**: Next API routes, better-sqlite3 (SQLite DB), jose (JWT), bcrypt (hash).
- **Bitrix**: CRM API (deals, invoices, contacts), webhook.
- **Deployment**: Railway (live demo), GitHub.

## Installation
1. Clone repo:
   ```
   git clone https://github.com/Dobromag/bitrix24-crm-nextjs.git
   cd bitrix24-crm-nextjs
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set .env.local (example in .env.example):
   - JWT_SECRET=your_secret
   - BITRIX_WEBHOOK_URL=your_bitrix_webhook
4. Run dev:
   ```
   npm run dev
   ```
   Open http://localhost:3000/auth/login.

## Usage
- Register/login: Creates Bitrix contact (or queues if down).
- Dashboard: Aggregates data from features.
- Profile: Edit + upload avatar.
- Orders: List deals, repeat with copy.
- Payments: List invoices, pay (status update).
- Stream: Static preview.
- Sync Bitrix: POST /api/sync-bitrix for pending contacts.

## Screenshots
### Dashboard (Desktop)
![Дашборд](https://github.com/user-attachments/assets/d820d6f6-4358-4d16-90ae-3311bcd9ab8b)

### Login
<img width="1796" height="906" alt="image" src="https://github.com/user-attachments/assets/70fe0d68-653e-4eaf-be40-1b8420bba49f" />

### Profile
![Профиль](https://github.com/user-attachments/assets/ba5aebc6-d2a5-4b55-a212-35d18442244e)

### Orders
![Заказы](https://github.com/user-attachments/assets/3e41c24e-de0e-42bf-ad40-aeb532886874)

### Payments
![Платежи](https://github.com/user-attachments/assets/371c2b62-59e4-4555-83ec-fc7d0dd3b989)

### Stream
<img width="1356" height="884" alt="image" src="https://github.com/user-attachments/assets/a4209134-7bb4-4880-bdd0-d2057d3ac707" />


## License
MIT License. Feel free to use/fork.
