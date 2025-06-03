import { useEffect, useState } from "react";

function useScrollValue({ scrollValue=80 }: {
    scrollValue?:number
}) {
    
 const [isScrolled, setIsScrolled] = useState<boolean>(false);

 useEffect(() => {
        function handleScroll() {
            const scrollY = window.scrollY;

            if (scrollY > scrollValue) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);

 }, [])
    
    return { isScrolled };
}

export default useScrollValue;