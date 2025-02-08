import { TNote } from "@/types";
import { HTTPAddNote } from "./http";
import { queryClient } from "@/App";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useNotes } from "@/store/notesContext";
import { TError } from "@/features/Main/Layout";

const useCreateMutation = () => {
  const { setError, setNewNoteID } = useNotes();
  // Create mutation
  const { mutate: createMutation, isLoading: createLoading } = useMutation({
    mutationFn: HTTPAddNote,
    onMutate: (newNote: TNote) => {
      queryClient.cancelQueries("notes");
      const previousNotes = queryClient.getQueryData<TNote[]>("notes");
      if (previousNotes) {
        queryClient.setQueryData<TNote[]>("notes", [newNote, ...previousNotes]);
      }
      return { previousNotes };
    },
    onError: (error: AxiosError<{ message: string }>, _, context) => {
      setError((prev: TError) => ({ ...prev, create: error.message }));
      if (context?.previousNotes) {
        queryClient.setQueryData("notes", context.previousNotes);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries("notes");
      setNewNoteID(data?.id);
    },
  });
  return { createMutation, createLoading };
};

export default useCreateMutation;
