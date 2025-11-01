import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { api } from "@/utils/api";
import { toast } from "sonner";
import Image from "next/image";
import { toRupiah } from "@/utils/toRupiah";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { EditProductSheet } from "./EditProductSheet";

interface ProductDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
}

export const ProductDetailSheet = ({ open, onOpenChange, productId }: ProductDetailSheetProps) => {
  const utils = api.useUtils();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const { data: product, isLoading } = api.product.getProductById.useQuery(
    { id: productId! },
    { enabled: !!productId && open }
  );

  const { mutate: deleteProduct, isPending: isDeleting } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      toast.success("Successfully deleted product");
      await utils.product.getproduct.invalidate();
      setDeleteDialogOpen(false);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = () => {
    if (productId) {
      deleteProduct({ id: productId });
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    setTimeout(() => {
      setEditSheetOpen(true);
    }, 100);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-xl">Product Details</SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="mt-6 space-y-6">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          ) : product ? (
            <div className="mt-6 space-y-6">
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-muted shadow-sm">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold leading-tight">{product.name}</h3>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Price</p>
                  <p className="text-primary text-3xl font-bold">{toRupiah(product.price)}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Category</p>
                    <p className="text-base font-semibold">{product.category.name}</p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Product ID</p>
                    <p className="font-mono text-xs break-all text-muted-foreground">{product.id}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  size="lg"
                  onClick={handleEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  size="lg"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className="text-muted-foreground space-y-2">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Product not found</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button 
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditProductSheet 
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        productId={productId}
      />
    </>
  );
};
