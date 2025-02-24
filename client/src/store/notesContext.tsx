import { TError } from "@/features/Main/Layout";
import { TNote } from "@/types";
import {
  FC,
  ReactNode,
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

type NotesState = {
  setNotes: Dispatch<SetStateAction<TNote[]>>;
  setNewNoteID: Dispatch<SetStateAction<number | undefined>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<TError>>;
  setIsMobile: Dispatch<SetStateAction<boolean>>;
};

type NotesContextType = NotesState & {
  notes: TNote[];
  error: TError;
  newNoteID: number | undefined;

  isMobile: boolean;

  search: string;
};

const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
export const NotesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [newNoteID, setNewNoteID] = useState<number | undefined>();
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<TError>({
    create: null,
    update: null,
    delete: null,
  });

  const value: NotesContextType = {
    notes,
    setNotes,
    newNoteID,
    setNewNoteID,
    isMobile,
    setIsMobile,

    search,
    setSearch,
    error,
    setError,
  };
  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

// newNoteID,
// setNewNoteID,
// isMobile,
// search,
// setError,
