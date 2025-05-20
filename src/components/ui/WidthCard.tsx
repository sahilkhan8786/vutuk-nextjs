import React, { ReactNode } from 'react'

const WidthCard = ({ children, className }: {
    children: ReactNode,
    className?: string
}) => {
    return (
        <div className={`max-w-[1536px] mx-auto px-2 ${className}`}>{children}</div>
    )
}

export default WidthCard