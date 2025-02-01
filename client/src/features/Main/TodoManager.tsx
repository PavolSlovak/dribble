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
import { useMutation, useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon, StarIcon, TrashIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CATEGORIES, colors } from "@/constants";
import Dot from "@/components/Dot";
import { useFilterNotes } from "../utils/useFilterNotes";
import { queryClient } from "@/App";
import { TError } from "./Layout";

type OutletProps = {
  newNoteId: number;
  isMobile: boolean;
  search: string;
  createError: AxiosError<{ message: string }> | null;
  setError: Dispatch<SetStateAction<TError>>;
};

const TodoManager: FC = () => {
  const { search, newNoteId } = useOutletContext<OutletProps>();
  const {
    data: notes,
    error: getNotesError,
    isLoading: getNotesLoading,
  } = useQuery<AxiosResponse<TNote[]>, AxiosError<{ message: string }>>({
    queryKey: "notes",
    queryFn: HTTPGetNotes,
  });

  let component;
  if (getNotesLoading) {
    component = <SkeletonLoader />;
  } else if (notes) {
    component = (
      <NotesGrid notes={notes.data} search={search} newNoteId={newNoteId} />
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

type TNoteProps = {
  note: TNote;
  isNewNote: boolean;
};
const Note: FC<TNoteProps> = ({ note, isNewNote }) => {
  const { setError } = useOutletContext<OutletProps>();

  const [description, setDescription] = useState(note.description);
  const [isfavourite, setIsFavourite] = useState(note.isfavourite);
  const { isMobile } = useOutletContext<OutletProps>();
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("isNewNote", isNewNote);
    if (isNewNote) {
      noteRef.current?.focus();
    }
  }, [isNewNote]);
  // Mutation update note

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation<
    AxiosResponse<TNote>,
    AxiosError<{ message: string }>,
    TUpdateNote
  >((note: TUpdateNote) => HTTPUpdateNote(note), {
    onSuccess: (response: AxiosResponse<TNote>) => {
      queryClient.invalidateQueries("notes");
      console.log("Note updated", response.data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data.message || error.message;

      setError((prev: TError) => ({ ...prev, update: errorMessage }));
      console.error("Error updating note", errorMessage);
    },
  });
  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation<
    AxiosResponse<TNote>,
    AxiosError<{ message: string }>
  >(() => HTTPDeleteNote(note.id), {
    onSuccess: (response: AxiosResponse) => {
      queryClient.invalidateQueries("notes");
      console.log("Note deleted", response.data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data.message || error.message;
      setError((prev: TError) => {
        return { ...prev, delete: errorMessage };
      });
      console.error("Error updating note", errorMessage);
    },
  });

  const color = colors[note.status as keyof typeof colors];
  return (
    <motion.div
      key={note.id}
      layout
      className={`relative flex flex-col h-40 rounded-2xl p-4 w-full ${color}`}
      initial={isNewNote ? { x: -100, opacity: 0 } : { x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="absolute right-4 top-4 rounded-full p-2 bg-black"
        onClick={() => {
          setIsFavourite(!isfavourite);
          updateMutate({ id: note.id, isfavourite: !isfavourite });
        }}
      >
        <StarIcon
          className={`w-5 h-5 ${isfavourite ? "text-yellow-300" : ""}`}
        />
      </button>
      {(isUpdateLoading || isDeleteLoading) && <LoadingSpinner diameter={4} />}

      <textarea
        name="note"
        ref={noteRef}
        className="w-full h-full bg-transparent outline-none resize-none "
        value={description}
        onBlur={() => updateMutate({ id: note.id, description })}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="w-full">
        <span className="flex justify-between items-center">
          {!isMobile
            ? format(new Date(note.timestamp), "MMM dd, yyyy")
            : format(new Date(note.timestamp), "MMM dd")}
          <EditMenu
            note={note}
            updateMutate={updateMutate}
            deleteMutate={deleteMutate}
          />
        </span>
      </div>
    </motion.div>
  );
};
const SkeletonLoader: FC = () => {
  return (
    <div className="flex flex-wrap w-full justify-between ">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl animate-pulse bg-gray-300 
          
          "
          />
        ))}
      </div>
    </div>
  );
};
const NotesGrid: FC<{
  notes: TNote[];
  search: string;
  newNoteId: number;
}> = ({ notes, search, newNoteId }) => {
  const filteredNotes = useFilterNotes(notes, search);
  return (
    <div className="flex flex-wrap w-full justify-between ">
      {filteredNotes.length === 0 && (
        <p className="text-center w-full">No notes found</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        {filteredNotes.map((note) => (
          <Note key={note.id} note={note} isNewNote={newNoteId === note.id} />
        ))}
      </div>
    </div>
  );
};
const EditMenu: FC<{
  note: TNote;
  updateMutate: (note: TUpdateNote) => void;
  deleteMutate: () => void;
}> = ({ note, updateMutate, deleteMutate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoriesExceptCurrent = CATEGORIES.filter(
    (category) => category !== note.status
  );

  return (
    <div className="relative flex">
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="flex items-center  z-80  ">
            {categoriesExceptCurrent.map((category, index) => (
              <motion.a
                href="#"
                key={category}
                onClick={() => updateMutate({ id: note.id, status: category })}
                className="absolute flex items-center"
                initial={{ x: -10 }}
                animate={{ x: -30 * (index + 1) }}
                exit={{ x: -10 }}
              >
                <Dot category={category as keyof typeof colors} />
              </motion.a>
            ))}
            <DeleteCard
              note={note}
              deleteMutate={deleteMutate}
              categoriesExceptCurrent={categoriesExceptCurrent}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button className="rounded-full p-2 bg-black ">
        <PencilIcon
          className="w-5 h-5"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </button>
    </div>
  );
};
const DeleteCard: FC<{
  note: TNote;
  deleteMutate: (note: TUpdateNote) => void;
  categoriesExceptCurrent: string[];
}> = ({ note, deleteMutate, categoriesExceptCurrent }) => {
  return (
    <motion.a
      href="#"
      key="delete"
      onClick={(e) => {
        e.preventDefault();
        deleteMutate({ id: note.id });
      }}
      className="absolute flex items-center  rounded-full p-2"
      initial={{ x: -10 }}
      animate={{ x: -30 * (categoriesExceptCurrent.length + 1) }}
      exit={{ x: -10 }}
    >
      <TrashIcon className="w-5 h-5 text-black hover:scale-125 duration-300" />
    </motion.a>
  );
};
