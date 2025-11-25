import { useCurrentUser } from "@/features/orders/hooks/useCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../server/getOrders";
import { repeatOrder } from "../server/repeatOrder";
import type { Deal } from "../types";

export const useOrders = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const { data: orders = [], isLoading } = useQuery<Deal[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const repeatMutation = useMutation({
    mutationFn: (dealId: string) => {
      if (!user?.bitrix_contact_id) throw new Error("No contact ID");
      return repeatOrder({ dealId, contactId: user.bitrix_contact_id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders,
    isLoading,
    repeatOrder: repeatMutation.mutateAsync,
    isRepeating: repeatMutation.isPending,
  };
};
