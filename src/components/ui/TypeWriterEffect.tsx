import React from 'react'
import Typewriter from 'typewriter-effect'

interface TypewriterTextProps {
    strings: string[]
    loop?: boolean
    className?: string
}

const TypeWriterEffect: React.FC<TypewriterTextProps> = ({
    strings,
    loop = true,
    className = ''
}) => {
    return (
        <div className={`text-5xl font-semibold ${className}`}>
            <Typewriter
                options={{
                    strings: strings,
                    autoStart: true,
                    loop: loop,
                    delay: 60,
                    deleteSpeed: 30,
                }}
            />
        </div>
    )
}

export default TypeWriterEffect