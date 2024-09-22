import React from "react";
import { Skeleton } from "./ui/skeleton";

const InvitationCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="mb-2 w-28 h-4" />
          <Skeleton className="w-36 h-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-16 h-9" />
        <Skeleton className="w-16 h-9" />
      </div>
    </div>
  );
};

export default InvitationCardSkeleton;
