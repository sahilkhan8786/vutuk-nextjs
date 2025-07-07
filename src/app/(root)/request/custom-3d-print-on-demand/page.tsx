'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import WidthCard from '@/components/ui/WidthCard'

import { custom3dProductRequestSchema } from '@/schemas/custom3dProductRequestSchema'
import { custom3dProductRequest } from '@/actions/custom3dProductRequest'
import AuthFormWrapper, { AuthDialogHandle } from '@/components/custom/auth/AuthFormWrapper'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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

type Country = {
    name: string
    code: string
    callingCode: string
}

export default function Custom3DProductRequestPage() {
    const authDialogRef = useRef<AuthDialogHandle>(null)
    const [countries, setCountries] = useState<Country[]>([])
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof custom3dProductRequestSchema>>({
        resolver: zodResolver(custom3dProductRequestSchema),
        defaultValues: {
            modelFile: null,
            material: '',
            otherMaterial: '',
            color: '',
            otherColor: '',
            priority: '',
            otherPriority: '',
            quantity: 1,
            notes: '',

            firstName: '',
            lastName: '',
            email: '',
            phoneCode: '',
            phoneNumber: '',

            addressLine1: '',
            addressLine2: '',
            country: '',
            state: '',
            city: '',
            pincode: '',

            isBusiness: false,
            gstOrFirm: '',
        },
    })

    const material = form.watch('material')
    const color = form.watch('color')
    const priority = form.watch('priority')

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

    useEffect(() => {
        const saved = localStorage.getItem('pending3dForm')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                form.reset(parsed)
            } catch (e) {
                console.error('Failed to restore form data', e)
            }
        }
    }, [])

    async function onSubmit(values: z.infer<typeof custom3dProductRequestSchema>) {
        try {
            setIsLoading(true)
            const result = await custom3dProductRequest(values)
            if (result?.error === 'unauthenticated') {
                localStorage.setItem('pending3dForm', JSON.stringify(values))
                authDialogRef.current?.open()
                return
            }

            localStorage.removeItem('pending3dForm');
            form.reset()
            router.push('/dashboard/order-in-process')

        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-24 mb-8">
            <AuthFormWrapper ref={authDialogRef} />
            <WidthCard>
                <h2 className="text-3xl font-bold text-center mb-4">Custom 3D Print Request</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto border rounded-xl p-6">
                        <FormField control={form.control} name="modelFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload 3D Model</FormLabel>
                                <FormControl>
                                    <Input type="file" accept=".stl,.obj,.step" onChange={e => field.onChange(e.target.files?.[0])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Material Select */}
                        <FormField control={form.control} name="material" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select material</option>
                                        {['PLA', 'ABS', 'PETG', 'TPU', 'Other', 'Not sure'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {(material === 'Other' || material === 'Not sure') && (
                            <FormField control={form.control} name="otherMaterial" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Material</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        {/* Color Select */}
                        <FormField control={form.control} name="color" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select color</option>
                                        {['Black', 'White', 'Other', 'Not sure'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {(color === 'Other' || color === 'Not sure') && (
                            <FormField control={form.control} name="otherColor" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Color</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        {/* Priority Select */}
                        <FormField control={form.control} name="priority" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Print Priority</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select priority</option>
                                        {['Strength', 'Quality', 'Optimal', 'Not sure'].map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {(priority === 'Not sure') && (
                            <FormField control={form.control} name="otherPriority" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Priority</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        {/* Quantity */}
                        <FormField control={form.control} name="quantity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl><Input type="number" min={1} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Notes */}
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Additional Notes</FormLabel>
                                <FormControl><Textarea rows={3} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['firstName', 'lastName'].map(name => (
                                <FormField key={name} control={form.control} name={name as 'firstName' | 'lastName'} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{name === 'firstName' ? 'First Name' : 'Last Name'}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}
                        </div>

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="phoneCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country Code</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                            <option value="">Select code</option>
                                            {countries.map(c => (
                                                <option key={c.code} value={c.callingCode}>{c.name} ({c.callingCode})</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><Input type="tel" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Address */}
                        <FormField control={form.control} name="addressLine1" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="addressLine2" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 2</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select country</option>
                                        {countries.map(c => (
                                            <option key={c.code} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['state', 'city'].map(name => (
                                <FormField key={name} control={form.control} name={name as 'state' | 'city'} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}
                        </div>

                        <FormField control={form.control} name="pincode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="isBusiness" render={({ field }) => (
                            <FormItem className="flex items-start space-x-2">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Ordering on behalf of a business?</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {form.watch('isBusiness') && (
                            <FormField control={form.control} name="gstOrFirm" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST No. / Firm Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </form>
                </Form>
            </WidthCard>
        </div>
    )
}