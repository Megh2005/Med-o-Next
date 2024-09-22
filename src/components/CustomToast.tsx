import toast, { Toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";

const CustomToast = ({
  user,
  t,
  primaryMessage,
}: {
  t: Toast;
  user: any;
  primaryMessage: string;
}) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.displayName}
            </p>
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
              {primaryMessage}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
