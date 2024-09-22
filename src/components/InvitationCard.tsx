import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import {
  CustomInvitation,
  deleteInvitation,
} from "@/lib/features/invitation/invitationSlice";
import toast from "react-hot-toast";

interface InvitationCardProps {
  invitation: CustomInvitation;
}

const Invitation: React.FC<InvitationCardProps> = ({ invitation }) => {
  const dispatcher = useAppDispatch();

  const acceptInvitation = async () => {
    try {
      const response = await axios.post(
        "/api/accept-invitation",
        {
          sender: invitation.sender._id,
          recipient: invitation.recipient,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        dispatcher(deleteInvitation(invitation._id));
      }
    } catch (error) {
      toast.error("Error accepting invitation", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const rejectInvitation = async () => {
    try {
      const response = await axios.post(
        "/api/reject-invitation",
        {
          sender: invitation.sender._id,
          recipient: invitation.recipient,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        dispatcher(deleteInvitation(invitation._id));
      }
    } catch (error) {
      toast.error("Error rejecting invitation", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="animate-bounceIn flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={invitation.sender?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm line-clamp-1">
            {invitation.sender?.displayName}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {invitation.sender?.email}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="p-2 md:p-4 text-xs text-primary font-bold hover:text-primary"
          variant="outline"
          size="sm"
          onClick={acceptInvitation}
        >
          Accept
        </Button>
        <Button
          className="text-xs font-bold text-red-500 hover:text-red-500"
          variant="ghost"
          size="sm"
          onClick={rejectInvitation}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default Invitation;
