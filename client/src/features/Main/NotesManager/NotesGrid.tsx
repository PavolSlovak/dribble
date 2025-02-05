import { FC } from "react";
import { TNote } from "@/types";
import { useFilterNotes } from "@/features/utils/useFilterNotes";
import Note from "./Note";

const NotesGrid: FC<{
  notes: TNote[];
  search: string;
  newNoteID: number | undefined;
}> = ({ notes, search, newNoteID }) => {
  const filteredNotes = useFilterNotes(notes, search);
  return (
    <div className="flex flex-wrap w-full justify-between ">
      {filteredNotes.length === 0 && (
        <p className="text-center w-full">No notes found</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        {filteredNotes.map((note) => (
          <Note key={note.id} note={note} isNewNote={newNoteID === note.id} />
        ))}
      </div>
    </div>
  );
};
export default NotesGrid;
