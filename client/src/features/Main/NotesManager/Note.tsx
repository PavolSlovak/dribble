import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/16/solid";
import { TNote } from "@/types";
import { useOutletContext } from "react-router-dom";
import { colors } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import useUpdateMutation from "@/api/useUpdateMutation";
import useDeleteMutation from "@/api/useDeleteMutation";
import EditMenu from "./NoteEditMenu";
import { useNotes } from "@/store/notesContext";
import useCreateMutation from "@/api/useCreateMutation";

type NoteProps = {
  note: TNote;
  isNewNote: boolean;
};
const Note: FC<NoteProps> = ({ note, isNewNote }) => {
  const { setError, isMobile } = useNotes();

  const [description, setDescription] = useState(note.description);
  const [isfavourite, setIsFavourite] = useState(note.isfavourite);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("isNewNote", isNewNote);
    if (isNewNote) {
      noteRef.current?.focus();
    }
  }, [isNewNote]);
  // Mutation update note

  const { updateMutate, isUpdateLoading } = useUpdateMutation();
  const { deleteMutate, isDeleteLoading } = useDeleteMutation();

  const color = colors[note.status as keyof typeof colors];

  return (
    <motion.div
      key={note.id}
      layout
      className={`relative flex flex-col h-40 rounded-2xl p-4 w-full ${color}`}
      initial={note.isNew ? { x: -100, opacity: 0 } : { x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
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
            deleteMutate={() => deleteMutate({ id: note.id })}
          />
        </span>
      </div>
    </motion.div>
  );
};

export default Note;
