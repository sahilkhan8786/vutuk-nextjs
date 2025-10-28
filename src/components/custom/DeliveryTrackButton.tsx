"use client";

import React, { JSX, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Package, CheckCircle } from "lucide-react";

interface TrackingHistoryItem {
    status: string;
    location: string;
    date: string;
}

interface TrackingData {
    trackingId: string;
    status: string;
    history: TrackingHistoryItem[];
    estimatedDelivery: string;
}

interface DeliveryTrackButtonProps {
    trackingId?: string;
}

const iconMap: Record<string, JSX.Element> = {
    "Shipment Created": <Package className="w-5 h-5 text-blue-500" />,
    "Picked Up": <Truck className="w-5 h-5 text-orange-500" />,
    "In Transit": <Truck className="w-5 h-5 text-purple-500" />,
    "Out for Delivery": <MapPin className="w-5 h-5 text-green-500" />,
    Delivered: <CheckCircle className="w-5 h-5 text-emerald-500" />,
};

const DeliveryTrackButton: React.FC<DeliveryTrackButtonProps> = ({ trackingId }) => {
    const [open, setOpen] = useState(false);
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

    const handleTrack = async () => {
        if (!trackingId) {
            alert("No tracking ID available for this order.");
            return;
        }

        const res = await fetch(`/api/delhivery/track?id=${trackingId}`);
        const data = await res.json();
        console.log(data)
        setTrackingData(data || []);
        setOpen(true);
    };

    return (
        <>
            <Button onClick={handleTrack} className="">
                Track Package
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tracking Details</DialogTitle>
                    </DialogHeader>

                    {trackingData ? (
                        <div className="space-y-4">
                            <Card className="p-4">
                                <p className="text-sm text-gray-600">
                                    Tracking ID: <span className="font-semibold">{trackingData.trackingId}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Current Status:{" "}
                                    <Badge className="ml-2">{trackingData.status}</Badge>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Estimated Delivery:{" "}
                                    <span className="font-semibold">{trackingData.estimatedDelivery}</span>
                                </p>
                            </Card>

                            <div className="space-y-3">
                                {trackingData.history.map((event, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 border-l-2 border-gray-200 pl-4 relative"
                                    >
                                        <div className="absolute -left-3 top-0 bg-white rounded-full">
                                            {iconMap[event.status] || (
                                                <Package className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{event.status}</p>
                                            <p className="text-sm text-gray-500">{event.location}</p>
                                            <p className="text-xs text-gray-400">{event.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeliveryTrackButton;
