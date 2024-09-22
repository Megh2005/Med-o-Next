"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
exports.productSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    genericName: zod_1.z.string(),
    manufacturer: zod_1.z.string(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    dosageForm: zod_1.z.string(),
    strength: zod_1.z.string(),
    packSize: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), {
        message: "packSize must be a valid number",
    }),
    price: zod_1.z.string(),
    prescriptionRequired: zod_1.z.boolean().optional(),
    stock: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), {
        message: "stock must be a valid number",
    }),
    expiryDate: zod_1.z.date(),
    manufacturedDate: zod_1.z.date(),
    batchNumber: zod_1.z.string(),
    activeIngredients: zod_1.z.string(),
    instructions: zod_1.z.string(),
    image: zod_1.z.any(),
})
    .refine((data) => data.expiryDate >= data.manufacturedDate, {
    message: "Expiry date should be greater than manufactured date",
    path: ["expiryDate"],
});
exports.updateProductSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    genericName: zod_1.z.string(),
    manufacturer: zod_1.z.string(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    dosageForm: zod_1.z.string(),
    strength: zod_1.z.string(),
    packSize: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), {
        message: "packSize must be a valid number",
    }),
    price: zod_1.z.string(),
    prescriptionRequired: zod_1.z.boolean().optional(),
    stock: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), {
        message: "stock must be a valid number",
    }),
    expiryDate: zod_1.z.date(),
    manufacturedDate: zod_1.z.date(),
    batchNumber: zod_1.z.string(),
    activeIngredients: zod_1.z.string(),
    instructions: zod_1.z.string(),
    image: zod_1.z.any().optional(),
})
    .refine((data) => data.expiryDate >= data.manufacturedDate, {
    message: "Expiry date should be greater than manufactured date",
    path: ["expiryDate"],
});
