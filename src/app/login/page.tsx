"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/services/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

type User = {
  _id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setLoading(true);
        const user = result.user;

        await saveUserToDB({
          _id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Error signin in. Please try again", {
          duration: 4000,
          position: "top-center",
        });
      });
  };

  async function saveUserToDB(user: User) {
    const response = await axios.post("/api/login", {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });

    if (response.data?.success) {
      localStorage.setItem("token", response.data?.data.token);
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1 mt-[30%] sm:mt-[20%] lg:mt-0">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="space-y-2 text-center">
                <h1 className="text-primary text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Med-o-Chat
                </h1>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Type locally, converse globally
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                  Overcome language barriers and connect with people from around
                  the world in real-time with the power of AI.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  onClick={signInWithGoogle}
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin w-5 h-5 text-white" />
                  ) : (
                    <>
                      <ChromeIcon className="mr-2 h-4 w-4" />
                      Sign in with Google
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs capitalize text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Tech Janta Party. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

function ChromeIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
