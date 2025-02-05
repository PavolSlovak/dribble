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
    onSuccess: () => {
      queryClient.invalidateQueries("notes");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setError((prev: TError) => ({
        ...prev,
        delete: error.response?.data.message || error.message,
      }));
    },
  });
  return { deleteMutate, isDeleteLoading };
};
export default useDeleteMutation;
