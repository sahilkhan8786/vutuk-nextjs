import { Skeleton } from "@/components/ui/skeleton";


export function SkeletonCard({
    isCardShowing = true,
    isLinesShowing = true,
    height = 125,
    width
}: {
    isCardShowing?: boolean;
    isLinesShowing?: boolean;
    height?: number;
    width?: number;
}) {
    return (
        <div className="flex flex-col space-y-3">
            {isCardShowing && <Skeleton className={`h-[${height}px] ${width ? `w-[50px]` : 'w-full'} rounded-xl`} />}
            {isLinesShowing && <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>}
        </div >
    )
}
