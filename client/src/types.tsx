import { z } from "zod";

type TNote = {
  id: number;
  description: string;
  status: "todo" | "in_progress" | "done";
  isfavourite: boolean;
  user_id: number;
  timestamp: string;
  isNew?: boolean;
};
type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

type TCreateNote = {
  description: TNote["description"];
  status: TNote["status"];
};

type TUpdateNote = {
  id: number;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  isfavourite?: boolean;
};
type OutletProps = {
  newNoteId: TNote["id"];
  setNewNoteID: (id: TNote["id"]) => void;
  isMobile: boolean;
  search: string;
  createError: string | null;
  updateMutate: (note: TUpdateNote) => void;
  isUpdateLoading: boolean;
  updateError: string | null;
  deleteMutate: (note: TUpdateNote) => void;
  isDeleteLoading: boolean;
  deleteError: string | null;
};
// ZOD schemas

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const RegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
});
export const UpdateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4),
  newPassword: z.string().min(4).optional(),
});

type TLogin = z.infer<typeof LoginSchema>;
type TRegister = z.infer<typeof RegisterSchema>;
type TUpdateUser = z.infer<typeof UpdateUserSchema>;

export type {
  TUser,
  TLogin,
  TRegister,
  TUpdateUser,
  TNote,
  TCreateNote,
  TUpdateNote,
  OutletProps,
};
