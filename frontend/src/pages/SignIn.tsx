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
import toast from "react-hot-toast";
import { useState } from "react";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";  // Import Eye and EyeOff icons
import signinSchema from "@/lib/schemas/signin.schema";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";

const Signin = () => {
  const [submitting, setSubmiting] = useState(false);  // State to manage the submitting status
  const [showPassword, setShowPassword] = useState(false);   // State for managing password visibility
  const router = useNavigate();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signinSchema>) {
    try {
      setSubmiting(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/login`,
        data
      );
      if (response.data?.success) {
        toast.success("Logged in successfully!", {
          duration: 4000,
          position: "top-center",
        });

        localStorage.setItem("med-o-shop-token", response.data.data.token);

        router("/u/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error logging in", {
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
    <div className="flex min-h-[100dvh] justify-center items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Sign in to your account</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"} // Toggle input type based on state
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button" // Button to toggle password visibility
                        onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {/* Conditional rendering of eye icon based on visibility state */}
                        {showPassword ? <EyeOff /> : <Eye />} 
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting && (
                <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
              )}
              Submit
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground">
          New to Med-o-Next?{" "}
          <Link className="text-primary font-medium" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
