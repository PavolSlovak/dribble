import { AxiosError } from "axios";

import { Dispatch, FC, SetStateAction } from "react";
import { useQuery } from "react-query";

import SkeletonLoader from "./SkeletonLoader";
import NotesGrid from "./NotesGrid";
import { TNote } from "@/types";
import { HTTPGetNotes } from "@/api/http";
import { useNotes } from "@/store/notesContext";

const TodoManager: FC = () => {
  const { newNoteID, search, setNewNoteID } = useNotes();
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
