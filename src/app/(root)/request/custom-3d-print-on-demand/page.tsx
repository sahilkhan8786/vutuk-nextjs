'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import WidthCard from '@/components/ui/WidthCard'
import AuthFormWrapper, { AuthDialogHandle } from '@/components/custom/auth/AuthFormWrapper'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { custom3dProductRequest } from '@/actions/custom3dProductRequest'
import { uploadToBunny } from '@/lib/uploadToBunny'
import AddAddressFormWrapper from '@/components/custom/dashboard/wrappers/AddAddressFormWrapper'
import { custom3dProductRequestSchema } from '@/schemas/custom3dProductRequestSchema'
type AddressType = {
    _id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    state: string;
    country: string;
    addressLine2: string;
    city: string;
    phoneNumber: string | number;
    pinCode: string;
}

// ==================== COMPONENT ====================
export default function Custom3DProductRequestPage() {
    const authDialogRef = useRef<AuthDialogHandle>(null)
    const [isModalUploading, setIsModalUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

    const form = useForm<z.infer<typeof custom3dProductRequestSchema>>({
        resolver: zodResolver(custom3dProductRequestSchema),
        defaultValues: {
            material: '',
            otherMaterial: '',
            color: '',
            otherColor: '',
            priority: '',
            otherPriority: '',
            quantity: 1,
            notes: '',

        }
    })

    const material = form.watch('material')
    const color = form.watch('color')
    const priority = form.watch('priority')

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch("/api/address");
                const data = await res.json();
                if (data.status === "success") {
                    setAddresses(data.data.addresses);
                    if (data.data.addresses.length > 0) {
                        setSelectedAddressId(data.data.addresses[0]._id);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAddresses();
    }, []);
    useEffect(() => {
        if (addresses.length > 0) {
            setSelectedAddressId(addresses[0]._id);
            form.setValue('addressId', addresses[0]._id); // sync with form
        }
    }, [addresses, form]);


    // Require login before showing form
    if (status === 'loading') return <p>Loading...</p>
    if (!session?.user) return (
        <div className="mt-24 mb-8 text-center">
            <p className="mb-4">You must be logged in to request a custom 3D print.</p>
            <Button onClick={() => authDialogRef.current?.open()}>Login / Sign Up</Button>
            <AuthFormWrapper ref={authDialogRef} />
        </div>
    )

    async function onSubmit(values: z.infer<typeof custom3dProductRequestSchema>) {
        try {
            setIsLoading(true);

            let fileUrl = values.modelFileUrl;

            if (values.modelFile) {
                fileUrl = await uploadToBunny(values.modelFile); // <-- Upload
            } console.log(values, fileUrl)

            await custom3dProductRequest({
                ...values,
                modelFileUrl: fileUrl

            });

            form.reset();
            router.push('/dashboard/order-in-process');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }



    // Step navigation with validation
    const stepFields: Record<number, Array<keyof z.infer<typeof custom3dProductRequestSchema>>> = {
        1: ['modelFile'],
        2: ['material', 'color', 'priority', 'quantity', 'notes', 'otherMaterial', 'otherColor', 'otherPriority'],
        3: ['addressId']
    }


    function nextStep() {
        const fields = stepFields[step] || []
        form.trigger(fields).then(valid => {
            if (valid) setStep(s => s + 1)
        })
    }

    function prevStep() { if (step > 1) setStep(s => s - 1) }

    return (
        <div className="mt-24 mb-8">
            <AuthFormWrapper ref={authDialogRef} />
            <WidthCard>
                <h2 className="text-3xl font-bold text-center mb-4">Custom 3D Print Request</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto border rounded-xl p-6">

                        {/* Step Indicators */}
                        <div className="flex justify-between mb-6">
                            {['Upload', 'Variants', 'Address'].map((label, idx) => (
                                <div key={label} className={`flex-1 text-center ${step === idx + 1 ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
                                    {idx + 1}. {label}
                                </div>
                            ))}
                        </div>

                        {/* Step 1 */}
                        {step === 1 && (
                            <FormField control={form.control} name="modelFile" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload 3D Model</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept=".stl,.obj,.step,.glb"
                                            onChange={async (e) => {
                                                const selectedFile = e.target.files?.[0];
                                                field.onChange(selectedFile); // store file for validation

                                                if (!selectedFile) return;

                                                setIsModalUploading(true);
                                                setUploadProgress(0);

                                                try {
                                                    // Upload to BunnyCDN
                                                    const url = await uploadToBunny(selectedFile, (percent) => {
                                                        setUploadProgress(percent); // update loader
                                                    });

                                                    // Save only the URL in the form
                                                    form.setValue('modelFileUrl', url);
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(`File upload failed!,  ${JSON.stringify(err)}`);
                                                } finally {
                                                    setIsModalUploading(false);
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    {/* Progress Loader */}
                                    {isModalUploading && (
                                        <div className="mt-2">
                                            <p>Uploading: {uploadProgress}%</p>
                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                <div
                                                    className="bg-blue-500 h-2 rounded"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Success message */}
                                    {form.watch('modelFileUrl') && !isModalUploading && (
                                        <p className="mt-2 text-green-600">File uploaded successfully!</p>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )} />


                        )}

                        {/* Step 2 */}
                        {step === 2 && <>
                            <FormField control={form.control} name="material" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Material</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                            <option value="">Select material</option>
                                            {['PLA', 'ABS', 'PETG', 'TPU', 'Other', 'Not sure'].map(m => <option key={m} value={m}>{m}</option>)}
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

                            <FormField control={form.control} name="color" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                            <option value="">Select color</option>
                                            {['Black', 'White', 'Other', 'Not sure'].map(c => <option key={c} value={c}>{c}</option>)}
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

                            <FormField control={form.control} name="priority" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Print Priority</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                            <option value="">Select priority</option>
                                            {['Strength', 'Quality', 'Optimal', 'Not sure'].map(p => <option key={p} value={p}>{p}</option>)}
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

                            <FormField control={form.control} name="quantity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </>}

                        {/* Step 3 */}
                        {step === 3 && (
                            <div className="space-y-2">
                                <p className="font-semibold">Select Delivery Address:</p>
                                {addresses.length > 0 ? (
                                    <div className="space-y-1">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr._id}
                                                className={`p-2 border rounded cursor-pointer ${selectedAddressId === addr._id ? "border-blue-500 bg-blue-50" : ""}`}
                                                onClick={() => {
                                                    setSelectedAddressId(addr._id);
                                                    form.setValue('addressId', addr._id); // <-- update form state
                                                }}
                                            >
                                                <p>{addr.firstName} {addr.lastName}</p>
                                                <p>{addr.addressLine1}, {addr.addressLine2}</p>
                                                <p>{addr.city}, {addr.state}, {addr.country} - {addr.pinCode}</p>
                                                <p>Phone: {addr.phoneNumber}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No saved addresses found.</p>
                                )}

                                <AddAddressFormWrapper
                                    trigger={
                                        <Button variant="outline" size="sm">
                                            {addresses.length > 0 ? "Add Another Address" : "Add Address"}
                                        </Button>
                                    }
                                />
                            </div>
                        )}


                        {/* Step Navigation */}
                        <div className="flex justify-between">
                            {step > 1 && <Button type="button" variant="outline" onClick={prevStep}>Back</Button>}
                            {step < 3 && <Button type="button" onClick={nextStep}>Next</Button>}
                            {step === 3 && (
                                <Button type="submit" size="lg" className="ml-auto" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    {isLoading ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </WidthCard>
        </div>
    )
}
