import { HTTPDeleteNote, HTTPGetNotes, HTTPUpdateNote } from "@/api/http";
import { TNote, TUpdateNote } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, StarIcon, TrashIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CATEGORIES, colors } from "@/constants";
import Dot from "@/components/Dot";
import { useFilterNotes } from "../../utils/useFilterNotes";
import { TError } from "../Layout";
import useUpdateMutation from "@/api/useUpdateMutation";
import useDeleteMutation from "@/api/useDeleteMutation";
import EditMenu from "./NoteEditMenu";
import Note from "./Note";
import SkeletonLoader from "./SkeletonLoader";
import NotesGrid from "./NotesGrid";

type OutletProps = {
  newNoteID: TNote["id"];
  isMobile: boolean;
  search: string;
  createError: AxiosError<{ message: string }> | null;
  setError: Dispatch<SetStateAction<TError>>;
};

const TodoManager: FC = () => {
  const { search, newNoteID } = useOutletContext<OutletProps>();
  const {
    data: notes,
    error: getNotesError,
    isLoading: getNotesLoading,
  } = useQuery<TNote[], AxiosError<{ message: string }>>({
    queryKey: "notes",
    queryFn: HTTPGetNotes,
  });

  let component;
  if (getNotesLoading) {
    component = <SkeletonLoader />;
  } else if (notes) {
    component = (
      <NotesGrid notes={notes} search={search} newNoteID={newNoteID} />
    );
  } else if (getNotesError) {
    component = (
      <p>{getNotesError.response?.data.message || getNotesError.message}</p>
    );
  }

  return (
    <section className="flex flex-col p-10">
      <h1>Notes</h1>
      {component}
    </section>
  );
};
export default TodoManager;
