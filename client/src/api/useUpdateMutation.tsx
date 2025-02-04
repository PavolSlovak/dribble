import { useMutation } from "react-query";
import { HTTPUpdateNote } from "./http";
import { AxiosError, AxiosResponse } from "axios";
import { TNote, TUpdateNote } from "@/types";
import { queryClient } from "@/App";
import { TError } from "@/features/Main/Layout";
import { Dispatch, SetStateAction } from "react";

type UpdateMutateProps = {
  setError: Dispatch<SetStateAction<TError>>;
};
const useUpdateMutation = ({ setError }: UpdateMutateProps) => {
  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation(
    (note: TUpdateNote) => HTTPUpdateNote(note),
    {
      onSuccess: (response: AxiosResponse<TNote>) => {
        queryClient.invalidateQueries("notes");
        console.log("Note updated", response);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data.message || error.message;

        setError((prev: TError) => ({ ...prev, update: errorMessage }));
        console.error("Error updating note", errorMessage);
      },
    }
  );
  return { updateMutate, isUpdateLoading };
};
export default useUpdateMutation;
