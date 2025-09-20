import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TaskStats } from "./TaskStats";

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const user = useQuery(api.auth.loggedInUser);
  const tasks = useQuery(api.tasks.getUserTasks, {});
  const projects = useQuery(api.projects.getUserProjects);

  const recentTasks = tasks?.slice(0, 5) || [];
  const recentProjects = projects?.slice(0, 3) || [];

  const quickActions = [
    { id: "tasks", label: "Create Task", icon: "➕", color: "bg-blue-500" },
    { id: "projects", label: "New Project", icon: "📁", color: "bg-green-500" },
    { id: "analytics", label: "View Analytics", icon: "📊", color: "bg-purple-500" },
    { id: "help", label: "Get Help", icon: "❓", color: "bg-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || user?.email || "User"}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Here's your productivity overview for today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onPageChange(action.id)}
              className={`${action.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-medium">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Stats</h2>
        <TaskStats />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h3>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      {task.projectName && `📁 ${task.projectName} • `}
                      Priority: {task.priority}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === "completed" ? "bg-green-100 text-green-800" :
                    task.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No tasks yet. Create your first task!</p>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h3>
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project._id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {project.taskCount} tasks
                    </span>
                    <span className="text-green-600">
                      {project.completedTasks} completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <p>No projects yet. Create your first project!</p>
            </div>
          )}
        </div>
      </div>

      {/* Productivity Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Productivity Tip of the Day</h3>
        <p className="text-gray-700">
          Break large tasks into smaller, manageable chunks. This makes them less overwhelming 
          and gives you a sense of progress as you complete each part.
        </p>
      </div>
    </div>
  );
}
