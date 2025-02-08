import { queryClient } from "@/App";
import { TCreateNote, TUpdateNote, TUpdateUser } from "@/types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL as string;

const HTTPLogin = async (inputData: { email: string; password: string }) => {
  const { data } = await axios.post(`${baseUrl}/users/login`, inputData);
  return data;
};

const HTTPRegister = async (inputData: { email: string; password: string }) => {
  const { data } = await axios.post(`${baseUrl}/users/register`, inputData);
  return data;
};
const HTTPUpdateProfile = async (inputData: TUpdateUser) => {
  const { data } = await axios.put(`${baseUrl}/users/update`, inputData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
};

const HTTPGetNotes = async () => {
  const { data } = await axios.get(`${baseUrl}/todos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
};
const HTTPAddNote = async (newNote: TCreateNote) => {
  await queryClient.cancelQueries("notes");

  const { data } = await axios.post(
    `${baseUrl}/todos/create`,
    {
      description: newNote.description,
      status: newNote.status,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return data;
};

const HTTPUpdateNote = async (note: TUpdateNote) => {
  await queryClient.cancelQueries("notes");
  console.log("note", note);
  const { data } = await axios.put(
    `${baseUrl}/todos/update/${note.id}`,
    {
      isfavourite: note.isfavourite,
      description: note.description,
      status: note.status,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return data;
};
const HTTPDeleteNote = async (id: number) => {
  await queryClient.cancelQueries("notes");

  const { data } = await axios.delete(`${baseUrl}/todos/delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
};
export {
  HTTPLogin,
  HTTPRegister,
  HTTPUpdateProfile,
  HTTPGetNotes,
  HTTPAddNote,
  HTTPUpdateNote,
  HTTPDeleteNote,
};
