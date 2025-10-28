"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { createCoupon, updateCoupon } from "@/actions/coupons";
import { useTransition } from "react";
import { addCouponSchema, CouponFormValues } from "@/schemas/AddCouponsSchema";

type Props = {
    onClose: () => void;
    defaultValues?: CouponFormValues & { _id?: string };
};

const CouponForm = ({ onClose, defaultValues }: Props) => {
    const [isPending, startTransition] = useTransition();
    console.log("Opened")

    const isEditing = Boolean(defaultValues?._id);

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(addCouponSchema),
        defaultValues: defaultValues
            ? {
                ...defaultValues,
                startDate: defaultValues.startDate
                    ? new Date(defaultValues.startDate).toISOString().split("T")[0]
                    : "",
                endDate: defaultValues.endDate
                    ? new Date(defaultValues.endDate).toISOString().split("T")[0]
                    : "",
            }
            : {
                name: "",
                type: "percentage",
                value: 0,
                maxUses: 1,
                startDate: "",
                endDate: "",
            },
    });


    function onSubmit(values: CouponFormValues) {
        startTransition(async () => {
            if (isEditing && defaultValues?._id) {
                await updateCoupon(defaultValues._id, values);
            } else {
                await createCoupon(values);
            }
            onClose?.();
        });
    }

    return (
        <div className="">
            <h2 className="text-lg font-semibold mb-4">
                {isEditing ? "Update Coupon" : "Add Coupon"}
            </h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Coupon Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coupon Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="SUMMER2025" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Unique identifier for this coupon
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Type */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Value */}
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Value</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter % or fixed amount based on type
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Max Uses */}
                    <FormField
                        control={form.control}
                        name="maxUses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Uses</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How many times this coupon can be used
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* End Date */}
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isPending}>
                        {isPending
                            ? "Saving..."
                            : isEditing
                                ? "Update Coupon"
                                : "Create Coupon"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CouponForm;
