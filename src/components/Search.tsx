"use client";

import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import SearchedUser from "./SearchedUser";
import { debounce } from "lodash";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import { User } from "@/models/user.model";
import SearchedUserSkeleton from "./SearchedUserSkeleton";
import toast from "react-hot-toast";

const Search = () => {
  const [state, setState] = useState({
    searchQuery: "",
    searchResults: [],
    searchLoading: false,
  });

  const { info } = useAppSelector((state) => state.user);

  const searchUser = useCallback(async () => {
    try {
      const response = await axios.get(`/api/search?q=${state.searchQuery}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        setState((prevState) => ({
          ...prevState,
          searchResults: response.data.data,
        }));
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setState((prevState) => ({ ...prevState, searchLoading: false }));
    }
  }, [state.searchQuery]);

  const debouncedSearch = useMemo(
    () => debounce(searchUser, 400),
    [searchUser]
  );

  useEffect(() => {
    if (!state.searchQuery.trim()) {
      setState((prevState) => ({
        ...prevState,
        searchLoading: false,
        searchResults: [],
      }));
      return;
    }

    setState((prevState) => ({ ...prevState, searchLoading: true }));
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [state.searchQuery, debouncedSearch]);

  return (
    <div className="relative w-full sm:max-w-[55%] xl:max-w-[90%] flex-1">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users"
        className="pl-9 h-9 w-full"
        onChange={(e) =>
          setState((prevState) => ({
            ...prevState,
            searchQuery: e.target.value,
          }))
        }
      />

      <div className="lg:pr-4">
        {state.searchLoading ? (
          <div className="mt-4 lg:mt-6 flex flex-col">
            <SearchedUserSkeleton />
            <SearchedUserSkeleton />
            <SearchedUserSkeleton />
          </div>
        ) : state.searchResults.length === 0 ? (
          state.searchQuery.trim() !== "" &&
          !state.searchLoading && (
            <p className="mt-4 lg:mt-6 text-slate-500 text-center">
              No users found for{" "}
              <span className="font-bold">{state.searchQuery}</span>
            </p>
          )
        ) : (
          <ScrollArea className=" mt-2 lg:mt-6 lg:mb-8 h-[200px] md:h-[250px] xl:h-[600px] w-full">
            {state.searchResults.map((user: User) => (
              <SearchedUser key={user._id} user={user} currentUser={info} />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Search;
