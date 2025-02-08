import { AxiosError } from "axios";

import { FC } from "react";
import { useQuery } from "react-query";

import SkeletonLoader from "./SkeletonLoader";
import NotesGrid from "./NotesGrid";
import { TNote } from "@/types";
import { HTTPGetNotes } from "@/api/http";
import { useOutletContext } from "react-router-dom";

const NotesManager: FC = () => {
  const { data, error, isLoading } = useQuery<
    TNote[],
    AxiosError<{ message: string }>
  >({
    queryKey: "notes",
    queryFn: HTTPGetNotes,
    refetchInterval: 10000,
  });

  let component;
  if (isLoading) {
    component = <SkeletonLoader />;
  } else if (data) {
    component = <NotesGrid notes={data} />;
  } else if (error) {
    component = <p>{error.response?.data.message || error.message}</p>;
  }
  const { createLoading } = useOutletContext();

  return (
    <section className="relative flex flex-col p-10">
      <h1>Notes</h1>
      {createLoading && (
        <p className="absolute top-10 text-center w-full ">Creating note...</p>
      )}

      {component}
    </section>
  );
};
export default NotesManager;
