import { FC } from "react";

const SkeletonLoader: FC = () => {
  return (
    <div className="flex flex-wrap w-full justify-between ">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl animate-pulse bg-gray-300 
              
              "
          />
        ))}
      </div>
    </div>
  );
};
export default SkeletonLoader;
