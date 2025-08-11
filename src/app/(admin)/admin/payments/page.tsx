"use client";

import React, { useEffect, useState } from "react";

interface Payment {
    _id: string;
    orderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    method?: string;
    email?: string;
    contact?: string;
    createdAt: string;
}

const AdminPaymentsPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        fetch("/api/admin/payments")
            .then(res => res.json())
            .then(data => setPayments(data));
    }, []);

    console.log(payments)

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Payments</h1>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Order ID</th>
                        <th className="p-2 border">Payment ID</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Method</th>
                        <th className="p-2 border">Customer</th>
                        <th className="p-2 border">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p._id} className="border-t">
                            <td className="p-2 border">{p.orderId}</td>
                            <td className="p-2 border">{p.paymentId}</td>
                            <td className="p-2 border">₹{p.amount}</td>
                            <td className="p-2 border">{p.status}</td>
                            <td className="p-2 border">{p.method || "-"}</td>
                            <td className="p-2 border">{p.email || p.contact}</td>
                            <td className="p-2 border">
                                {new Date(p.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPaymentsPage;
