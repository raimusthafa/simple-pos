import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toRupiah } from "@/utils/toRupiah";
import { StatusOrder } from "@prisma/client";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    status: StatusOrder;
    createdAt: Date;
    updatedAt: Date;
    grandtotal: number;
    items: OrderItem[];
  } | null;
  isLoading?: boolean;
}

export const OrderDetailsSheet = ({
  isOpen,
  onClose,
  order,
  isLoading = false,
}: OrderDetailsSheetProps) => {

  const getBadgeColor = (status: StatusOrder) => {
    switch (status) {
      case StatusOrder.AWAITING_PAYMENT:
        return "bg-yellow-100 text-yellow-800";
      case StatusOrder.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case StatusOrder.DONE:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6">
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>View the complete order information</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !order ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">Failed to load order details</p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Order Summary
                </h3>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Order ID:</span>
                    <span className="font-mono text-sm">{order.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Created:</span>
                    <span className="text-sm">
                      {format(order.createdAt, "PPp")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated:</span>
                    <span className="text-sm">
                      {format(order.updatedAt, "PPp")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {toRupiah(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{toRupiah(item.subtotal)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">{toRupiah(order.grandtotal)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Button className="w-full" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};