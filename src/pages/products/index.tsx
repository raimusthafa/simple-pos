import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import type { NextPageWithLayout } from "../_app";
import { useState, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/mock";
import { ProductMenuCard } from "@/components/shared/product/ProductMenuCard";
import { ProductCatalogCard } from "@/components/shared/product/ProductCatalogCard";
import { ProductDetailSheet } from "@/components/shared/product/ProductDetailSheet";
import { api } from "@/utils/api";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/shared/product/ProductForm";
import { EditProductDialog } from "@/components/shared/product/EditProductDialog";
import { Form } from "@/components/ui/form";
import { productFormSchema } from "@/forms/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const ProductsPage: NextPageWithLayout = () => {
  const apiUtils = api.useUtils();

  const [uploadImage, setUploadImage] = useState <string| null> (null);
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const { data: products, isLoading } = api.product.getproduct.useQuery({
    categoryId: "all",
  });

  const { mutate: createProduct } = api.product.createProduct.useMutation({
    onSuccess: async () => {
      toast.success("Successfully created new product");
      await apiUtils.product.getproduct.invalidate();
      setCreateProductDialogOpen(false);
    }
  });

  const { mutate: deleteProduct, isPending: isDeleting } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      toast.success("Successfully deleted product");
      await apiUtils.product.getproduct.invalidate();
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const createProductForm = useForm<productFormSchema> ({
    resolver: zodResolver(productFormSchema)
  });

  const handleSubmitCreateProduct = (values: productFormSchema) => {
    if (!uploadImage){
      toast.error("Please upload image");
      return;
    }
    createProduct({
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: uploadImage,
    });
  };

  return (
    <>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Product Management</DashboardTitle>
            <DashboardDescription>
              View, add, edit, and delete products in your inventory.
            </DashboardDescription>
                {/* <Button
      variant="outline"
      onClick={() =>
        toast.success("ini testing toast !!!")
      }
    >
      Show Toast
    </Button> */}
          </div>
          <AlertDialog 
          open={createProductDialogOpen} 
          onOpenChange={setCreateProductDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button>Add New Product</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                Create Product
                </AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...createProductForm}>
                <ProductForm 
                onSubmit={handleSubmitCreateProduct}
                onChangeImageUrl={(imageUrl) => {
                  setUploadImage(imageUrl);
                }}
                />
              </Form>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={createProductForm.handleSubmit(handleSubmitCreateProduct)}>Create Product</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => {
            return <ProductCatalogCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.imageUrl ?? ""}
            category={product.category.name}
            onClick={() => {
              setSelectedProduct(product.id);
              setDetailSheetOpen(true);
            }}
            onEdit={() => {
              setSelectedProduct(product.id);
              setEditDialogOpen(true);
            }}
            onDelete={() => {
              setSelectedProduct(product.id);
              setDeleteDialogOpen(true);
            }}
            />;
          })}
      </div>

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
              onClick={() => {
                if (selectedProduct) {
                  deleteProduct({ id: selectedProduct });
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        productId={selectedProduct}
      />

      <EditProductDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        productId={selectedProduct}
      />
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
