import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useQuery(api.auth.loggedInUser);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "help", label: "Help", icon: "❓" },
    { id: "about", label: "About", icon: "ℹ️" },
  ];

  const userMenuItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Main Navigation */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <span className="hidden sm:block">{user?.name || user?.email || "User"}</span>
              <span className="text-xs">▼</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                {userMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  currentPage === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
