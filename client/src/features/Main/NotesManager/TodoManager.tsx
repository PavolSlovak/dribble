import { AxiosError } from "axios";

import { FC } from "react";
import { useQuery } from "react-query";

import SkeletonLoader from "./SkeletonLoader";
import NotesGrid from "./NotesGrid";
import { TNote } from "@/types";
import { HTTPGetNotes } from "@/api/http";

const TodoManager: FC = () => {
  const { data, error, isLoading } = useQuery<
    TNote[],
    AxiosError<{ message: string }>
  >({
    queryKey: "notes",
    queryFn: HTTPGetNotes,
  });

  let component;
  if (isLoading) {
    component = <SkeletonLoader />;
  } else if (data) {
    component = <NotesGrid notes={data} />;
  } else if (error) {
    component = <p>{error.response?.data.message || error.message}</p>;
  }

  return (
    <section className="flex flex-col p-10">
      <h1>Notes</h1>
      {component}
    </section>
  );
};
export default TodoManager;
