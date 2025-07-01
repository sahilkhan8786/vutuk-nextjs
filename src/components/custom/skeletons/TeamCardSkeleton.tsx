import { Skeleton } from "@/components/ui/skeleton";

export function TeamCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl border shadow-md">
            <Skeleton className="w-full h-[200px] rounded-md" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
}
