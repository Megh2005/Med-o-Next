"use client";

import { Separator } from "@/components/ui/separator";
import InvitationBox from "@/components/InvitationBox";
import Conversations from "@/components/Conversations";
import Search from "@/components/Search";
import UserInfo from "@/components/UserInfo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Mail, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ChatsPage = () => {
  const { info } = useAppSelector((state) => state.user);
  const { invitations } = useAppSelector((state) => state.invitation);

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-6">
      <header className="px-3 2xl:px-16 mb-2 lg:mb-8">
        <div className="flex items-center gap-4 justify-between">
          <h1 className="text-primary text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
            Med-o-Chat
          </h1>
          <Link href={"https://med-o-next-video-chat-app.vercel.app"}>
            <Button>Video Chat</Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-col xl:flex-row flex-1">
        <section className="px-3 2xl:px-16 xl:w-1/3 xl:pr-6">
          <div className="sticky top-24 flex flex-col-reverse gap-2 sm:gap-4 lg:gap-0 xl:flex-col h-full">
            <Search />
            <div className="flex items-center justify-end gap-6">
              <div className="lg:hidden">
                <Popover>
                  <PopoverTrigger>
                    <div className="relative">
                      <Mail className="w-6 h-7" />
                      {Object.entries(invitations).length > 0 && (
                        <div className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border-none mr-2 mt-2">
                    <InvitationBox />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="xl:hidden">
                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src={info?.photoURL} />
                      <AvatarFallback>
                        <UserRound />
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="mr-2 mt-2">
                    <UserInfo />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="hidden xl:inline-block">
              <UserInfo />
            </div>
          </div>
        </section>
        <section className="xl:w-2/3 flex gap-6 flex-1">
          <div className="hidden xl:inline-block">
            <Separator orientation="vertical" />
          </div>
          <div className="w-full mt-6 xl:mt-0 xl:ml-4">
            <h2 className="px-3 2xl:px-16 font-bold text-slate-500 text-2xl lg:text-3xl">
              Your conversations
            </h2>
            <div className="lg:flex lg:justify-between lg:gap-6">
              <Conversations />
              <div className="hidden lg:inline-block">
                <InvitationBox />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatsPage;
