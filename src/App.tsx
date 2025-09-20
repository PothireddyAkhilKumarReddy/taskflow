import React, { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { TaskDashboard } from "./components/TaskDashboard";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { HelpPage } from "./components/HelpPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <HomePage onPageChange={setCurrentPage} />;
      case "tasks":
        return <TaskDashboard />;
      case "projects":
        return <TaskDashboard />;
      case "analytics":
        return <AnalyticsPage />;
      case "help":
        return <HelpPage />;
      case "about":
        return <AboutPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            TaskFlow
          </button>
          <span className="text-sm text-gray-500 hidden sm:block">
            Productivity made simple
          </span>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>

      <Authenticated>
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </Authenticated>

      <main className="flex-1">
        <Content currentPage={currentPage} renderPage={renderPage} onPageChange={setCurrentPage} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ currentPage, renderPage, onPageChange }: { currentPage: string; renderPage: () => React.ReactElement; onPageChange: (page: string) => void }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Authenticated>
        {renderPage()}
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-[600px] p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TaskFlow</h1>
              <p className="text-xl text-gray-600 mb-8">
                The modern way to manage your tasks and projects efficiently
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>✅</span>
                  <span>Task Management</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>📁</span>
                  <span>Project Organization</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>📊</span>
                  <span>Analytics Dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>🔄</span>
                  <span>Real-time Sync</span>
                </div>
              </div>
            </div>
            <SignInForm />
            
            {/* Quick links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={() => onPageChange("about")}
                  className="hover:text-blue-600 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => onPageChange("help")}
                  className="hover:text-blue-600 transition-colors"
                >
                  Help
                </button>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
