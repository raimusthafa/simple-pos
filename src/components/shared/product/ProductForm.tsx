import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import type { productFormSchema } from "@/forms/product";
import { uploadFileToSignedUrl } from "@/lib/supabase";
import { Bucket } from "@/server/bucket";
import { api } from "@/utils/api";
import { useEffect, useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form"
import { toast } from "sonner";

type ProductFormProps = {
    onSubmit: (values: productFormSchema) => void;
    onChangeImageUrl: (imageUrl: string) => void;
    defaultImageUrl?: string;
    submitButton?: React.ReactNode;
}

export const ProductForm = ({ 
    onSubmit, 
    onChangeImageUrl,
    defaultImageUrl,
    submitButton 
}: ProductFormProps) => {
    const form = useFormContext<productFormSchema>();

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const { data: categories } = api.category.getCategories.useQuery();
    const { mutateAsync: createImageSignedUrl } = api.product.createProductImageUploadSignedUrl.useMutation();

    useEffect(() => {
        if (defaultImageUrl) {
            setIsImageLoading(true);
        }
    }, [defaultImageUrl]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (files && files?.length > 0) {
        const file = files[0];

        if (!file) return;

        const { token, path } = await createImageSignedUrl();
        const imageUrl = await uploadFileToSignedUrl({
          bucket: Bucket.ProductImages,
          file,
          path,
          token,
        });

        onChangeImageUrl(imageUrl);
        toast.info ("Uploaded Image!")
      }
    };  

    return(
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem> 
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
                  <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem> 
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
                  <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem> 
            <FormLabel>Category</FormLabel>
            <FormControl>
                <Select value={field.value} onValueChange={(value) => {
                  field.onChange(value);
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            categories?.map((category) => {
                                return (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                                );
                            })
                        }
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2">
        <Label>Product Image</Label>
         {isImageLoading && (
          <Skeleton className="relative h-40 w-full overflow-hidden rounded-md"/>
            )}
        {(defaultImageUrl || uploadedImageUrl) && (
          <div className="relative h-40 w-full overflow-hidden rounded-md">
            <img
              src={uploadedImageUrl || defaultImageUrl}
              alt="Product"
              className={`object-cover w-full h-full ${isImageLoading ? 'invisible' : 'visible'}`}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        )}
        <Input onChange={handleImageChange} type="file" accept="image/*"/>
      </div>
      {submitButton}
        </form>
    )
}