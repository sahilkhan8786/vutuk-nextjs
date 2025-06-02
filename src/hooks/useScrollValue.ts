import { useEffect, useState } from "react";

function useScrollValue() {
    
 const [isScrolled, setIsScrolled] = useState<boolean>(false);

 useEffect(() => {
        function handleScroll() {
            const scrollY = window.scrollY;

            if (scrollY > 80) {
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