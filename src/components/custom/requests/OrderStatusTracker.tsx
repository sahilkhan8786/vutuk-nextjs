'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import React from 'react'

const STATUS_STEPS = [
    "Request Submitted",
    "Under Verification",
    "Quotation Generated",
    "In Production",
    "Out for Delivery",
    "Delivered",
] as const;

type StatusStep = typeof STATUS_STEPS[number];

interface OrderStatusTrackerProps {
    currentStatus: StatusStep;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {


    const currentIndex = STATUS_STEPS.indexOf(currentStatus);

    return (
        <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-lg font-semibold text-center">Order Status</h2>
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
                {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isNextStep = index === currentIndex;

                    return (
                        <div key={step} className="flex-1 min-w-[120px] text-center">
                            <div className="flex items-center justify-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                    ${isCompleted ? 'bg-green-500 text-white' : isNextStep ? 'border-2 border-blue-500 text-blue-500' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    {isCompleted ? (
                                        <CheckCircle size={20} />
                                    ) : isNextStep ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                            </div>
                            <div className="text-xs mt-2">{step}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
