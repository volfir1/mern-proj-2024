import React from "react";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardRoundedIcon />,
        link: "/admin/home",
    },
    {
        title: "Products",
        icon: <MenuBookRoundedIcon />,
        link: "/admin/products", // Point to the route for products
    },
    {
        title: "Orders",
        icon: <AccessTimeFilledRoundedIcon />,
        link: "/admin/orders",
    },
    {
        title: "Inventory",
        icon: <Inventory2RoundedIcon />,
        link: "/admin/inventory",
    },
    {
        title: "Suppliers",
        icon: <LocalShippingRoundedIcon />,
        link: "/admin/suppliers",
    },
    {
        title: "Users",
        icon: <PeopleRoundedIcon />,
        link: "/admin/users",
    },
];
