'use client'
import { Button } from "@/components/ui/button"
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
import { Tv } from "lucide-react"
import { useState } from "react"

const getEmbedLink = (youtubeLink: string) => {
    let videoId = '';

    // Standard watch?v= format
    if (youtubeLink.includes('watch?v=')) {
        videoId = youtubeLink.split('watch?v=')[1].split('&')[0];
    }
    // Shortened youtu.be format
    else if (youtubeLink.includes('youtu.be/')) {
        videoId = youtubeLink.split('youtu.be/')[1].split('?')[0];
    }
    else {
        return youtubeLink; // fallback if already embed
    }

    return `https://www.youtube.com/embed/${videoId}`;
};

export function WatchLive({ youtubeLink }: { youtubeLink?: string }) {
    const [open, setOpen] = useState<boolean>(false)
    console.log(youtubeLink)

    if (!youtubeLink) return null;


    // Convert normal YouTube link to embed link
    const embedLink = getEmbedLink(youtubeLink);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex items-center justify-center'>
                    <Tv /> <span>Watch It Live</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[1200px] w-full">
                <DialogHeader>
                    <DialogTitle>Live Production</DialogTitle>
                    <DialogDescription>
                        Your product is printing live here
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full aspect-video mt-4">
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedLink}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
