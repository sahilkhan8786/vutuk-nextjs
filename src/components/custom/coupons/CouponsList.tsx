"use client";

import { useTransition } from "react";
import { deleteCoupon } from "@/actions/coupons";
import { Button } from "@/components/ui/button";

type Coupon = {
    _id: string;
    name: string;
    type: "percentage" | "fixed";
    value: number;
    maxUses: number;
};

export default function CouponsList({ coupons }: { coupons: Coupon[] }) {
    const [isPending, startTransition] = useTransition();

    function handleDelete(id: string) {
        startTransition(async () => {
            await deleteCoupon(id);
            window.location.reload(); // or use router.refresh() if using next/navigation
        });
    }

    return (
        <div className="space-y-2">
            {coupons.map((coupon) => (
                <div
                    key={coupon._id}
                    className="flex items-center justify-between border p-3 rounded-lg"
                >
                    <div>
                        <p className="font-bold">{coupon.name}</p>
                        <p className="text-sm text-gray-500">
                            {coupon.type === "percentage"
                                ? `${coupon.value}%`
                                : `$${coupon.value}`}{" "}
                            | Max Uses: {coupon.maxUses}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Open modal with <CouponForm defaultValues={coupon} />
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleDelete(coupon._id)}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
