import { FC, InputHTMLAttributes } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
type InputProps = {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>;

const ValidatedInput: FC<InputProps> = ({
  label,
  error,
  register,
  ...rest
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={label} className="mb-1">
        {label}
      </label>
      <input
        {...register}
        {...rest}
        className={`border-b  p-2  outline-none ${
          error ? "border-red-700" : "border-black"
        }`}
      />
      {error && <InputError message={error.message} />}
    </div>
  );
};
export default ValidatedInput;

export const InputError: FC<{ message: string | undefined }> = ({
  message,
}) => {
  return (
    <span className="w-full  p-1 bg-opacity-70 text-red-700">{message}</span>
  );
};
