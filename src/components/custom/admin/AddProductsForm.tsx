'use client';

import React, { useState } from 'react';
import { createproductsFromCSV } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // or your preferred toast library

type Props = {
    onClose: () => void; // pass from parent to close drawer manually
};

const AddProductsForm = ({ onClose }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createproductsFromCSV(formData);
            toast.success('Products uploaded successfully');
            onClose(); // programmatically close the drawer
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-4">
                <Input type="file" accept=".csv" name="file" required />
            </div>

            <DrawerFooter>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </DrawerFooter>
        </form>
    );
};

export default AddProductsForm;
