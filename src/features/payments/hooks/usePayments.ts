// src/features/payments/hooks/usePayments.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayments } from "../server/getPayments";
import { payInvoice } from "../server/payInvoice";
import type { Payment } from "../types";

export const usePayments = () => {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: getPayments,
    refetchOnWindowFocus: true,
  });

  const payMutation = useMutation({
    mutationFn: payInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  return {
    payments,
    isLoading,
    payInvoice: payMutation.mutateAsync,
    isPaying: payMutation.isPending,
  };
};
