import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData"; // Adjust the path to SidebarData
import {
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"; // Import necessary icons from Heroicons
import LoadingFallback from "../ui/loader";

const SidebarItem = ({ icon, title, link, isOpen }) => {
  const navigate = useNavigate();
  return (
    <div
      className="group relative flex items-center p-2 mt-2 cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white"
      onClick={() => navigate(link)}
    >
      <div className="flex items-center justify-center min-w-[60px] group-hover:text-white text-gray-800">
        {icon}
      </div>
      <span
        className={`font-light transition-all duration-200 text-gray-800 group-hover:text-white ${
          isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
        }`}
      >
        {title}
      </span>
    </div>
  );
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("mouseenter", handleMouseEnter);
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mouseenter", handleMouseEnter);
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`font-helvetica fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 overflow-hidden border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
            L
          </div>
          <div
            className={`transition-all duration-300 ml-3 ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <h2 className="font-light text-gray-800 uppercase tracking-wide">
              Lester
            </h2>
            <p className="text-xs text-gray-600 uppercase">Web Developer</p>
          </div>
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2">
          {SidebarData.map((item, index) => (
            <Suspense fallback={<LoadingFallback />} key={item.title || index}>
              <SidebarItem
                icon={item.icon}
                title={item.title}
                link={item.link}
                isOpen={isOpen}
              />
            </Suspense>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 w-full overflow-hidden border-t border-gray-200 pt-4">
        <ul className="space-y-2">
          <SidebarItem
            icon={<Cog6ToothIcon className="w-6 h-6" />}
            title="Settings"
            link="/admin/settings"
            isOpen={isOpen}
          />
          <SidebarItem
            icon={<ArrowRightOnRectangleIcon className="w-6 h-6" />}
            title="Logout"
            link="/logout"
            isOpen={isOpen}
          />
        </ul>
      </div>
    </div>
  );
}
