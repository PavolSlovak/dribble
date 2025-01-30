import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type NavbarProps = {
  setSearch: Dispatch<SetStateAction<string>>;
};

const Navbar: FC<NavbarProps> = ({ setSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <header className="flex justify-between items-center w-full  py-5 px-10">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        className="max-w-80 h-10 text-darkGray p-2 rounded-lg outline-none"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Link to="/auth?account" className="btn">
        Account
      </Link>
    </header>
  );
};
export default Navbar;
