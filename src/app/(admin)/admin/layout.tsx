
import { AppSidebar } from "@/components/custom/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import './../../globals.css'
import { Bebas_Neue, Rubik } from "next/font/google";

const bebas = Bebas_Neue({
    variable: "--font-bebas",
    subsets: ["latin"],
    weight: ['400']
});

const rubik = Rubik({
    variable: "--font-rubik",
    subsets: ["latin"],
    weight: ['300', '400', '500', '600', '700', '800', '900']
});

export default async function Layout({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <html lang="en">
            <body
                className={`${bebas.variable} ${rubik.variable} antialiased`}
            >


                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar />
                    <main className="w-full overflow-hidden p-4">
                        <SidebarTrigger className="cursor-pointer" />
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    )
}