import { heroMainData } from "@/constants/heromain";
import { usePathname, useSearchParams } from "next/navigation";

function useCurrentRoute() {
     const pathname = usePathname()
        const searchParams = useSearchParams();
    
        const currentUrl = `${pathname}?${searchParams.toString()}`
    
        const activeService = currentUrl.split('=')[1];
    const activeData = heroMainData.find(data => data.service === activeService)
    
    return { activeService, activeData };

}

export default useCurrentRoute;