'use client'

import React, { ReactNode, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import YouTubePlayer from '../YouTubePlayer'

type Project = {
    _id: string;
    projectName: string;
    description: string;
    image: string;
    stream: string;
    contentType: 'data' | 'web';
    websiteUrl?: string;
    projectData?: string[];
    relatedToService?: string;
    slug?: string;
};

const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be")
}

const extractYouTubeVideoId = (url: string): string | null => {
    try {
        const parsedUrl = new URL(url)
        if (parsedUrl.hostname === 'youtu.be') {
            return parsedUrl.pathname.slice(1)
        }
        if (parsedUrl.hostname.includes('youtube.com')) {
            return parsedUrl.searchParams.get('v')
        }
    } catch (err) {
        console.error(err)
        return null
    }
    return null
}

const ProjectDetailsWrapper = ({ trigger, project }: {
    trigger?: ReactNode,
    project: Project
}) => {
    const [activeMedia, setActiveMedia] = useState(project.projectData?.[0] || "")

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className='max-w-5xl'>
                <DialogHeader>
                    <DialogTitle>{project.projectName}</DialogTitle>
                    <DialogDescription>{project.description}</DialogDescription>
                </DialogHeader>

                {project.contentType === 'data' && (
                    <div className='flex flex-col gap-4'>
                        {/* Main Preview */}
                        <div className='w-full h-[60vh] bg-black relative flex items-center justify-center rounded overflow-hidden'>
                            {isYouTubeUrl(activeMedia) ? (
                                <div className='w-full h-full'>
                                    <YouTubePlayer videoId={extractYouTubeVideoId(activeMedia) || ''} />
                                </div>
                            ) : (
                                <Image
                                    src={activeMedia}
                                    alt='Project Media'
                                    fill
                                    className='object-contain'
                                />
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className='flex gap-3 overflow-x-auto py-2'>
                            {project.projectData?.map((media, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveMedia(media)}
                                    className={`cursor-pointer w-24 h-16 rounded overflow-hidden border ${media === activeMedia ? 'border-primary' : 'border-muted'}`}
                                >
                                    {isYouTubeUrl(media) ? (
                                        <div className='w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs'>
                                            🎥 YouTube
                                        </div>
                                    ) : (
                                        <Image
                                            src={media}
                                            alt={`Thumbnail ${index}`}
                                            width={96}
                                            height={64}
                                            className='object-cover'
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectDetailsWrapper
