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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PaymentTable from '@/components/custom/admin/payments/PaymentTable'

interface Payment {
    _id: string
    orderId: string
    paymentId: string
    amount: number | string
    currency: string
    status: 'captured' | 'failed' | 'pending' | string
    method?: string | null
    email?: string | null
    contact?: string | null
    createdAt: string
}

interface LineDataItem {
    date: string
    amount: number
}

interface RechartsPieData {
    [key: string]: string | number
    name: string
    value: number
}
interface BarDataItem {
    method: string
    count: number
}

const colors = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b']

const AdminPaymentsDashboard: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([])
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [methodFilter, setMethodFilter] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch payments
    useEffect(() => {
        fetch('/api/admin/payments')
            .then((res) => res.json())
            .then((data: Payment[]) => {
                setPayments(data)
                setFilteredPayments(data)
            })
            .catch((err) => console.error('Failed to fetch payments', err))
    }, [])

    // Filter payments
    useEffect(() => {
        let filtered = [...payments]

        if (statusFilter !== 'all') {
            filtered = filtered.filter((p) => p.status === statusFilter)
        }

        if (methodFilter !== 'all') {
            filtered = filtered.filter((p) => (p.method || 'unknown') === methodFilter)
        }

        if (searchTerm) {
            filtered = filtered.filter((p) =>
                [p.email, p.contact].some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        setFilteredPayments(filtered)
    }, [payments, statusFilter, methodFilter, searchTerm])

    // Prepare charts data
    const lineData: LineDataItem[] = Object.entries(
        filteredPayments.reduce<Record<string, number>>((acc, p) => {
            const day = format(new Date(p.createdAt), 'yyyy-MM-dd')
            const amount = typeof p.amount === 'string' ? Number(p.amount) || 0 : p.amount || 0
            acc[day] = (acc[day] || 0) + amount
            return acc
        }, {})
    ).map(([date, amount]) => ({ date, amount }))

    const statusData: RechartsPieData[] = ['captured', 'failed', 'pending'].map((status) => ({
        name: status,
        value: filteredPayments.filter((p) => p.status === status).length,
    }))


    const methodSet = Array.from(new Set(filteredPayments.map((p) => p.method || 'unknown')))
    const methodData: BarDataItem[] = methodSet.map((m) => ({
        method: m,
        count: filteredPayments.filter((p) => (p.method || 'unknown') === m).length,
    }))

    const totalRevenue = filteredPayments.reduce((sum, p) => {
        const amount = typeof p.amount === 'string' ? Number(p.amount) || 0 : p.amount || 0
        return sum + amount
    }, 0)

    const totalPayments = filteredPayments.length
    const successfulPayments = filteredPayments.filter((p) => p.status === 'captured').length
    const failedPayments = filteredPayments.filter((p) => p.status === 'failed').length

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Payments Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white shadow rounded">
                    <h2 className="text-gray-500">Total Revenue</h2>
                    <p className="text-xl font-bold">₹{totalRevenue}</p>
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
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <Input
                    placeholder="Search by customer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="captured">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={setMethodFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {methodSet.map((m) => (
                            <SelectItem key={m} value={m}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Over Time */}
                <div className="p-4 bg-white shadow rounded h-72">
                    <h3 className="font-bold mb-2">Revenue Over Time</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={lineData}>
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
                            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60}>
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
            </div>

            {/* Table */}
            <PaymentTable
                payments={filteredPayments.map((p) => ({
                    ...p,
                    amount: typeof p.amount === 'string' ? Number(p.amount) || 0 : p.amount,
                }))}
            />
        </div>
    )
}

export default AdminPaymentsDashboard
