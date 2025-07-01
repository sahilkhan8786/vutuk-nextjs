'use client'
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductTableSkeleton() {
    return (
        <div className="grid  gap-6 py-10 bg-">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">

                    <Skeleton className="h-6 w-full" />
                </div>
            ))}
        </div>
    );
}
