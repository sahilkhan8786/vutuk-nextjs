"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CouponForm from "../AddCouponsForm";
import { CouponFormValues } from "@/schemas/AddCouponsSchema";

// ✅ Import the actual form value type from the CouponForm file
// (assuming you exported it there)

type EditCouponFormWrapperProps = {
    // The coupon being edited — includes form fields plus database _id
    coupon: CouponFormValues & { _id: string };
};

const EditCouponFormWrapper = ({ coupon }: EditCouponFormWrapperProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* ✅ This automatically handles open/close */}
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </SheetTrigger>

            <SheetContent className="overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Edit Coupon</SheetTitle>
                    <SheetDescription>
                        Update your coupon details below.
                    </SheetDescription>
                </SheetHeader>

                {/* ✅ Pass defaultValues and handle sheet close */}
                <CouponForm defaultValues={coupon} onClose={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
};

export default EditCouponFormWrapper;
