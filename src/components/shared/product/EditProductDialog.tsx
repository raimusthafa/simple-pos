import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { productFormSchema } from "@/forms/product";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductForm } from "./ProductForm";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel } from "@/components/ui/alert-dialog";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
}

export const EditProductDialog = ({ open, onOpenChange, productId }: EditProductDialogProps) => {
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
      imageUrl: form.getValues("imageUrl") || (product?.imageUrl ?? undefined),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Product</AlertDialogTitle>
        </AlertDialogHeader>
        
        <Form {...form}>
          <ProductForm
            onSubmit={onSubmit}
            onChangeImageUrl={(imageUrl) => {
              form.setValue("imageUrl", imageUrl);
            }}
            defaultImageUrl={product?.imageUrl || undefined}
          />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};