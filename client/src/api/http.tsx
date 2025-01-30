import { queryClient } from "@/App";
import { TNote, TUpdateNote, TUpdateUser } from "@/types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL as string;

const HTTPLogin = async (inputData: { email: string; password: string }) => {
  const response = await axios.post(`${baseUrl}/users/login`, inputData);
  return response;
};

const HTTPRegister = async (inputData: { email: string; password: string }) => {
  const response = await axios.post(`${baseUrl}/users/register`, inputData);
  return response;
};
const HTTPUpdateProfile = async (inputData: TUpdateUser) => {
  const response = await axios.put(`${baseUrl}/users/update`, inputData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response;
};

const HTTPGetNotes = async () => {
  const response = await axios.get(`${baseUrl}/todos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response;
};
const HTTPAddNote = async (description: string, note: TNote["status"]) => {
  await queryClient.cancelQueries("notes");

  const response = await axios.post(
    `${baseUrl}/todos/create`,
    {
      description,
      status: note,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return response;
};

const HTTPUpdateNote = async (note: TUpdateNote) => {
  await queryClient.cancelQueries("notes");
  console.log("note", note);
  const response = await axios.put(
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
  return response;
};
const HTTPDeleteNote = async (id: number) => {
  await queryClient.cancelQueries("notes");

  const response = await axios.delete(`${baseUrl}/todos/delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response;
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
