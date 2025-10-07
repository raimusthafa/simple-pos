import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { OrderCard } from "@/components/OrderCard";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { useState } from "react";
import { api } from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusOrder } from "@prisma/client";
import { toast } from "sonner";
import { OrderDetailsSheet } from "@/components/shared/OrderDetailsSheet";
import { toRupiah } from "@/utils/toRupiah";

const SalesPage: NextPageWithLayout = () => {
  const [filterOrder, setFilterOrder] = useState<StatusOrder | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const apiUtils = api.useUtils();

  const { data: salesReport } = api.order.getSalesReport.useQuery();

  const { data: orders } = api.order.getOrders.useQuery({
    status: filterOrder,
  });

  const { data: selectedOrder, isLoading: isLoadingDetails } = api.order.getOrderDetails.useQuery(
    { orderId: selectedOrderId! },
    { 
      enabled: !!selectedOrderId,
    }
  );

  const { mutate: finishOrder, isPending: finishOrderIsPending, variables: finishOrderVariables } = 
    api.order.finishOrder.useMutation({
      onSuccess: async () => {
        await apiUtils.order.getOrders.invalidate();
        toast.success("Order finished successfully");
      },
    });

  const handleFinishOrder = (orderId: string) => {
    finishOrder({
      orderId,
    });
  };

  const handleFilterChange = (value: StatusOrder | "ALL") => {
    setFilterOrder(value);
  }


  return (
    <>
      <DashboardHeader>
        <DashboardTitle>Sales Dashboard - {filterOrder} </DashboardTitle>
        <DashboardDescription>
          Track your sales performance and view analytics.
        </DashboardDescription>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">{toRupiah(salesReport?.totalRevenue ?? 0)}</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Ongoing Orders</h3>
          <p className="mt-2 text-3xl font-bold">{salesReport?.totalOnGoingOrders ?? 0}</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold">{salesReport?.totalCompletedOrders ?? 0}</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium mb-4">Orders</h3>
          <Select defaultValue="ALL" onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>

            <SelectContent align="end">
              <SelectItem value="ALL">ALL</SelectItem>
              {
                Object.keys(StatusOrder).map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              onFinishOrder={handleFinishOrder}
              onViewDetails={() => setSelectedOrderId(order.id)}
              id={order.id}
              status={order.status}
              totalAmount={order.grandtotal}
              totalItems={order._count.orderItems}
              isFinishingOrder={
                finishOrderIsPending && 
                order.id === finishOrderVariables.orderId}
            />
          ))}
        </div>
      </div>

      <OrderDetailsSheet
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        order={selectedOrder ?? null}
        isLoading={isLoadingDetails}
      />
    </>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesPage; 