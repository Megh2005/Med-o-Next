"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { setUserInfoLoading } from "@/lib/features/user/userConfig";
import UserInfoSkeleton from "./UserInfoSkeleton";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import toast from "react-hot-toast";

const UserInfo = () => {
  const { info } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.userConfig);
  const dispatcher = useAppDispatch();

  useEffect(() => {
    if (info) dispatcher(setUserInfoLoading(false));
  }, [info]);

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully", {
          duration: 3000,
          position: "top-center",
        });
      })
      .catch((error) => {
        toast.error("Error logging out", {
          duration: 3000,
          position: "top-center",
        });
      });
  };

  return loading ? (
    <UserInfoSkeleton />
  ) : (
    <div className="flex flex-col gap-4 justify-end xl:flex-row xl:gap-0 lg:justify-between xl:items-center xl:w-full">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={info?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="">
          <p className="text-xs font-light">Currently logged in as</p>
          <p className="text-base font-medium">{info?.displayName}</p>
        </div>
      </div>
      <div onClick={handleSignOut} className="flex gap-4 cursor-pointer">
        <div className="xl:hidden">
          <p className="text-lg font-medium">Logout</p>
        </div>
        <LogOut />
      </div>
    </div>
  );
};

export default UserInfo;
