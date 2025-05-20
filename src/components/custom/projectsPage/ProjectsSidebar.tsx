import React from 'react'

const ProjectsSidebar = ({ className = "" }: {
    className?: string
}) => {
    return (
        <div className={`${className}  h-[450px] max-h-[450px] overflow-y-scroll`}>
            <ul className='space-y-4   transition-all my-8 px-2'>
                <li className='border border-dark p-2 flex items-center rounded-xl hover:bg-dark hover:text-light cursor-pointer '>All Projects</li>
                <li className='border border-dark p-2 flex items-center rounded-xl hover:bg-dark hover:text-light cursor-pointer '>Music Videos</li>

            </ul>
        </div>
    )
}

export default ProjectsSidebar