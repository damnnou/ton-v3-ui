import { Skeleton } from "src/components/ui/Skeleton";

export const LoadingState = () => (
    <div className="flex flex-col w-full gap-4 p-4">
        <div className="flex gap-4">
            <Skeleton className="w-[320px] h-[50px] bg-gray-700 rounded-xl" />
            <Skeleton className="w-[156px] h-[50px] bg-gray-700 rounded-xl" />
        </div>
        {[1, 2, 3, 4].map((v) => (
            <Skeleton key={`table-skeleton-${v}`} className="w-full h-[50px] bg-gray-700 rounded-xl" />
        ))}
    </div>
);
