import { AppSidebarProps } from "@/components/custom/app-sidebar";
import { BookCopy, CurrencyIcon, FileStackIcon, HeartIcon, Home, MessageSquareIcon, Newspaper, Package, PlusSquare, ProjectorIcon, Settings, ShoppingBasket, UserIcon, Users } from "lucide-react";

export const adminSidebarNav: AppSidebarProps[] = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Payments",
        url: "/admin/payments",
        icon: CurrencyIcon,
    },
    {
        title: "Stream",
        url: "/admin/streams",
        icon: FileStackIcon,
    },
    {
        title: "Team",
        url: "/admin/team",
        icon: Users,
    },
    {
        title: "Services",
        url: "/admin/services",
        icon: BookCopy,
    },
    {
        title: "Projects",
        url: "/admin/projects",
        icon: ProjectorIcon,
    },
    {
        title: "Blogs",
        url: "/admin/blogs",
        icon: Newspaper,
    },
    {
        title: "Chats",
        url: "/admin/chats",
        icon: MessageSquareIcon,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingBasket,
    },
    {
        title: "Additonal Data",
        url: "/admin/additional-data",
        icon: PlusSquare,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: Settings,
    },
    {
        title: "Completed Orders",
        url: "/admin/completed-orders",
        icon: Settings,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Settings,
    },
    {
        title: "3D Print On Demand",
        url: "/admin/3d-print-on-demand",
        icon: Settings,
    },
]

export const userSidebarNav: AppSidebarProps[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Orders",
        url: "/dashboard/orders",
        icon: Package,
    },
    {
        title: "Favorites",
        url: "/dashboard/favourites",
        icon: HeartIcon,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserIcon,
    },
    {
        title: "3D Prints On Demand",
        url: "/dashboard/order-in-process",
        icon: Settings,
    },
    {
        title: "Support",
        url: "/dashboard/support",
        icon: UserIcon,
    },
]