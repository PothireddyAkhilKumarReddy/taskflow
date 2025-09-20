import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TaskForm } from "./TaskForm";
import { toast } from "sonner";

interface TaskListProps {
  projectFilter?: string | null;
  statusFilter?: "todo" | "in_progress" | "completed";
}

export function TaskList({ projectFilter, statusFilter }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Id<"tasks"> | null>(null);
  
  const tasks = useQuery(api.tasks.getUserTasks, {
    status: statusFilter,
    projectId: projectFilter ? (projectFilter as Id<"projects">) : undefined,
  });
  
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleStatusChange = async (taskId: Id<"tasks">, status: "todo" | "in_progress" | "completed") => {
    try {
      await updateTask({ taskId, status });
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId: Id<"tasks">) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask({ taskId });
        toast.success("Task deleted");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "in_progress": return "text-blue-600 bg-blue-50";
      case "todo": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (tasks === undefined) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 mb-2">{task.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {task.projectName && (
                    <span>📁 {task.projectName}</span>
                  )}
                  <span>👤 {task.assignedToName}</span>
                  {task.dueDate && (
                    <span className={task.dueDate < Date.now() && task.status !== "completed" ? "text-red-600" : ""}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button
                  onClick={() => setEditingTask(task._id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit task"
                >
                  ✏️
                </button>
                
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <TaskForm
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
