import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TaskStats() {
  const stats = useQuery(api.tasks.getTaskStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { label: "Total Tasks", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "To Do", value: stats.todo, color: "text-gray-600", bg: "bg-gray-50" },
    { label: "In Progress", value: stats.inProgress, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Completed", value: stats.completed, color: "text-green-600", bg: "bg-green-50" },
    { label: "Overdue", value: stats.overdue, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat) => (
        <div key={stat.label} className={`${stat.bg} p-6 rounded-lg border`}>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
