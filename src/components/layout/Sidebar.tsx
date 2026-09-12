import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  LineChart,
  UserPlus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { pageAccess } from "../../data/roleTypes";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: <LayoutDashboard /> }],
  },
  {
    label: "Workflow",
    items: [
      { label: "Orders", path: "/orders", icon: <ShoppingBag /> },
      { label: "Customers", path: "/customers", icon: <Users /> },
      { label: "Expenses", path: "/expenses", icon: <CreditCard /> },
      { label: "Reports", path: "/reports", icon: <LineChart /> },
    ],
  },
  {
    label: "Administration",
    items: [{ label: "Staff", path: "/staff", icon: <UserPlus /> }],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onNavigate: () => void;
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onNavigate,
}: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <aside
      className={`bg-white border-r border-[#E5E7EB] flex flex-col z-40 h-screen top-0 w-[260px] shrink-0 transition-[width,transform] duration-200 fixed inset-y-0 left-0 lg:sticky ${
        isCollapsed ? "lg:w-20" : "lg:w-[260px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="h-14 lg:h-[72px] flex items-center gap-3 px-6 border-b border-[#E5E7EB]">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
          TS
        </div>
        <span
          className={`font-bold text-base whitespace-nowrap ${isCollapsed ? "lg:hidden" : ""}`}
        >
          TailorSuite
        </span>
      </div>

      <nav className="p-3 flex flex-col gap-1 overflow-y-auto">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => {
            const allowedRoles = pageAccess[item.path];
            return (
              !allowedRoles || (profile && allowedRoles.includes(profile.role))
            );
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label} className="mb-2 last:mb-0">
              <div
                className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary ${isCollapsed ? "lg:hidden" : ""}`}
              >
                {section.label}
              </div>
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 h-11 px-3 rounded-[10px] text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                      } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                    >
                      <span className="w-[22px] h-[22px] shrink-0">
                        {item.icon}
                      </span>
                      <span className={isCollapsed ? "lg:hidden" : ""}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
