import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AnalyticsPage() {
  const tasks = useQuery(api.tasks.getUserTasks, {});
  const projects = useQuery(api.projects.getUserProjects);
  const stats = useQuery(api.tasks.getTaskStats);

  if (!tasks || !projects || !stats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate analytics data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < Date.now() && t.status !== "completed").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Task distribution by priority
  const priorityStats = {
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
  };

  // Project completion rates
  const projectStats = projects.map(project => ({
    ...project,
    completionRate: project.taskCount > 0 ? Math.round((project.completedTasks / project.taskCount) * 100) : 0
  }));

  // Recent activity (last 7 days)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentTasks = tasks.filter(t => t.createdAt > sevenDaysAgo).length;
  const recentCompletions = tasks.filter(t => t.updatedAt > sevenDaysAgo && t.status === "completed").length;

  const analyticsCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: "📋",
      color: "bg-blue-500",
      change: `+${recentTasks} this week`
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: "✅",
      color: "bg-green-500",
      change: `${recentCompletions} completed this week`
    },
    {
      title: "Active Projects",
      value: projects.length,
      icon: "📁",
      color: "bg-purple-500",
      change: "Across all categories"
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: "⚠️",
      color: overdueTasks > 0 ? "bg-red-500" : "bg-gray-500",
      change: overdueTasks > 0 ? "Needs attention" : "All caught up!"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your productivity and task completion patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} text-white p-3 rounded-lg text-2xl`}>
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-600">{card.title}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{card.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Tasks by Priority</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-700">High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{priorityStats.high}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (priorityStats.high / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-700">Medium Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{priorityStats.medium}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (priorityStats.medium / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Low Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{priorityStats.low}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (priorityStats.low / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Progress</h3>
          {projectStats.length > 0 ? (
            <div className="space-y-4">
              {projectStats.slice(0, 5).map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{project.name}</span>
                    <span className="text-sm text-gray-600">{project.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.completionRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {project.completedTasks} of {project.taskCount} tasks completed
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <p>No projects to analyze yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Productivity Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{completionRate}%</div>
            <div className="text-sm text-gray-700">Overall completion rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{recentCompletions}</div>
            <div className="text-sm text-gray-700">Tasks completed this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {totalTasks > 0 ? Math.round(totalTasks / projects.length) : 0}
            </div>
            <div className="text-sm text-gray-700">Average tasks per project</div>
          </div>
        </div>
      </div>
    </div>
  );
}
