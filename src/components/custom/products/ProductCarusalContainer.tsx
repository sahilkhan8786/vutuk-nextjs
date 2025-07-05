import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import ProductsCarousel from './ProductsCarousal'

const ProductCarusalContainer = ({ title }: {
    title?: string
}) => {
    return (
        <>
            <WidthCard className=' border rounded-xl p-4 my-4'>
                <h2 className='text-dark font-semibold text-2xl py-3'>{title}</h2>
                <ProductsCarousel />

            </WidthCard>
        </>
    )
}

export default ProductCarusalContainer