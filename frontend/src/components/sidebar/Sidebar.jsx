import React, { useRef } from "react";
import { SidebarData } from "./SidebarData";
import { useToggleDarkMode, useToggleClose } from "./SidebarScript";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeRoundedIcon from "@mui/icons-material/NightsStayRounded"; // Assuming this icon is for dark mode
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import "./sidebar.css";

export default function Sidebar() {
    const sidebarRef = useRef(null),
        { isDarkMode, ToggleDarkMode } = useToggleDarkMode(sidebarRef),
        { isClosed, toggleSidebar } = useToggleClose(sidebarRef);

    return (
        <div ref={sidebarRef} className="SidebarContainer">
            <nav className={`sidebar ${isClosed ? "close" : ""}`}>
                <header>
                    <div className="img-text">
                        <span className="sidebar-image">
                            <img
                                src="./assets/logos/bake-remove.png"
                                alt="logo"
                            />
                        </span>

                        <div className="text header-text">
                            <span className="name">Lester</span>
                            <span className="profession">Web Developer</span>
                        </div>
                    </div>

                    <i
                        className="bx bx-chevron-right toggle"
                        onClick={toggleSidebar}
                    ></i>
                </header>

                <div className="menu-bar">
                    {/* Main menu items */}
                    <div className="menu">
                        <ul className="nav-link">
                            {SidebarData.map((val, key) => (
                                <li
                                    key={key}
                                    className="row"
                                    id={
                                        window.location.pathname === val.link
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        window.location.pathname = val.link;
                                    }}
                                >
                                    <div id="icon">{val.icon}</div>
                                    <div id="title">{val.title}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom items: Logout and Dark Mode */}
                    <div className="bottom-items">
                        <li className="row" id="mode" onClick={ToggleDarkMode}>
                            <div className="moon-sun">
                                {isDarkMode ? (
                                    <DarkModeRoundedIcon className="dark-icon" />
                                ) : (
                                    <LightModeRoundedIcon className="light-icon" />
                                )}
                            </div>
                            <span id="title" className="mode-text text">
                                {isDarkMode ? "Dark" : "Light"}
                            </span>

                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>

                        <ul className="nav-link">
                            <li
                                className="row"
                                onClick={() => {
                                    window.location.pathname = "/logout";
                                }}
                            >
                                <div id="icon">
                                    <LogoutRoundedIcon />
                                </div>
                                <div id="title">Logout</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
