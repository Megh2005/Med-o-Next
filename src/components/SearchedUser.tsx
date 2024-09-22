import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/models/user.model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { UserInfo } from "@/lib/features/user/userSlice";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const SearchedUser = ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: UserInfo | null;
}) => {
  const [inviteStatus, setInviteStatus] = useState<string>("");

  useEffect(() => {
    if (!currentUser || !user) return;

    const checkInvitationStatus = async () => {
      try {
        const response = await axios.get(
          `/api/check-invitation?recipient=${user._id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.success) {
          setInviteStatus(response.data.data?.inviteStatus as string);
        }
      } catch (error: any) {}
    };

    checkInvitationStatus();
  }, [currentUser, user]);

  const sendInvitation = async () => {
    // send invitation to the user
    try {
      const response = await axios.post(
        "/api/invitations",
        {
          sender: currentUser?.uid,
          recipient: user._id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        setInviteStatus("pending");
        console.log("Invitation sent");
      }
    } catch (error) {
      toast.error("Error sending invitation", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const cancelInvitation = async () => {
    try {
      const response = await axios.post(
        "/api/cancel-invitation",
        {
          sender: currentUser?.uid,
          recipient: user._id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        setInviteStatus("unsent");
      }
    } catch (error) {
      toast.error("Error canceling invitation", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const inviteActions = useMemo(() => {
    switch (inviteStatus) {
      case "pending":
        return { actionText: "Cancel", actionFunction: cancelInvitation };
      case "accepted":
        return { actionText: "Accepted", actionFunction: undefined };
      default:
        return { actionText: "Invite", actionFunction: sendInvitation };
    }
  }, [inviteStatus]);

  if (!inviteStatus || !currentUser || !user) return null;

  return (
    <div className="my-2 md:my-4 lg:my-8">
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <div className="animate-bounceIn py-2 flex justify-between items-center gap-3 cursor-pointer rounded-sm">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback>
                  <UserRound />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="text-base font-medium">{user?.displayName}</p>
                <p className="text-xs font-light">{user?.email}</p>
              </div>
            </div>
            <div className="">
              <span
                className={`text-sm font-medium ${
                  inviteStatus === "pending"
                    ? "text-red-500"
                    : inviteStatus === "accepted"
                    ? "text-green-500"
                    : "text-primary"
                }`}
              >
                {inviteActions.actionText}
              </span>
            </div>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {inviteStatus === "pending"
                ? "Cancel Invite"
                : inviteStatus === "accepted"
                ? "Accepted"
                : "Send an Invite"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {inviteStatus === "pending"
                ? `This will cancel the invitation sent to ${user?.displayName}`
                : inviteStatus === "accepted"
                ? `${user.displayName} has already accepted the invitation`
                : `This will send an invite to ${user?.displayName} to join the conversation`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {(inviteStatus === "pending" || inviteStatus === "unsent") && (
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={inviteActions.actionFunction}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
          {inviteStatus === "accepted" && (
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SearchedUser;
