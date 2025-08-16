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
import { api } from "@/utils/api";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/shared/product/ProductForm";
import { Form } from "@/components/ui/form";
import { productFormSchema } from "@/forms/product";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const ProductsPage: NextPageWithLayout = () => {

  const apiUtils = api.useUtils();

  const [uploadImage, setUploadImage] = useState <string| null> (null);
  const [createProductDIalodOpen, setCreateProductDIalodOpen] = useState(false);

  const { data: products, isLoading } = api.product.getproduct.useQuery();

  const { mutate: createProduct } = api.product.createProduct.useMutation({
    onSuccess: async () => {
      toast.success("succesfully create new product");
      await apiUtils.product.getproduct.invalidate();
      setCreateProductDIalodOpen(false);
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
          open={createProductDIalodOpen} 
          onOpenChange={setCreateProductDIalodOpen}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => {
            return <ProductCatalogCard
            key ={product.id}
            name={product.name}
            price={product.price}
            image={product.imageUrl ?? ""}
            category={product.category.name}

            />;
          })}
      </div>
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
