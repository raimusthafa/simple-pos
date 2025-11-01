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
import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { useFormContext } from "react-hook-form"
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { data: categories } = api.category.getCategories.useQuery();
    const { mutateAsync: createImageSignedUrl } = api.product.createProductImageUploadSignedUrl.useMutation();

    useEffect(() => {
        if (defaultImageUrl) {
            setIsImageLoading(true);
            setPreviewUrl(null);
        }
    }, [defaultImageUrl]);

    const uploadImage = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        setIsUploading(true);
        try {
            const localPreview = URL.createObjectURL(file);
            setPreviewUrl(localPreview);

            const { token, path } = await createImageSignedUrl();
            const imageUrl = await uploadFileToSignedUrl({
                bucket: Bucket.ProductImages,
                file,
                path,
                token,
            });

            setUploadedImageUrl(imageUrl);
            onChangeImageUrl(imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload image");
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files?.length > 0) {
            const file = files[0];
            if (file) {
                await uploadImage(file);
            }
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file) {
                await uploadImage(file);
            }
        }
    };

    const handleRemoveImage = () => {
        setUploadedImageUrl(null);
        setPreviewUrl(null);
        onChangeImageUrl("");
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
        
        {(previewUrl || uploadedImageUrl || defaultImageUrl) ? (
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
            {isImageLoading && !previewUrl && (
              <Skeleton className="absolute inset-0"/>
            )}
            <img
              src={previewUrl || uploadedImageUrl || defaultImageUrl}
              alt="Product preview"
              className={`object-cover w-full h-full ${isImageLoading && !previewUrl ? 'invisible' : 'visible'}`}
              onLoad={() => setIsImageLoading(false)}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Spinner className="h-8 w-8 text-white" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative h-48 w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Upload className={`h-12 w-12 mb-2 ${isDragging ? 'text-primary' : ''}`} />
              <p className="text-sm font-medium">
                {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Spinner className="h-8 w-8" />
              </div>
            )}
          </div>
        )}
      </div>
      {submitButton}
        </form>
    )
}