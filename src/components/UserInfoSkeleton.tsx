import { Skeleton } from "./ui/skeleton";

const UserInfoSkeleton = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="mb-2 w-36 h-3" />
          <Skeleton className="w-40 h-4" />
        </div>
      </div>
    </div>
  );
};

export default UserInfoSkeleton;
