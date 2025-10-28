'use client'

import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts'

interface OrderItem {
    name: string
    quantity: number
    price: number
}

interface Order {
    _id: string
    items: OrderItem[]
    totalAmount: number
    status: 'pending' | 'completed' | string
    createdAt: string
}

const colors = ['#4f46e5', '#10b981', '#f59e0b']

const UserDashboardPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        fetch('/api/requests')
            .then((res) => res.json())
            .then((data) => setOrders(data.data.requests || []))
    }, [])

    // Summary Metrics
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

    // Orders over time
    const ordersOverTime = Object.entries(
        orders.reduce<Record<string, number>>((acc, o) => {
            const day = new Date(o.createdAt).toISOString().split('T')[0]
            acc[day] = (acc[day] || 0) + 1
            return acc
        }, {})
    ).map(([date, count]) => ({ date, count }))

    // Status distribution
    const statusData = ['pending', 'completed'].map((status) => ({
        name: status,
        value: orders.filter((o) => o.status === status).length,
    }))

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">My Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white shadow rounded text-center">
                    <h2 className="text-gray-500">Total Orders</h2>
                    <p className="text-xl font-bold">{totalOrders}</p>
                </div>
                <div className="p-4 bg-white shadow rounded text-center">
                    <h2 className="text-gray-500">Pending Orders</h2>
                    <p className="text-xl font-bold">{pendingOrders}</p>
                </div>
                <div className="p-4 bg-white shadow rounded text-center">
                    <h2 className="text-gray-500">Total Spent</h2>
                    <p className="text-xl font-bold">₹{totalSpent}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders Over Time */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Orders Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={ordersOverTime}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#4f46e5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Order Status</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={40}
                                outerRadius={60}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={index} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-4">All Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Order ID</th>
                                <th className="p-2 border">Products</th>
                                <th className="p-2 border">Total Amount</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-t">
                                    <td className="p-2 border">{order._id}</td>
                                    <td className="p-2 border">
                                        {order.items.map((i) => i.name).join(', ')}
                                    </td>
                                    <td className="p-2 border">₹{order.totalAmount}</td>
                                    <td className="p-2 border">{order.status}</td>
                                    <td className="p-2 border">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserDashboardPage
