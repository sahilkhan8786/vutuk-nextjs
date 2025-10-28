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

type Props = {
    coupon: any; // ideally type it as CouponFormValues & { _id: string }
};

const EditCouponFormWrapper = ({ coupon }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* ✅ This makes the button automatically open/close the sheet */}
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </SheetTrigger>

            <SheetContent className="overflow-y-scroll ">
                <SheetHeader>
                    <SheetTitle>Edit Coupon</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>

                    <CouponForm defaultValues={coupon} onClose={() => setOpen(false)} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default EditCouponFormWrapper;
