import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { AnimatePresence } from "framer-motion";
import { FC, MouseEvent, useState } from "react";
import { motion } from "framer-motion";
import { TNote } from "@/types";
import { CATEGORIES } from "@/constants";
import Dot from "@/components/Dot";
import { useAuth } from "@/store/authContext";
import { useNotes } from "@/store/notesContext";

type SidebarProps = {
  createMutation: (newNote: TNote) => void;
  createLoading: boolean;
};

const Sidebar: FC<SidebarProps> = ({ createMutation, createLoading }) => {
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { notes } = useNotes();
  const handlePlusClick = () => {
    setCategoriesMenuOpen(!categoriesMenuOpen);
  };

  const handleAddNote = async (
    e: MouseEvent<HTMLAnchorElement>,
    category: TNote["status"]
  ) => {
    e.preventDefault();

    // Create a new note with default values
    const newNote: TNote = {
      id: notes.length + 1,
      description: "",
      status: category,
      isfavourite: false,
      user_id: currentUser!.id,
      timestamp: new Date().toISOString(),
      isNew: true, // From the server, this would be undefined
    };
    createMutation(newNote);
  };

  return (
    <aside className="flex flex-col   items-center py-4 border-r border-lightGray">
      <span className="text-xl tracking-tight p-4">Docket</span>
      <motion.div className="relative flex flex-col pt-14 w-full items-center ">
        <motion.a
          className={`absolute cursor-pointer z-10`}
          onClick={handlePlusClick}
          initial={{ rotate: 0 }}
          animate={{ rotate: categoriesMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 260 }}
        >
          <PlusCircleIcon className=" w-10 h-10 hover:scale-125 duration-300" />
        </motion.a>
        <AnimatePresence>
          {categoriesMenuOpen && (
            <motion.div className="flex flex-col items-center z-0">
              {CATEGORIES.map((category, index) => (
                <motion.a
                  href="#"
                  key={category}
                  onClick={(e) => handleAddNote(e, category as TNote["status"])}
                  className={`absolute flex items-center ${
                    createLoading ? "pointer-events-none" : ""
                  }`}
                  initial={{ y: 10 }}
                  animate={{ y: 50 * (index + 1) }}
                  exit={{ y: 10 }}
                  transition={{
                    delay: 0.2 * (index + 1),
                  }}
                >
                  <Dot category={category} />
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};
export default Sidebar;
