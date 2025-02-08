import { useMutation } from "react-query";
import { HTTPUpdateNote } from "./http";
import { AxiosError } from "axios";
import { TNote, TUpdateNote } from "@/types";
import { queryClient } from "@/App";
import { TError } from "@/features/Main/Layout";
import { useNotes } from "@/store/notesContext";

const useUpdateMutation = () => {
  const { setError } = useNotes();

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation({
    mutationFn: HTTPUpdateNote,
    mutationKey: "update",

    onMutate: async (newNote: TUpdateNote) => {
      await queryClient.cancelQueries("notes");
      const previousNotes = queryClient.getQueryData<TNote[]>("notes");
      if (previousNotes) {
        queryClient.setQueryData("notes", (old: any) => {
          return old?.map((note: TNote) => {
            return note.id === newNote.id ? { ...note, ...newNote } : note;
          });
        });
      }
      return { previousNotes };
    },
    onError: (error: AxiosError<{ message: string }>, _, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData("notes", context.previousNotes);
      }
      setError((prev: TError) => ({ ...prev, update: error.message }));
    },
    onSettled: () => {
      queryClient.invalidateQueries("notes");
    },
  });
  return { updateMutate, isUpdateLoading };
};
export default useUpdateMutation;
