'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ResponsiveContainer,
} from 'recharts'

import PaymentTable from '@/components/custom/admin/payments/PaymentTable'
import { Payment, User, Product, RechartsPieData, RechartsBarData } from '@/types/admin'

const colors = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b']

const AdminDashboard: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch and normalize data
    useEffect(() => {
        fetch('/api/admin/payments')
            .then(res => res.json())
            .then((data: Payment[]) => {
                const normalized = data.map(p => ({
                    ...p,
                    amount: Number(p.amount) || 0, // ensure amount is number
                    method: p.method || 'unknown',
                    email: p.email || '',
                    contact: p.contact || '',
                    status: p.status || 'pending',
                    createdAt: p.createdAt || new Date().toISOString(),
                }))
                setPayments(normalized)
                setFilteredPayments(normalized)
            })

        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers((data.data.users as User[]) || []))

        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts((data.data.products as Product[]) || []))
    }, [])

    // Filter payments by search
    useEffect(() => {
        if (!searchTerm) return setFilteredPayments(payments)
        setFilteredPayments(
            payments.filter(p =>
                [p.email, p.contact].some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        )
    }, [payments, searchTerm])

    // Metrics
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalPayments = filteredPayments.length
    const successfulPayments = filteredPayments.filter(p => p.status === 'captured').length
    const failedPayments = filteredPayments.filter(p => p.status === 'failed').length
    const totalUsers = users.length
    const totalProducts = products.length

    // Charts data
    const revenueOverTime = Object.entries(
        filteredPayments.reduce<Record<string, number>>((acc, p) => {
            const day = format(new Date(p.createdAt), 'yyyy-MM-dd')
            acc[day] = (acc[day] || 0) + p.amount
            return acc
        }, {})
    ).map(([date, amount]) => ({ date, amount }))

    const statusData: RechartsPieData[] = ['captured', 'failed', 'pending'].map(s => ({
        name: s,
        value: filteredPayments.filter(p => p.status === s).length,
    }))

    const methodSet = Array.from(new Set(filteredPayments.map(p => p.method || 'unknown')))
    const methodData: RechartsBarData[] = methodSet.map(m => ({
        method: m,
        count: filteredPayments.filter(p => (p.method || 'unknown') === m).length,
    }))

    const customerMap: Record<string, number> = filteredPayments.reduce<Record<string, number>>(
        (acc, p) => {
            const key = p.email || p.contact || 'unknown'
            acc[key] = (acc[key] || 0) + p.amount
            return acc
        },
        {}
    )

    const topCustomers: RechartsBarData[] = Object.entries(customerMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([customer, amount]) => ({ customer, amount }))

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Total Revenue</h2>
                    <p className="text-xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Total Payments</h2>
                    <p className="text-xl font-bold">{totalPayments}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Successful Payments</h2>
                    <p className="text-xl font-bold">{successfulPayments}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Failed Payments</h2>
                    <p className="text-xl font-bold">{failedPayments}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Total Users</h2>
                    <p className="text-xl font-bold">{totalUsers}</p>
                </div>
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Total Products</h2>
                    <p className="text-xl font-bold">{totalProducts}</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search by customer"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-2 border rounded flex-1"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Over Time */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Revenue Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={revenueOverTime}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="amount" stroke="#4f46e5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Status */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Payment Status</h3>
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
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Payment Method</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={methodData}>
                            <XAxis dataKey="method" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Customers */}
                <div className="p-4 bg-white shadow rounded h-72 md:col-span-3">
                    <h3 className="font-bold mb-2">Top Customers</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={topCustomers} layout="vertical">
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="customer" />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Payments Table */}
            <PaymentTable payments={filteredPayments} />
        </div>
    )
}

export default AdminDashboard
