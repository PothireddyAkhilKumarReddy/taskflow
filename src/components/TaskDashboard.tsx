import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TaskList } from "./TaskList";
import { ProjectList } from "./ProjectList";
import { TaskForm } from "./TaskForm";
import { ProjectForm } from "./ProjectForm";
import { TaskStats } from "./TaskStats";

export function TaskDashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "projects">("tasks");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in_progress" | "completed">("all");

  const user = useQuery(api.auth.loggedInUser);
  const projects = useQuery(api.projects.getUserProjects);

  const tabs = [
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "projects", label: "Projects", icon: "📁" },
  ];

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || user?.email || "User"}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stats */}
      <TaskStats />

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "tasks" | "projects")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === "tasks" && (
            <>
              {/* Project Filter */}
              <select
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Projects</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                + New Task
              </button>
            </>
          )}

          {activeTab === "projects" && (
            <button
              onClick={() => setShowProjectForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              + New Project
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {activeTab === "tasks" && (
          <TaskList
            projectFilter={selectedProject}
            statusFilter={statusFilter === "all" ? undefined : statusFilter}
          />
        )}
        {activeTab === "projects" && <ProjectList />}
      </div>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          projectId={selectedProject}
        />
      )}

      {showProjectForm && (
        <ProjectForm onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
}
