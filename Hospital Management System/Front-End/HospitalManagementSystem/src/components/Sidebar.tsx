

import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton
} from "@mui/material";
import {
    People,
    Menu,
    Logout,
    EventNote,
    CalendarToday,
    Dashboard
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";

const Sidebar: React.FC = () => {
    const location = useLocation();
    if (location.pathname === "/") return null;

    const [open, setOpen] = useState(false);
    const role = useAuthStore((s) => s.role);

    const toggleDrawer = (nextOpen: boolean) => () => {
        setOpen(nextOpen);
    };

    const menuItems = [
        { text: "Dashboard", icon: <Dashboard />, path: "/admin", allowedRoles: ["Admin"] },
        { text: "Patients", icon: <People />, path: "/admin/patients", allowedRoles: ["Admin"] },
        { text: "Doctors", icon: <People />, path: "/admin/doctors", allowedRoles: ["Admin"] },
        { text: "Appointments", icon: <CalendarToday />, path: "/admin/appointments", allowedRoles: ["Admin"] },

        { text: "My Profile", icon: <People />, path: "/patient", allowedRoles: ["Patient"] },
        { text: "My Appointments", icon: <CalendarToday />, path: "/patient/my-appointments", allowedRoles: ["Patient"] },
        { text: "Book Appointment", icon: <EventNote />, path: "/patient/book-appointment", allowedRoles: ["Patient"] },

        { text: "My Profile", icon: <People />, path: "/doctor", allowedRoles: ["Doctor"] },
        { text: "My Appointments", icon: <CalendarToday />, path: "/doctor/my-appointments", allowedRoles: ["Doctor"] },

        { text: "Logout", icon: <Logout />, path: "/patient/logout", allowedRoles: ["Patient"] },
        { text: "Logout", icon: <Logout />, path: "/doctor/logout", allowedRoles: ["Doctor"] },
        { text: "Logout", icon: <Logout />, path: "/admin/logout", allowedRoles: ["Admin"] }
    ];

    const filteredItems = menuItems.filter(
        (item) => role !== null && item.allowedRoles.includes(role)
    );

    return (
        <>
            <IconButton
                onClick={toggleDrawer(true)}
                sx={{ position: "absolute", top: 20, left: 20 }}
            >
                <Menu />
            </IconButton>

            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <List sx={{ width: 250 }}>
                    {filteredItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={toggleDrawer(false)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Sidebar;
