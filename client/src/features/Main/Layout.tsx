import { FC, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { TCreateNote, TNote } from "@/types";
import { HTTPAddNote } from "@/api/http";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { queryClient } from "@/App";
import { useToastTimer } from "../utils/useToastTimer";
import ErrorBanner from "@/components/ErrorBanner";
import { AnimatePresence } from "framer-motion";

export type TError = {
  create: string | null;
  update: string | null;
  delete: string | null;
};
const Layout: FC = () => {
  const [newNoteId, setNewNoteID] = useState<TNote["id"]>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<TError>({
    create: null,
    update: null,
    delete: null,
  });
  /*   useEffect(() => {
    console.log("error", error);
    const timer = setTimeout(() => {
      setError({ create: null, update: null, delete: null });
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]); */

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { mutate: createMutation } = useMutation(
    ({ description, status }: TCreateNote) =>
      HTTPAddNote({ description, status }),
    {
      onSuccess: (response: AxiosResponse<TNote>) => {
        setNewNoteID(response.data.id);
        queryClient.invalidateQueries("notes");
        console.log("Note added", response.data);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data.message || error.message;
        setError((prev) => {
          return { ...prev, create: errorMessage };
        });
        console.error("Error adding note", errorMessage);
      },
    }
  );

  // Toast error message on create note
  useToastTimer({
    duration: 2000,
    callback: setError,
    resetValue: { create: null, update: null, delete: null },
  });
  return (
    <div className="container relative flex min-h-screen mx-auto xl:my-10 rounded-2xl bg-white">
      <Sidebar createMutation={createMutation} />
      <main className="relative flex flex-col w-full">
        <Navbar setSearch={setSearch} />
        <Outlet
          context={{
            newNoteId,
            setNewNoteID,
            isMobile,
            search,
            setError,
          }}
        />
      </main>
      <div className="absolute w-full flex justify-center">
        <AnimatePresence>
          {(error.create || error.update || error.delete) && (
            <ErrorBanner
              message={error.create || error.update || error.delete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Layout;
