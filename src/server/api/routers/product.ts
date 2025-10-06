import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseAdmin } from "@/server/supabase-admin";
import { Bucket } from "@/server/bucket";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

export const productRouter = createTRPCRouter({
  getproduct: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const whereClause: Prisma.ProductWhereInput = {};

      if (input.categoryId !== "all") {
        whereClause.categoryId = input.categoryId;
      }

    const products = await db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
    return products;
  }),
  createProduct: protectedProcedure.input(
    z.object({
      name: z.string().min(3),
      price: z.number().min(1000),
      categoryId: z.string(),
      imageUrl: z.string().url(),
    })
  ).mutation(async ({ctx, input }) => {
    const { db } = ctx;
    const newProduct = await db.product.create ({
      data: {
        name:input.name,
        price: input.price,
        category: {
          connect: {
            id: input.categoryId,
          },
        },
        imageUrl: input.imageUrl,
      }
    });
    return newProduct;
  }),

  createProductImageUploadSignedUrl: protectedProcedure.mutation( 
    async () => {
      const { data, error } = await supabaseAdmin.storage
      .from(Bucket.ProductImages)
      .createSignedUploadUrl(
        `${Date.now()}/jpeg`
      );

      if (error) {
        throw new TRPCError ({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message
        })
      }
      return data;
    }, 
  ),

  getProductById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const product = await db.product.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      return product;
    }),

  updateProduct: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(3),
      price: z.number().min(1000),
      categoryId: z.string(),
      imageUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // Check if product exists
      const existingProduct = await db.product.findUnique({
        where: { id: input.id },
        select: { imageUrl: true }
      });

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      // If there's a new image and an old one exists, delete the old one
      if (input.imageUrl && existingProduct.imageUrl && input.imageUrl !== existingProduct.imageUrl) {
        try {
          const oldPath = existingProduct.imageUrl.split("/").slice(-2).join("/");
          await supabaseAdmin.storage
            .from(Bucket.ProductImages)
            .remove([oldPath]);
        } catch (error) {
          console.error("Failed to delete old image:", error);
          // Continue with update even if image deletion fails
        }
      }

      // Update the product
      const updatedProduct = await db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          price: input.price,
          categoryId: input.categoryId,
          ...(input.imageUrl && { imageUrl: input.imageUrl }),
        },
      });

      return updatedProduct;
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // First get the product to get its image URL and check if it's in any orders
      const product = await db.product.findUnique({
        where: { id: input.id },
        select: { 
          imageUrl: true,
          orderItems: {
            select: {
              id: true
            }
          }
        }
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found"
        });
      }

      // Check if product is used in any orders
      if (product.orderItems.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete product that is part of existing orders"
        });
      }

      // Delete the product from the database
      try {
        await db.product.delete({
          where: { id: input.id }
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product. It might be referenced in existing orders."
        });
      }

      // If product had an image, delete it from storage
      if (product.imageUrl) {
        try {
          // Extract the path from the full URL
          const path = product.imageUrl.split("/").slice(-2).join("/");
          const { error } = await supabaseAdmin.storage
            .from(Bucket.ProductImages)
            .remove([path]);

          if (error) {
            console.error("Failed to delete image:", error);
            // Don't throw here, as the product is already deleted
          }
        } catch (error) {
          console.error("Failed to delete image:", error);
          // Don't throw here, as the product is already deleted
        }
      }

      return { success: true };
    }),
})