import { queryClient } from "@/App";
import { TError } from "@/features/Main/Layout";
import { HTTPDeleteNote } from "./http";
import { useMutation } from "react-query";
import { TUpdateNote } from "@/types";
import { AxiosError } from "axios";
import { useNotes } from "@/store/notesContext";

const useDeleteMutation = () => {
  const { setError } = useNotes();
  // Delete mutation
  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation({
    mutationFn: ({ id }: TUpdateNote) => HTTPDeleteNote(id),
    onMutate: (deletedNote: TUpdateNote) => {
      queryClient.cancelQueries("notes");
      const previousNotes = queryClient.getQueryData<TUpdateNote[]>("notes");
      if (previousNotes) {
        queryClient.setQueryData<TUpdateNote[]>(
          "notes",
          previousNotes.filter((note) => note.id !== deletedNote.id)
        );
      }
      return { previousNotes };
    },
    onError: (error: AxiosError<{ message: string }>, _, context) => {
      setError((prev: TError) => ({ ...prev, delete: error.message }));
      if (context?.previousNotes) {
        queryClient.setQueryData("notes", context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("notes");
    },
  });
  return { deleteMutate, isDeleteLoading };
};
export default useDeleteMutation;
