import { z } from "zod";

const filterSchema = z.object({
  dosageForm: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional(),
});

export default filterSchema;
