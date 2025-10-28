'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React from 'react'
import { Checkbox } from '@/components/ui/checkbox' // ShadCN checkbox

interface FilterLinksProps {
    title: string
    paramKey: string
    items: string[]
}

const FilterLinks = ({ title, paramKey, items }: FilterLinksProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const handleChange = (value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        const existing = params.get(paramKey)?.split(',') || []

        let updated: string[]
        if (checked) {
            // add the value if not already present
            updated = Array.from(new Set([...existing, value]))
        } else {
            // remove the value
            updated = existing.filter((v) => v !== value)
        }

        if (updated.length > 0) {
            params.set(paramKey, updated.join(','))
        } else {
            params.delete(paramKey)
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const activeValues = searchParams.get(paramKey)?.split(',') || []

    return (
        <li>
            <h2 className='bg-accent-foreground text-secondary p-2 rounded-xl mb-4'>
                {title}
            </h2>
            <div className='space-y-2'>
                {items.map((item) => (
                    <label key={item} className='flex items-center space-x-2 cursor-pointer'>
                        <Checkbox
                            checked={activeValues.includes(item)}
                            onCheckedChange={(checked) =>
                                handleChange(item, Boolean(checked))
                            }
                        />
                        <span className='text-gray-700'>{item}</span>
                    </label>
                ))}
            </div>
        </li>
    )
}

export default FilterLinks
