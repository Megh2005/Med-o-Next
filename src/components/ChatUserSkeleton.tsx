import React from "react";
import { Skeleton } from "./ui/skeleton";

const ChatUserSkeleton = () => {
  return (
    <div className="w-full my-6 flex justify-between items-center gap-3">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
        <Skeleton className="w-full h-5 lg:w-80 lg:h-6" />
      </div>
    </div>
  );
};

export default ChatUserSkeleton;
