import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/16/solid";
import { TNote } from "@/types";
import { colors } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import useUpdateMutation from "@/api/useUpdateMutation";
import useDeleteMutation from "@/api/useDeleteMutation";
import EditMenu from "./NoteEditMenu";
import { useNotes } from "@/store/notesContext";

type NoteProps = {
  note: TNote;
};
const Note: FC<NoteProps> = ({ note }) => {
  const { isMobile, newNoteID } = useNotes();
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: number;
    description: string;
  } | null>(null);

  const [description, setDescription] = useState(note.description);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // Mutations
  const { updateMutate, isUpdateLoading } = useUpdateMutation();
  const { deleteMutate, isDeleteLoading } = useDeleteMutation();

  useEffect(() => {
    if (note.id === newNoteID) {
      noteRef.current?.focus();
    }
  }, [newNoteID]);

  useEffect(() => {
    if (pendingUpdate) {
      const handler = setTimeout(() => {
        updateMutate(pendingUpdate); // Only send one request after user stops typing
      }, 500); // Adjust delay as needed

      return () => clearTimeout(handler);
    }
  }, [pendingUpdate]);

  const color = colors[note.status as keyof typeof colors];

  const handleFavoriteToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateMutate({ id: note.id, isfavourite: !note.isfavourite });
  };
  const handleOnBlur = () => {
    if (description !== note.description) {
      setPendingUpdate({ id: note.id, description });
    }
  };
  return (
    <motion.div
      key={note.id}
      id={note.id.toString()}
      layout
      className={`relative flex flex-col h-40 rounded-2xl p-4 w-full ${color}`}
      initial={note.isNew ? { x: -100, opacity: 0 } : { x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="absolute right-4 top-4 rounded-full p-2 bg-black"
        onClick={handleFavoriteToggle}
      >
        <StarIcon
          className={`w-5 h-5 ${note.isfavourite ? "text-yellow-300" : ""}`}
        />
      </button>
      {(note.isNew || isUpdateLoading || isDeleteLoading) && (
        <LoadingSpinner diameter={4} />
      )}

      <textarea
        name="note"
        ref={noteRef}
        className="w-full pr-7  h-full bg-transparent outline-none resize-none  "
        value={description}
        onBlur={handleOnBlur}
        onChange={(e) => setDescription(e.target.value)}
        disabled={note.isNew || isUpdateLoading || isDeleteLoading}
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
