import { colors } from "@/constants";
import { motion } from "framer-motion";
import { FC } from "react";

type DotProps = {
  category: keyof typeof colors;
};
const Dot: FC<DotProps> = ({ category }: DotProps) => {
  return (
    <motion.div
      className={`w-5 h-5 ${colors[category]} rounded-full hover:scale-125 duration-300`}
    />
  );
};

export default Dot;
