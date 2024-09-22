"use client";

import Loader from "@/components/Loader";

export default function LoadingPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader dimensions="w-4 h-4 lg:w-5 lg:h-5" />
        <p className="text-sm lg:text-base text-center font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
