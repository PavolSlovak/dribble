import { TCreateNote, TNote } from "@/types";
import { HTTPAddNote } from "./http";
import { queryClient } from "@/App";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { Dispatch, SetStateAction } from "react";
import { TError } from "@/features/Main/Layout";

type CreateMutationProps = {
  setError: Dispatch<SetStateAction<TError>>;
  setNewNoteID: Dispatch<SetStateAction<number | undefined>>;
};
const useCreateMutation = ({ setError, setNewNoteID }: CreateMutationProps) => {
  const { mutate: createMutation, isLoading: createLoading } = useMutation({
    mutationFn: ({ description, status }: TCreateNote) =>
      HTTPAddNote({ description, status }),
    onMutate: async (newNote: TNote) => {
      setNewNoteID(newNote.id);
      await queryClient.cancelQueries("notes");
      const previousNotes = queryClient.getQueryData<TNote[]>("notes");
      if (previousNotes) {
        queryClient.setQueryData<TNote[]>("notes", (old: any) => {
          const favouriteNotes = old.filter((note: TNote) => note.isfavourite);
          const nonFavouriteNotes = old.filter(
            (note: TNote) => !note.isfavourite
          );
          return [...favouriteNotes, newNote, ...nonFavouriteNotes];
        });
      }
      return { previousNotes };
    },
    onError: (error: AxiosError<{ message: string }>, variables, context) => {
      queryClient.setQueryData("notes", context?.previousNotes ?? []);
      setError((prev) => ({
        ...prev,
        create: error.response?.data.message || error.message,
      }));
    },
    onSettled: (newNote) => {
      queryClient.invalidateQueries("notes");
      setNewNoteID(newNote.id);
    },
  });
  return { createMutation, createLoading };
};
export default useCreateMutation;
