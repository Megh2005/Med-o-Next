import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import addressSchema from "@/lib/schemas/address.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BACKEND_URL, STATES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { AddressData } from "@/lib/interfaces/Address";
import AddressCard from "@/components/Address";

const Billing = () => {
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    getAddresses();
  }, []);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
  });

  async function onSubmit(data: z.infer<typeof addressSchema>) {
    setSubmitting(true);

    try {
      const formData = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        pincode: data.pincode,
        state: data.state,
        city: data.city,
        houseNumber: data.houseNumber,
        street: data.street,
        landmark: data.landmark,
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/address`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data.message, {
          duration: 4000,
          position: "top-center",
        });
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

  async function getAddresses() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/address`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("med-o-shop-token")}`,
        },
      });
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleAddressClick(id: string) {
    setSelectedAddress(id);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1>Your addresses: </h1>
      <div className="my-4 flex flex-wrap">
        {addresses.map((address, index) => (
          <AddressCard
            onClickHandler={() => handleAddressClick(address._id)}
            index={index}
            address={address}
            selected={selectedAddress === address._id}
            key={address._id}
          />
        ))}
      </div>
      <Link
        to={
          selectedAddress
            ? "/u/cart/place-order?address_id=" + selectedAddress
            : "#"
        }
      >
        <Button disabled={selectedAddress ? false : true} className="my-4">
          Continue to payment
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Add a new Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(STATES).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Input placeholder="Enter city" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number</FormLabel>
                    <Input
                      placeholder="Enter house/building number"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearby Landmark</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter nearby landmark" {...field} />
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
                  Save Address
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
