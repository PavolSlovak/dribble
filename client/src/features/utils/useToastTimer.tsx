import { useEffect } from "react";

type UseToastTimerProps<T> = {
  duration: number;
  callback: (value: T) => void;
  resetValue: T;
};

export function useToastTimer<T>({
  duration,
  callback,
  resetValue,
}: UseToastTimerProps<T>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback(resetValue);
    }, duration);
    return () => clearTimeout(timer);
  }, [callback, duration, resetValue]);
}
