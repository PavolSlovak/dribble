import { TNote } from "@/types";
import { HTTPAddNote } from "./http";
import { queryClient } from "@/App";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useNotes } from "@/store/notesContext";

const useCreateMutation = () => {
  const { setError, setNewNoteID } = useNotes();
  // Create mutation
  const { mutate: createMutation, isLoading: createLoading } = useMutation({
    mutationFn: HTTPAddNote,
    onSuccess: (data: TNote) => {
      queryClient.setQueryData<TNote[]>("notes", (prev) => {
        if (prev) {
          return [data, ...prev];
        }
        return [data];
      });
      setNewNoteID(data.id);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setError((prev) => ({
        ...prev,
        create: error.response?.data.message || error.message,
      }));
    },
  });
  return { createMutation, createLoading };
};
export default useCreateMutation;
