import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { productFormSchema } from "@/forms/product";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductForm } from "./ProductForm";

interface EditProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
}

export const EditProductSheet = ({ open, onOpenChange, productId }: EditProductSheetProps) => {
  const utils = api.useUtils();

  const form = useForm<productFormSchema>({
    resolver: zodResolver(productFormSchema),
  });

  // Get product details
  const { data: product } = api.product.getProductById.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );

  // Update mutation
  const { mutate: updateProduct, isPending: isUpdating } = api.product.updateProduct.useMutation({
    onSuccess: async () => {
      toast.success("Product updated successfully");
      await utils.product.getproduct.invalidate();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Set form values when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
      });
    }
  }, [product, form]);

  const onSubmit = (values: productFormSchema) => {
    if (!productId) return;

    updateProduct({
      id: productId,
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      // If there's a new image uploaded, use it, otherwise keep existing
      imageUrl: form.getValues("imageUrl") || product?.imageUrl || undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <Form {...form}>
            <ProductForm
              onSubmit={onSubmit}
              onChangeImageUrl={(imageUrl) => {
                form.setValue("imageUrl", imageUrl);
              }}
              defaultImageUrl={product?.imageUrl || undefined}
              submitButton={
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUpdating}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isUpdating ? "Updating..." : "Update Product"}
                </Button>
              }
            />
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};