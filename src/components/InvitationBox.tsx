"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvitationCard from "@/components/InvitationCard";
import { Mail } from "lucide-react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";
import {
  addInvitation,
  CustomInvitation,
  deleteInvitation,
  setInvitations,
} from "@/lib/features/invitation/invitationSlice";
import {
  setHasMoreInvitations,
  setInvitationLoading,
} from "@/lib/features/invitation/invitationConfigSlice";
import { pusherClient } from "@/lib/pusher";
import InvitationCardSkeleton from "./InvitationCardSkeleton";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";
import { ScrollArea } from "./ui/scroll-area";

const InvitationBox = () => {
  const invitation = useAppSelector((state) => state.invitation);
  const { hasMoreInvitations, invitationLoading } = useAppSelector(
    (state) => state.invitationConfig
  );
  const { info } = useAppSelector((state) => state.user);
  const dispatcher = useAppDispatch();

  const getAllInvitations = useCallback(async () => {
    try {
      const response = await axios.get(`/api/invitations`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        dispatcher(setInvitations(response.data.data));
        dispatcher(setHasMoreInvitations(false));
      }
    } catch (error) {
      toast.error("Error getting invitations", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      dispatcher(setInvitationLoading(false));
    }
  }, [dispatcher]);

  useEffect(() => {
    if (!info) return;
    pusherClient.subscribe(`invitations-${info.uid}`);
    pusherClient.subscribe(`cancel-invitation-${info.uid}`);

    const handleNewInvitations = async (newInvitation: CustomInvitation) => {
      dispatcher(addInvitation(newInvitation));
      const sender = newInvitation.sender;
      toast.custom((t) => (
        <CustomToast
          t={t}
          user={sender}
          primaryMessage="sent you an invitation"
        />
      ));
    };

    const handleInvitationCancel = async (
      deletedInvitation: CustomInvitation
    ) => {
      console.log("Cancelling invite");
      dispatcher(deleteInvitation(deletedInvitation._id));
    };

    pusherClient.bind("cancel-invitation", handleInvitationCancel);
    pusherClient.bind("new-invitation", handleNewInvitations);

    return () => {
      pusherClient.unsubscribe(`invitations-${info?.uid}`);
      pusherClient.unbind("new-invitation", handleNewInvitations);
      pusherClient.unsubscribe(`cancel-invitation-${info?.uid}`);
      pusherClient.unbind("cancel-invitation", handleInvitationCancel);
    };
  }, [info, dispatcher]);

  useEffect(() => {
    if (!info) return;
    if (!hasMoreInvitations) return;
    getAllInvitations();
  }, [info, getAllInvitations, hasMoreInvitations]);

  return (
    <div>
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-xl flex gap-3 items-center justify-center">
            <span>Your Invitations</span>
            <Mail className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col pb-2 gap-6">
          {invitationLoading ? (
            <>
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
            </>
          ) : (
            <ScrollArea
              className={`${
                Object.entries(invitation.invitations).length > 0
                  ? "h-[160px] w-full"
                  : "h-[40px]"
              }`}
            >
              <div className="flex flex-col gap-6 w-full h-full">
                {Object.entries(invitation.invitations).length > 0 ? (
                  Object.entries(invitation.invitations).map(
                    ([, invitation]) => {
                      return (
                        <InvitationCard
                          invitation={invitation}
                          key={invitation?._id as string}
                        />
                      );
                    }
                  )
                ) : (
                  <p className="text-slate-500 text-sm text-center">
                    No invitations
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationBox;
