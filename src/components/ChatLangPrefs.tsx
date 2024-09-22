import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import languages from "@/utils/languages";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UserInfo } from "@/lib/features/user/userSlice";
import { UserDetailsAndPrefs } from "@/types/UserDetailsAndPrefs";
import { useMemo, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import useLangPrefsUpdate from "@/hooks/useLangPrefsUpdate";
import toast from "react-hot-toast";

const ChatLangPrefs = ({
  conversationId,
  currentUser,
}: {
  conversationId: string;
  currentUser: UserInfo | null;
}) => {
  const { conversationDetails } = useAppSelector(
    (state) => state.conversationDetails
  );

  const dispatcher = useAppDispatch();

  const { type_in_lang, receive_in_lang } = useMemo(() => {
    if (!conversationDetails[conversationId])
      return { type_in_lang: "", receive_in_lang: "" };
    return conversationDetails[conversationId].members.find(
      (member) => member._id === currentUser?.uid
    ) as UserDetailsAndPrefs;
  }, [conversationDetails]);

  const [typeInLang, setTypeInLang] = useState<string>(type_in_lang);
  const [recieveInLang, setReceiveInLang] = useState<string>(receive_in_lang);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(
        `/api/update-lang-prefs`,
        {
          chatId: conversationId,
          type_in_lang: typeInLang,
          receive_in_lang: recieveInLang,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      toast.error("Error updating preferences", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useLangPrefsUpdate({ dispatcher, conversationId });

  return (
    <div>
      <Drawer
        onClose={() => {
          setTypeInLang(type_in_lang);
          setReceiveInLang(receive_in_lang);
        }}
      >
        <DrawerTrigger asChild>
          <Settings className="w-6 h-6 cursor-pointer" />
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Language preference</DrawerTitle>
              <DrawerDescription>
                Set your preferred language for this conversation
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 flex flex-col gap-6">
              <Select
                value={typeInLang}
                defaultValue={type_in_lang}
                onValueChange={(value) => setTypeInLang(value)}
              >
                <div>
                  <label className="font-bold text-sm" htmlFor="type-in">
                    Type in
                  </label>
                  <p className="text-gray-500 text-xs">
                    *This option helps in better translation
                  </p>
                  <SelectTrigger id="type-in" className="w-full mt-2">
                    <SelectValue placeholder="Type in" />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        <SelectLabel>{lang}</SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={recieveInLang}
                defaultValue={receive_in_lang}
                onValueChange={(value) => setReceiveInLang(value.toLowerCase())}
              >
                <div>
                  <label className="font-bold text-sm" htmlFor="receive-in">
                    Receive in
                  </label>
                  <SelectTrigger id="receive-in" className="w-full mt-2">
                    <SelectValue placeholder="Receive in" />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        <SelectLabel>{lang}</SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DrawerFooter>
              <Button disabled={loading} onClick={onSubmit}>
                {loading ? (
                  <div className="flex justify-center">
                    <Loader dimensions="w-5 h-5" />
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatLangPrefs;
