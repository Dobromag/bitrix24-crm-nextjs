// src/app/(protected)/payments/page.tsx
import { PaymentsPage } from "@/features/payments";

export const metadata = {
  title: "Платежи",
};

export default function PaymentsRoute() {
  return <PaymentsPage />;
}
