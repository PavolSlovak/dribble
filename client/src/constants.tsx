import { TNote } from "./types";

export const CATEGORIES: TNote["status"][] = ["todo", "in_progress", "done"];

export const colors = {
  todo: "bg-pastelRed",
  in_progress: "bg-pastelYellow",
  done: "bg-pastelGreen",
};
export const variants = {
  hidden: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
