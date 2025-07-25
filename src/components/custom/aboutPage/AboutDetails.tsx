import WidthCard from '@/components/ui/WidthCard'
import { AboutDetailsProps } from '@/types/types'
import Image from 'next/image'
import React from 'react'

const AboutDetails = ({ data }: {
    data: AboutDetailsProps
}) => {
    return (
        <div className='bg-white'>

            <WidthCard className='grid grid-cols-1  md:grid-cols-3 rounded-xl  flex-row-reverse py-6'>

                {!data.isReverse ? <>
                    <div className='col-span-2 text-center flex flex-col mt-6 space-y-6'>
                        <h2 className='font-bebas font-semibold text-4xl mt-6'>{data.title}</h2>
                        {data.description.map(list => <p key={list}>{list}</p>)}
                    </div>
                    <Image src={data.image}
                        alt='Vutuk Design'
                        width={500}
                        height={500}
                        className='col-span-1'
                    />
                </> : <>
                    <Image src={data.image}
                        alt='Vutuk Design'
                        width={500}
                        height={500}
                        className='col-span-1'
                    />
                    <div className='col-span-2 text-center flex flex-col mt-6 space-y-6'>
                        <h2 className='font-bebas font-semibold text-4xl mt-6'>{data.title}</h2>
                        {data.description.map(list => <p key={list}>{list}</p>)}
                    </div>

                </>}


            </WidthCard>
        </div>
    )
}

export default AboutDetails