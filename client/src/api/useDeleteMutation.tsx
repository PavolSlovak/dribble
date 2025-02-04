import { queryClient } from "@/App";
import { TError } from "@/features/Main/Layout";
import { HTTPDeleteNote } from "./http";
import { useMutation } from "react-query";
import { TNote, TUpdateNote } from "@/types";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

type DeleteMutateProps = {
  setError: Dispatch<SetStateAction<TError>>;
};
const useDeleteMutation = ({ setError }: DeleteMutateProps) => {
  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation({
    mutationFn: ({ id }: TUpdateNote) => HTTPDeleteNote(id),
    onMutate: async (note: TUpdateNote) => {
      await queryClient.cancelQueries("notes");
      const previousNotes = queryClient.getQueryData<TNote[]>("notes");
      queryClient.setQueryData<TNote[]>("notes", (old: any) =>
        old.filter((n: TNote) => n.id !== note.id)
      );
      return { previousNotes };
    },
    onError: (error: AxiosError<{ message: string }>, _, context) => {
      queryClient.setQueryData("notes", context?.previousNotes);
      setError((prev: TError) => ({
        ...prev,
        delete: error.response?.data.message || error.message,
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries("notes");
    },
  });
  return { deleteMutate, isDeleteLoading };
};
export default useDeleteMutation;
