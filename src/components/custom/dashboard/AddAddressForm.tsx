'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SheetClose, SheetFooter } from '@/components/ui/sheet'
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addressFormSchema, AddressFromType } from '@/schemas/addressSchema'
import { createAddress } from '@/actions/address'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'


type Country = {
    name: string
    code: string
    callingCode: string
}
type CountryAPIResponse = {
    name: {
        common: string
    }
    cca2: string
    idd: {
        root?: string
        suffixes?: string[]
    }
}

const AddAddressForm = ({ onClose }: {
    onClose: () => void
}) => {
    const session = useSession();


    const [countries, setCountries] = useState<Country[]>([])
    const form = useForm<AddressFromType>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: session?.data?.user?.email || '',
            countryCode: session?.data?.user?.countryCode,
            phoneNumber: session?.data?.user?.phone ? String(session?.data?.user?.phone) : '',
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            city: "",
            pinCode: "",
            isBusiness: false,
            gstNumber: "",
            firmName: "",
        },
    })

    const isBusiness = form.watch("isBusiness")
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
            .then(res => res.json())
            .then((data: CountryAPIResponse[]) => {
                const list = data.map(c => ({
                    name: c.name.common,
                    code: c.cca2,
                    callingCode: c.idd?.root + (c.idd?.suffixes?.[0] ?? ''),
                })).sort((a, b) => a.name.localeCompare(b.name))
                setCountries(list)
            })
            .catch(console.error)
    }, [])



    const uniqueCountries = Array.from(
        new Map(
            countries
                .filter((c) => c.callingCode && c.callingCode.trim() !== "") // remove empty
                .map((c) => [c.callingCode, c]) // dedupe by callingCode
        ).values()
    ).sort((a, b) => a.name.localeCompare(b.name)); // optional: sort by name


    async function onSubmit(values: AddressFromType) {

        try {
            const res = await createAddress(values);

            if (res?.success) {
                toast.success(res.message)
                onClose?.()
            }
            toast.error(res.message)
        } catch (error) {

            const err = error as { message?: string };
            toast.error(err.message || "Something went wrong");
            onClose?.();
        }
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-4 overflow-y-scroll">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@email.com" {...field} />
                            </FormControl>
                            <FormDescription>Your email address.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-center gap-4">
                    <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Country Code</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select code" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {uniqueCountries.map((c) => (
                                            <SelectItem key={c.code} value={c.callingCode}>
                                                {c.name} ({c.callingCode})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem className='flex-2'>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem className='flex-3'>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                                <Input placeholder="Street, Locality" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem className='flex-3'>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem className='flex-3'>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="India" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-center gap-4'>
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className='flex-3'>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Maharashtra" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className='flex-3'>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mumbai" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                        <FormItem className='flex-3'>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                                <Input placeholder="400001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isBusiness"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="mb-0">Ordering as a Business</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isBusiness && (
                    <>
                        <FormField
                            control={form.control}
                            name="firmName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Firm Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company XYZ Pvt Ltd" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gstNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="22AAAAA0000A1Z5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <SheetFooter>
                    <Button type="submit">Add Address</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </form>
        </Form>
    )
}

export default AddAddressForm
