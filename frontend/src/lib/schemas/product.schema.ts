import { z } from "zod";

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const productSchema = z
  .object({
    name: z.string(),
    genericName: z.string(),
    manufacturer: z.string(),
    description: z.string(),
    category: z.string(),
    dosageForm: z.string(),
    strength: z.string(),
    packSize: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "packSize must be a valid number",
      }),
    price: z.string(),
    prescriptionRequired: z.boolean().optional(),
    stock: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "stock must be a valid number",
      }),
    expiryDate: z.date(),
    manufacturedDate: z.date(),
    batchNumber: z.string(),
    activeIngredients: z.string(),
    instructions: z.string(),
    image:
      typeof window === "undefined"
        ? z.any()
        : z
            .instanceof(FileList)
            .refine((file) => file?.length == 1, "Image is required.")
            .refine(
              (files) => {
                const file = files.item(0);
                if (!file) return false;

                return file?.size <= MAX_FILE_SIZE;
              },
              {
                message: `Image size should be less than ${
                  MAX_FILE_SIZE / 1000000
                }MB.`,
              }
            )
            .refine(
              (files) => {
                const file = files.item(0);
                if (!file) return false;

                return ACCEPTED_IMAGE_TYPES.includes(file?.type);
              },
              { message: "Only JPEG, JPG, and PNG images are allowed." }
            ),
  })
  .refine((data) => data.expiryDate >= data.manufacturedDate, {
    message: "Expiry date should be greater than manufactured date",
    path: ["expiryDate"],
  });

export const updateProductSchema = z
  .object({
    name: z.string(),
    genericName: z.string(),
    manufacturer: z.string(),
    description: z.string(),
    category: z.string(),
    dosageForm: z.string(),
    strength: z.string(),
    packSize: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "packSize must be a valid number",
      }),
    price: z.string(),
    prescriptionRequired: z.boolean().optional(),
    stock: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), {
        message: "stock must be a valid number",
      }),
    expiryDate: z.date(),
    manufacturedDate: z.date(),
    batchNumber: z.string(),
    activeIngredients: z.string(),
    instructions: z.string(),
    image:
      typeof window === "undefined"
        ? z.any().optional()
        : z
            .instanceof(FileList)
            .optional()
            .refine(
              (files) => {
                if (!files) return true;
                const file = files.item(0);
                return file ? file.size <= MAX_FILE_SIZE : true;
              },
              {
                message: `Image size should be less than ${
                  MAX_FILE_SIZE / 1000000
                }MB.`,
              }
            )
            .refine(
              (files) => {
                if (!files) return true;
                const file = files.item(0);
                return file ? ACCEPTED_IMAGE_TYPES.includes(file.type) : true;
              },
              { message: "Only JPEG, JPG, and PNG images are allowed." }
            ),
  })
  .refine((data) => data.expiryDate >= data.manufacturedDate, {
    message: "Expiry date should be greater than manufactured date",
    path: ["expiryDate"],
  });
