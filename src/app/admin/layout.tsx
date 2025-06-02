
import { AppSidebar } from "@/components/custom/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"


export default async function Layout({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full overflow-hidden p-4">
                <SidebarTrigger className="mt-16 cursor-pointer" />
                {children}
            </main>
        </SidebarProvider>
    )
}