'use client'
import Image from 'next/image'
import React, { useState } from 'react'

export const FirstDiv = () => {
    const [activePotImage, setActivePotImage] = useState('https://i.etsystatic.com/59876780/r/il/05509a/6919495302/il_fullxfull.6919495302_fhwb.jpg');



    return (
        <div className='w-full h-full  border border-primary rounded-xl col-span-1 row-span-3'>
            <h2 className='text-center font-medium text-2xl my-4'>New Arrivals</h2>
            <div className='flex justify-center w-full '>

                <Image
                    src={activePotImage}
                    width={350} height={400} alt='Product-1'
                    className='rounded-xl hover:shadow-2xl'
                />
            </div>
            <div className='my-3 flex items-center  justify-between px-4 pt-2'>

                <h3 className=''>White Tiger and Rose Vase</h3>
                <h2>Price:- 999/-</h2>
            </div>
            <div className=' mb-2.5 '>

                <div className='gap-4 rounded-bl-xl rounded-br-xl  px-4 pb-[3px]'>
                    {/* <h3 className=''>Available Colors</h3> */}
                    <div className='flex items-center gap-4'>

                        <h4>Available Colors</h4>
                        <p className='size-4 bg-black rounded-xl border border-slate-700 hover:cursor-pointer hover:shadow'
                            onClick={() => setActivePotImage('https://i.etsystatic.com/59876780/r/il/26ea55/6967462467/il_fullxfull.6967462467_65lz.jpg')}
                        ></p>
                        <p className='size-4 bg-white rounded-xl border border-slate-700 hover:cursor-pointer hover:shadow'
                            onClick={() => setActivePotImage('https://i.etsystatic.com/59876780/r/il/05509a/6919495302/il_fullxfull.6919495302_fhwb.jpg')}
                        ></p>
                    </div>
                </div>
            </div>




        </div>
    )
}
