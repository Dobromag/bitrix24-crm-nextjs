"use client";

import Header from "@/components/Header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main style={{ padding: "24px" }}>{children}</main>
    </QueryClientProvider>
  );
}
