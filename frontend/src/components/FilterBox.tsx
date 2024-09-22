import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import filterSchema from "@/lib/schemas/filter.schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { handleSearch } from "@/utils/searchRequest";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchLoading,
  setSearchResults,
} from "@/lib/redux/slices/searchSlice";
import { setFilter } from "@/lib/redux/slices/filterSlice";
import { RootState } from "@/lib/interfaces/RootState";

const FilterBox = ({ search }: { search: string | null }) => {
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      dosageForm: "",
      sortBy: "",
      sortOrder: "",
      inStock: false,
      category: "",
    },
  });

  const { filter } = useSelector((state: RootState) => state.filter);

  const dispatch = useDispatch();

  async function onSubmit(data: z.infer<typeof filterSchema>) {
    dispatch(setSearchLoading(true));
    dispatch(setFilter(data));
    const res = await handleSearch({ ...data, search });
    if (res) {
      dispatch(setSearchResults(res));
      dispatch(setSearchLoading(false));
    }
  }

  return (
    <Card>
      <CardHeader className="text-lg">Filters</CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="dosageForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage form</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={filter.dosageForm || field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="capsule">Capsule</SelectItem>
                            <SelectItem value="syrup">Syrup</SelectItem>
                            <SelectItem value="injection">Injection</SelectItem>
                            <SelectItem value="ointment">Ointment</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={filter.category || field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="analgesics">Analgesics</SelectItem>
                          <SelectItem value="antibiotics">
                            Antibiotics
                          </SelectItem>
                          <SelectItem value="antidepressants">
                            Antidepressants
                          </SelectItem>
                          <SelectItem value="antihistamines">
                            Antihistamines
                          </SelectItem>
                          <SelectItem value="vitamins">Vitamins</SelectItem>
                          <SelectItem value="woman-hygiene">
                            Woman Hygiene
                          </SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort by</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={filter.sortBy || field.value}
                      >
                        <SelectTrigger id="sort-by" className="w-[180px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="expiryDate">
                              Expiry Date
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <RadioGroup
                        defaultValue={filter.sortOrder || field.value}
                        onValueChange={field.onChange}
                        id="sort-order"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="r1" />
                          <Label htmlFor="r1">Asc</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="-1" id="r2" />
                          <Label htmlFor="r2">Desc</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="in-stock"
                      />
                      <label
                        htmlFor="in-stock"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In stock
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Apply</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FilterBox;
