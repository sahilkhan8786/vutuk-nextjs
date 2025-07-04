import { AppSidebarProps } from "@/components/custom/app-sidebar";
import { BookCopy, HeartIcon, Home, Newspaper, Package, PlusSquare, ProjectorIcon, Settings, ShoppingBasket, UserIcon, Users } from "lucide-react";

export const adminSidebarNav: AppSidebarProps[] = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
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
]