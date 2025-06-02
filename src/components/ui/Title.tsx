import React from 'react'

const Title = ({ heading, description }: {
    heading: string,
    description: string
}) => {
    return (
        <div className='text-center border-b-light border-b-2 pb-2'>
            <h1 className='text-7xl font-bebas'>{heading}</h1>
            <p className='text-dark opacity-70 '>{description}</p>
        </div>
    )
}

export default Title