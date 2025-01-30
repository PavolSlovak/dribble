import { FC } from "react";
import { motion } from "framer-motion";
import { variants } from "@/constants";

const ErrorBanner: FC<{ message: string | null }> = ({ message }) => {
  return (
    <motion.div
      className="fixed top-2  self-center p-2 bg-red-500 text-white text-center rounded-md z-50"
      initial={"hidden"}
      animate={"visible"}
      exit={"hidden"}
      variants={variants}
    >
      {message}
    </motion.div>
  );
};
export default ErrorBanner;
