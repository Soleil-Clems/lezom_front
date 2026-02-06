import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-own-dark  w-[99%] dark h-full p-4 rounded-md">
            {Array.from({ length: 12 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col space-y-3 mb-4"
                >
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
}