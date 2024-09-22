import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/utils/constants";

interface ProductManageFormProps {
  defaultFormValues: any;
  resourceAction: "ADD" | "UPDATE";
  productId?: string;
  schema: z.ZodType<any, any>;
}

const ProductManageForm = (props: ProductManageFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const router = useNavigate();

  const form = useForm<z.infer<typeof props.schema>>({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultFormValues,
  });

  const imageRef = form.register("image");

  async function onSubmit(data: z.infer<typeof props.schema>) {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("genericName", data.genericName);
      formData.append("manufacturer", data.manufacturer);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("dosageForm", data.dosageForm);
      formData.append("strength", data.strength);
      formData.append("packSize", data.packSize);
      formData.append("price", data.price);
      formData.append(
        "prescriptionRequired",
        String(data.prescriptionRequired)
      );
      formData.append("stock", data.stock);
      formData.append("expiryDate", data.expiryDate.toISOString());
      formData.append("manufacturedDate", data.manufacturedDate.toISOString());
      formData.append("batchNumber", data.batchNumber);
      formData.append("activeIngredients", data.activeIngredients);
      formData.append("instructions", data.instructions);
      if (data.image) formData.append("image", data.image[0]);

      console.log(data.image);

      let response;

      if (props.resourceAction === "ADD") {
        response = await axios.post(
          `${BACKEND_URL}/api/v1/admin/add-product`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "med-o-shop-token"
              )}`,
            },
          }
        );
      } else if (props.resourceAction === "UPDATE") {
        response = await axios.post(
          `${BACKEND_URL}/api/v1/admin/update-product/${props.productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "med-o-shop-token"
              )}`,
            },
          }
        );
      }

      if (response?.data?.success) {
        toast.success(response?.data.message, {
          duration: 4000,
          position: "top-center",
        });

        router("/admin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message, {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("Something went wrong. Please try again", {
          duration: 4000,
          position: "top-center",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genericName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Generic Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter generic name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Enter manufacturer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Enter description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="analgesics">Analgesics</SelectItem>
                  <SelectItem value="antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="antidepressants">
                    Antidepressants
                  </SelectItem>
                  <SelectItem value="antihistamines">Antihistamines</SelectItem>
                  <SelectItem value="vitamins">Vitamins</SelectItem>
                  <SelectItem value="woman-hygiene">Woman Hygiene</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dosageForm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosage Form</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dosage form" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                  <SelectItem value="syrup">Syrup</SelectItem>
                  <SelectItem value="injection">Injection</SelectItem>
                  <SelectItem value="ointment">Ointment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strength</FormLabel>
              <FormControl>
                <Input placeholder="Enter stength" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="packSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pack Size</FormLabel>
              <FormControl>
                <Input
                  min="1"
                  type="number"
                  placeholder="Enter pack size"
                  {...field}
                />
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
                <Input placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prescriptionRequired"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-2">
                <FormLabel className="mr-2">Prescription Required</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  min="1"
                  type="number"
                  placeholder="Enter stock"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturedDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Manufactured Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter batch number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activeIngredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Ingredients</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Enter ingredients"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions for use</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Enter instructions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...imageRef}
                  accept="image/png, image/jpg, image/jpeg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-full flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting && (
              <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
            )}
            Save Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductManageForm;
