"use client";

import React, { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { addCouponSchema, CouponFormValues } from "@/schemas/AddCouponsSchema";
import { createCoupon, updateCoupon } from "@/actions/coupons";

// ✅ Props typed with strong schema link
type CouponFormProps = {
    onClose: () => void;
    defaultValues?: Partial<CouponFormValues> & { _id?: string };
};

const CouponForm: React.FC<CouponFormProps> = ({ onClose, defaultValues }) => {
    const [isPending, startTransition] = useTransition();

    const isEditing = Boolean(defaultValues?._id);

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(addCouponSchema),
        defaultValues: {
            name: defaultValues?.name ?? "",
            type: defaultValues?.type ?? "percentage",
            value: defaultValues?.value ?? 0,
            maxUses: defaultValues?.maxUses ?? 1,
            startDate: defaultValues?.startDate ?? "",
            endDate: defaultValues?.endDate ?? "",
            isActive: defaultValues?.isActive ?? true,
        },
    });



    // ✅ Values are strongly typed by zod schema
    const onSubmit: SubmitHandler<CouponFormValues> = (values) => {
        startTransition(async () => {
            try {
                if (isEditing && defaultValues?._id) {
                    await updateCoupon(defaultValues._id, values);
                } else {
                    await createCoupon(values);
                }
                onClose();
            } catch (error) {
                console.error("Failed to save coupon:", error);
            }
        });
    };

    return (
        <div>
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
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value ?? 0}
                                        onChange={(e) =>
                                            field.onChange(Number(e.target.value) || 0)
                                        }
                                    />
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
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value ?? 1}
                                        onChange={(e) =>
                                            field.onChange(parseInt(e.target.value) || 1)
                                        }
                                    />
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
                                    <Input type="date" {...field} value={field.value ?? ""} />
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
                                    <Input type="date" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Active Status */}
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active Status</FormLabel>
                                    <FormDescription>
                                        Whether this coupon is active and can be used
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
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
