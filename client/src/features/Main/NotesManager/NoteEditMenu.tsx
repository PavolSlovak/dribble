import { PencilIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/16/solid";
import { motion, AnimatePresence } from "framer-motion";
import { FC, useState } from "react";
import { CATEGORIES, colors } from "@/constants";
import Dot from "@/components/Dot";
import { TNote, TUpdateNote } from "@/types";

const EditMenu: FC<{
  note: TNote;
  updateMutate: (note: TUpdateNote) => void;
  deleteMutate: (id: TNote["id"]) => void;
}> = ({ note, updateMutate, deleteMutate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoriesExceptCurrent = CATEGORIES.filter(
    (category) => category !== note.status
  );

  return (
    <div className="relative flex">
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="flex items-center  z-80  ">
            {categoriesExceptCurrent.map((category, index) => (
              <motion.a
                href="#"
                key={category}
                onClick={() => updateMutate({ id: note.id, status: category })}
                className="absolute flex items-center"
                initial={{ x: -10 }}
                animate={{ x: -30 * (index + 1) }}
                exit={{ x: -10 }}
              >
                <Dot category={category as keyof typeof colors} />
              </motion.a>
            ))}
            <motion.a
              href="#"
              key="delete"
              onClick={(e) => {
                e.preventDefault();
                deleteMutate(note.id);
              }}
              className="absolute flex items-center  rounded-full p-2"
              initial={{ x: -10 }}
              animate={{ x: -30 * (categoriesExceptCurrent.length + 1) }}
              exit={{ x: -10 }}
            >
              <TrashIcon className="w-5 h-5 text-black hover:scale-125 duration-300" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="rounded-full p-2 bg-black ">
        <PencilIcon
          className="w-5 h-5"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </button>
    </div>
  );
};
export default EditMenu;
