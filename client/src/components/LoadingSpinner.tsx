import { FC } from "react";

const LoadingSpinner: FC<{ diameter: number }> = (diameter) => {
  return (
    <div
      style={{ height: `${diameter}px`, width: `${diameter}px` }} // Set dimensions dynamically
      className={`absolute bottom-2 left-2 flex justify-center items-center h-4`}
    >
      <div
        className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"
        style={{ height: `${diameter}px`, width: `${diameter}px` }} // Set spinner size dynamically
      ></div>
    </div>
  );
};
export default LoadingSpinner;
