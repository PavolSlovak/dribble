import { FC } from "react";
import { TNote } from "@/types";
import { useFilterNotes } from "@/features/utils/useFilterNotes";
import Note from "./Note";
import { useNotes } from "@/store/notesContext";
import { AnimatePresence } from "framer-motion";
const NotesGrid: FC<{
  notes: TNote[];
}> = ({ notes }) => {
  const { search, newNoteID } = useNotes();
  const filteredNotes = useFilterNotes(notes, search);
  return (
    <div className="flex flex-wrap w-full justify-between ">
      {filteredNotes.length === 0 && (
        <p className="text-center w-full">No notes found</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <Note key={note.id} note={note} isNewNote={newNoteID === note.id} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default NotesGrid;
