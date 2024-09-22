import { Skeleton } from "./ui/skeleton";

const SearchedUserSkeleton = () => {
  return (
    <div className="py-2 lg:py-4 flex justify-between items-center gap-3 cursor-pointer rounded-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col items-start">
          <Skeleton className="mb-2 w-48 h-4" />
          <Skeleton className="w-40 h-2" />
        </div>
      </div>
    </div>
  );
};

export default SearchedUserSkeleton;
