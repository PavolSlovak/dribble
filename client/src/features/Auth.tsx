import {
  LoginSchema,
  RegisterSchema,
  TLogin,
  TRegister,
  TUpdateUser,
  UpdateUserSchema,
} from "@/types";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidatedInput, { InputError } from "@/components/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authContext";
import { ArrowLeftIcon, StarIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, motion } from "framer-motion";
import { PrivateRoute } from "@/components/PrivateRoute";
import ErrorBanner from "@/components/ErrorBanner";
import { variants } from "@/constants";
import { useToastTimer } from "./utils/useToastTimer";

const Auth: FC = () => {
  const { authError, setAuthError } = useAuth(); // Auth context
  const [component, setComponent] = useState<JSX.Element>();
  const location = useLocation();

  useToastTimer({ duration: 3000, callback: setAuthError, resetValue: null });

  useEffect(() => {
    switch (location.search) {
      case "?login":
        setComponent(<Login />);
        break;
      case "?register":
        setComponent(<Register />);
        break;
      case "?account":
        setComponent(<PrivateRoute element={<Account />} />);
        break;
      case "?update":
        setComponent(<PrivateRoute element={<Update />} />);
        break;
    }
  }, [location.search]);

  return (
    <motion.div
      className="relative max-w-2xl flex flex-col mx-auto md:my-10 rounded-2xl bg-white"
      initial={"hidden"}
      animate={"visible"}
      exit={"hidden"}
      variants={variants}
    >
      <AnimatePresence>
        {authError && <ErrorBanner message={authError} />}
      </AnimatePresence>

      {component}
    </motion.div>
  );
};
export default Auth;

const Register: FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const name = watch("name");
  const password = watch("password");
  const email = watch("email");

  // Clear errors on input change
  useEffect(() => {
    if (name && !errors.name?.message) {
      clearErrors("name");
    }
    if (email && !errors.email?.message) {
      clearErrors("email");
    }
    if (password && !errors.password?.message) {
      clearErrors("password");
    }
  }, [name, email, password, errors, clearErrors]);

  const onRegister = async (data: TRegister) => {
    const result = RegisterSchema.safeParse(data);
    console.log(result);
    if (!result.success) {
      console.error(result.error);
    }
    await registerUser(data);
    navigate("/auth?login");
    clearErrors();
  };
  return (
    <div className="p-10 space-y-5">
      <header className="flex flex-col w-full  items-center space-y-3">
        <span className="flex items-center text-3xl tracking-tighter p-4 text-lightGray">
          <StarIcon className="w-6 h-6" />
          Docket
        </span>

        <p className=" text-3xl">Create an Account</p>
        <p>Join us by filling in your details below.</p>
      </header>
      <form
        className="flex flex-col space-y-5 "
        onSubmit={handleSubmit((data) => onRegister(data))}
      >
        <ValidatedInput
          label="Name"
          error={errors.name}
          register={register("name")}
          type="text"
          autoFocus
        />
        <ValidatedInput
          label="Email"
          error={errors.email}
          register={register("email")}
          type="email"
        />
        <ValidatedInput
          label="Password"
          error={errors.password}
          register={register("password")}
          type="password"
        />

        <button>{isSubmitting ? "Loading..." : "Register"}</button>
      </form>
      {/* Form footer */}
      <footer className="flex justify-center ">
        <p>Already have an accout?</p>
        <Link to="?login" className="text-black ml-1">
          Log In
        </Link>
      </footer>
    </div>
  );
};
const Login: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const password = watch("password");
  const email = watch("email");

  // Clear errors on input change
  useEffect(() => {
    if (email && !errors.email?.message) {
      clearErrors("email");
    }
    if (password && !errors.password?.message) {
      clearErrors("password");
    }
  }, [email, password, errors, clearErrors]);

  const onLogin = async (data: TLogin) => {
    const result = LoginSchema.safeParse(data);
    // zod schema validation
    if (!result.success) {
      console.error(result.error);
      return;
    }
    await login(data);
    navigate("/");
    clearErrors();
  };
  return (
    <div className="p-10 space-y-5">
      <header className="flex flex-col w-full  items-center space-y-3">
        <span className="flex items-center text-3xl tracking-tighter p-4 text-lightGray">
          <StarIcon className="w-6 h-6" />
          Docket
        </span>

        <p className=" text-3xl">Welcome back!</p>
        <p>Please enter your details</p>
      </header>
      <form
        className="flex flex-col space-y-5 "
        onSubmit={handleSubmit((data) => onLogin(data))}
      >
        <ValidatedInput
          label="Email"
          error={errors.email}
          register={register("email")}
          type="email"
          autoFocus
        />
        <ValidatedInput
          label="Password"
          error={errors.password}
          register={register("password")}
          type="password"
        />

        <button>{isSubmitting ? "Loading..." : "Log in"}</button>
      </form>
      <footer className="flex justify-center">
        <p>Don't have an accout? Please register: </p>
        <Link to="?register" className="text-black ml-1">
          Register
        </Link>
      </footer>
    </div>
  );
};
const Update: FC = () => {
  const { updateProfile, currentUser, authError } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      password: "",
      newPassword: "",
    },
  });
  const name = watch("name");
  const password = watch("password");
  const email = watch("email");
  const newPassword = watch("newPassword");
  // Clear errors on input change
  useEffect(() => {
    if (name && !errors.name?.message) {
      clearErrors("name");
    }
    if (email && !errors.email?.message) {
      clearErrors("email");
    }
    if (password && !errors.password?.message) {
      clearErrors("password");
    }
    if (newPassword && !errors.newPassword?.message) {
      clearErrors("newPassword");
    }
  }, [email, password, errors, newPassword, clearErrors]);

  const onUpdateProfile = async (data: TUpdateUser) => {
    const result = UpdateUserSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
    }
    clearErrors();

    await updateProfile(data);

    navigate("/auth?account");
  };
  return (
    <div className="p-10 space-y-5">
      <header className="relative flex flex-col w-full items-center">
        <Link
          to="/auth?account"
          className="absolute left-0 flex items-center text-black"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Account
        </Link>
        <span className="relative flex items-center text-3xl tracking-tighter p-4 text-lightGray">
          <StarIcon className="w-6 h-6" />
          Docket
        </span>

        <p className=" text-3xl">Update Profile</p>
        <p>Update your details below.</p>
      </header>
      <form
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onUpdateProfile)}
      >
        <ValidatedInput register={register("name")} label="Name" type="text" />
        <ValidatedInput
          register={register("email")}
          label="Email"
          error={errors.email}
          type="email"
        />
        <ValidatedInput
          register={register("password")}
          label="Password"
          error={errors.password}
          type="password"
        />
        <ValidatedInput
          register={register("newPassword")}
          label="New Password"
          error={errors.newPassword}
          type="password"
        />
        <button>{isSubmitting ? "Loading..." : "Update"}</button>
      </form>
    </div>
  );
};
const Account: FC = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div className="p-10 space-y-5">
      <header className="relative flex flex-col w-full  items-center space-y-4">
        <Link to="/" className="absolute left-0 flex items-center text-black">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Main Page
        </Link>
        <span className="flex items-center text-3xl tracking-tighter p-4 text-lightGray">
          <StarIcon className="w-6 h-6" />
          Docket
        </span>

        <p className=" text-3xl">{currentUser?.name}'s Account!</p>
        <p>Manage your account below.</p>
      </header>
      <footer className="flex flex-col items-center space-y-3">
        <Link to="/auth?update" className="btn">
          Update Profile
        </Link>
        <Link to="/" onClick={logout}>
          Logout
        </Link>
      </footer>
    </div>
  );
};
