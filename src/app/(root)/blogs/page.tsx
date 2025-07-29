import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const BlogsPage = () => {
    return (
        <div className=' mt-24'>
            <Title
                heading='Blogs'
                description='Browse all blog posts from Vutuk. Explore tutorials, industry news, case studies, and insights on web development, design, and tech trends.'
            />
            <WidthCard className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 mt-12'>

                <SingleBlog />
                <SingleBlog />
                <SingleBlog />
                <SingleBlog />
            </WidthCard>
        </div>
    )
}

export default BlogsPage;


function SingleBlog() {
    return (
        <Link href={'/blogs/1'} className='border rounded-xl hover:-translate-y-1 hover:translate-x-1 transition-all hover:shadow'>
            <Image
                src={'/form-1.png'}
                alt='Image-1'
                width={250}
                height={250}
                className='rounded-xl'
            />
            <div className='p-4'>

                <h2>BLOG TITLE</h2>
                <p>Blog Summary</p>

                <p className='text-muted-foreground text-end'>DATE</p>
            </div>
        </Link>
    )
}