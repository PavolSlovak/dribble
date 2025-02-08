import { FC, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

import { useToastTimer } from "../utils/useToastTimer";
import ErrorBanner from "@/components/ErrorBanner";
import { AnimatePresence } from "framer-motion";
import useCreateMutation from "@/api/useCreateMutation";
import { useNotes } from "@/store/notesContext";

export type TError = {
  create: string | null;
  update: string | null;
  delete: string | null;
};
const Layout: FC = () => {
  const { setIsMobile, setSearch, setError, error } = useNotes();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { createMutation, createLoading } = useCreateMutation();
  // Toast error message on create note
  useToastTimer({
    duration: 2000,
    callback: setError,
    resetValue: { create: null, update: null, delete: null },
  });
  return (
    <div className="container relative flex min-h-screen mx-auto xl:my-10 rounded-2xl bg-white">
      <Sidebar createMutation={createMutation} createLoading={createLoading} />
      <main className="relative flex flex-col w-full">
        <Navbar setSearch={setSearch} />
        <Outlet context={{ createLoading }} />
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
