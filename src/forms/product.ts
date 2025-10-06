import { z } from 'zod'

export const productFormSchema = z.object({
    name: z.string().min(3).max(30),
    price: z.coerce.number().min(1000),
    categoryId: z.string(),
    imageUrl: z.string().optional()
})

export type productFormSchema = z.infer<typeof productFormSchema>;