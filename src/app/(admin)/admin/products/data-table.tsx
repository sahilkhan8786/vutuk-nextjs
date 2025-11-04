"use client"

import React, { useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    PaginationState,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount?: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount = -1,
}: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [filterField, setFilterField] = useState<string>("title")

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
            columnFilters,
        },
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: false,
        autoResetPageIndex: false,
        pageCount: pageCount > 0 ? pageCount : undefined,
    })

    const currentFilterValue = table.getColumn(filterField)?.getFilterValue() ?? ""

    // Render appropriate input based on selected filter field
    const renderFilterInput = () => {
        switch (filterField) {
            case "hasConfigurations":
                return (
                    <Select
                        onValueChange={(value) =>
                            table
                                .getColumn("hasConfigurations")
                                ?.setFilterValue(
                                    value === "true" ? true : value === "false" ? false : ""
                                )
                        }
                        value={
                            table.getColumn("hasConfigurations")?.getFilterValue() === true
                                ? "true"
                                : table.getColumn("hasConfigurations")?.getFilterValue() ===
                                    false
                                    ? "false"
                                    : ""
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Configured ✅</SelectItem>
                            <SelectItem value="false">Unconfigured ❌</SelectItem>
                        </SelectContent>
                    </Select>
                )



            default:
                // title, sku, slug, etc.
                return (
                    <Input
                        placeholder={`Enter ${filterField}`}
                        value={currentFilterValue as string}
                        onChange={(e) =>
                            table.getColumn(filterField)?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                )
        }
    }

    return (
        <div className="rounded-md border">
            {/* 🔍 Filter Controls */}
            <div className="flex items-center py-4 justify-start gap-4 px-4">
                <Select value={filterField} onValueChange={setFilterField}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select Filter Field" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title">Product Title</SelectItem>
                        <SelectItem value="sku">SKU</SelectItem>
                        <SelectItem value="hasConfigurations">Is Configured</SelectItem>
                    </SelectContent>
                </Select>

                {renderFilterInput()}
            </div>

            {/* 🧾 Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* 📄 Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4 px-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {pagination.pageIndex + 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
