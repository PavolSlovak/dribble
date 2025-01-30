import { TNote } from "@/types";

const useFilterNotes = (notes: TNote[], search: string) => {
  // If search query is empty, return all notes
  if (search === "") return notes;
  // Otherwise, filter notes based on search query
  return notes.filter((note) =>
    note.description.toLowerCase().includes(search.toLowerCase())
  );
};
export { useFilterNotes };
