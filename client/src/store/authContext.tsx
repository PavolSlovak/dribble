import { HTTPLogin, HTTPRegister, HTTPUpdateProfile } from "@/api/http";
import { TLogin, TRegister, TUpdateUser, TUser } from "@/types";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  FC,
  ReactNode,
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type AuthState = {
  isAuthenticated: boolean;
  currentUser: TUser | null;
  loading: boolean;
  authError: string | null;
};

type AuthContextType = AuthState & {
  registerUser: (user: TRegister) => Promise<void>;
  login: (user: TLogin) => Promise<void>;
  logout: () => void;
  updateProfile: (inputData: TUpdateUser) => Promise<void>;
  setAuthError: (error: string | null) => void;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const initialState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    authError: null,
  };

  type AuthAction =
    | { type: "LOGIN"; payload: TUser }
    | { type: "LOGOUT" }
    | { type: "UPDATE_PROFILE"; payload: TUser }
    | { type: "SET_AUTH_ERROR"; payload: string | null }
    | { type: "SET_CURRENT_USER"; payload: TUser | null };

  const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
    switch (action.type) {
      case "LOGIN":
      case "SET_CURRENT_USER":
        return {
          ...state,
          isAuthenticated: true,
          currentUser: action.payload,
          loading: false,
          authError: null,
        };
      case "LOGOUT":
        return {
          ...state,
          isAuthenticated: false,
          currentUser: null,
          loading: false,
          authError: null,
        };
      case "UPDATE_PROFILE":
        return {
          ...state,
          currentUser: { ...state.currentUser, ...action.payload },
        };
      case "SET_AUTH_ERROR":
        return {
          ...state,
          authError: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Check if user is already logged in using a token
  useEffect(() => {
    dispatch({ type: "SET_AUTH_ERROR", payload: null });
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          logout();
        } else {
          dispatch({ type: "SET_CURRENT_USER", payload: decodedToken });
        }
      } catch (error) {
        console.error("Error decoding token", error);
        dispatch({
          type: "SET_AUTH_ERROR",
          payload: "Invalid authentication token",
        });
        logout();
      }
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // Auth Functions
  const registerUser = async (inputData: TRegister) => {
    try {
      dispatch({ type: "SET_AUTH_ERROR", payload: null });
      await HTTPRegister(inputData);
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data.message ||
        "Registration failed";
      dispatch({ type: "SET_AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const login = async (inputData: TLogin) => {
    try {
      dispatch({ type: "SET_AUTH_ERROR", payload: null });
      const response = await HTTPLogin(inputData);
      const token = response.jwtToken;
      localStorage.setItem("token", token);
      const userData = jwtDecode<TUser>(token);
      dispatch({ type: "LOGIN", payload: userData });
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data.message ||
        "Login failed";
      dispatch({ type: "SET_AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
  };

  const updateProfile = async (inputData: TUpdateUser) => {
    try {
      dispatch({ type: "SET_AUTH_ERROR", payload: null });
      const response = await HTTPUpdateProfile(inputData);
      dispatch({ type: "UPDATE_PROFILE", payload: response });
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data.message ||
        "Profile update failed";
      dispatch({ type: "SET_AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const setAuthError = (error: string | null) => {
    dispatch({ type: "SET_AUTH_ERROR", payload: error });
  };

  // Memoized Context Value
  const value = useMemo(
    () => ({
      ...state,
      registerUser,
      login,
      logout,
      updateProfile,
      setAuthError,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
