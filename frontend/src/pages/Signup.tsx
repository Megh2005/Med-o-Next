import signupSchema from "@/lib/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/utils/constants";

const Signup = () => {
  const [submiting, setSubmiting] = useState(false);
  const router = useNavigate();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    try {
      setSubmiting(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/signup`,
        data
      );
      if (response.data?.success) {
        toast.success("Account created successfully!", {
          duration: 4000,
          position: "top-center",
        });

        router("/signin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error creating Account", {
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
      setSubmiting(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col w-full max-w-[900px] items-center justify-between gap-12 rounded-xl bg-card p-6 shadow-lg md:flex-row">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Sign up for <p className="text-primary">Med-o-Shop</p>
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Discover a wide range of high-quality products and healthcare
            products delivered right to your doorstep.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-primary" />
              Fast and reliable delivery
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-primary" />
              Secure and confidential transactions
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-primary" />
              Wide selection of products and healthcare products
            </li>
          </ul>
        </div>
        <div className="w-full max-w-md space-y-4 rounded-lg bg-background p-6 shadow-lg">
          <h2 className="text-2xl font-bold">Create an account</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter the password again"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submiting}>
                {submiting && (
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                )}
                Submit
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium" to="/signin">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default Signup;
