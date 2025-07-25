'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export interface Stream {
    _id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}

import { createStream, deleteStream } from '@/actions/streams';

const AdminStreamsPage = () => {
    const [showInput, setShowInput] = useState(false);
    const [value, setValue] = useState('');
    const [streams, setStreams] = useState<Stream[]>([]);

    useEffect(() => {
        loadStreams();
    }, []);

    const loadStreams = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/streams`);
            const json = await res.json();
            console.log(json)
            if (json.success) {
                setStreams(json.data.streams); // ← Fix is here: assign the fetched data to state
            } else {
                toast.error(json.message || 'Failed to fetch streams');
            }
        } catch (err) {
            console.error('Failed to load streams:', err);
            toast.error('Error loading streams');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return toast.error('Stream name is required');

        const res = await createStream(value);
        if (res.success) {
            toast.success(res.message);
            setValue('');
            setShowInput(false);
            loadStreams();
        } else {
            toast.error(res.message);
        }
    };

    const handleDelete = async (id: string) => {
        const res = await deleteStream(id);
        if (res.success) {
            toast.success('Stream deleted');
            loadStreams();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            {!showInput && (
                <Button onClick={() => setShowInput(true)}>Add Stream</Button>
            )}

            {showInput && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        placeholder="Enter stream name"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <Button type="submit">Save</Button>
                </form>
            )}

            <div className="space-y-2">
                {streams.map((stream) => (
                    <div
                        key={stream._id}
                        className="flex justify-between items-center border px-4 py-2 rounded shadow-sm"
                    >
                        <span>{stream.value}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(stream._id)}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminStreamsPage;
