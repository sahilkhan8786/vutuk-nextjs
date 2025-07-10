
import { AppSidebar } from "@/components/custom/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import './../../globals.css'
import { Bebas_Neue, Rubik } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/custom/header/Header";
import { CartContextProvider } from "@/context/cart-context";
import { adminSidebarNav } from "@/constants/appsidebar";
import { SessionProvider } from "next-auth/react";

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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <html lang="en">
            <body
                className={`${bebas.variable} ${rubik.variable} antialiased mt-14`}

            >

                <SessionProvider>

                    <CartContextProvider>
                        <Header />
                    </CartContextProvider>
                    <Toaster richColors position="top-center" />

                    <SidebarProvider defaultOpen={defaultOpen}>
                        <AppSidebar items={adminSidebarNav} />
                        <main className="w-full overflow-hidden p-4">
                            <SidebarTrigger className="cursor-pointer" />
                            {children}
                        </main>
                    </SidebarProvider>
                </SessionProvider>
            </body>
        </html>
    )
}