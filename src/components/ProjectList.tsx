import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ProjectForm } from "./ProjectForm";
import { toast } from "sonner";

export function ProjectList() {
  const [editingProject, setEditingProject] = useState<Id<"projects"> | null>(null);
  
  const projects = useQuery(api.projects.getUserProjects);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDeleteProject = async (projectId: Id<"projects">) => {
    if (confirm("Are you sure you want to delete this project? This will also delete all associated tasks.")) {
      try {
        await deleteProject({ projectId });
        toast.success("Project deleted");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  if (projects === undefined) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">Create your first project to organize your tasks!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingProject(project._id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit project"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {project.description && (
              <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{project.taskCount} tasks</span>
              <span>{project.completedTasks} completed</span>
            </div>
            
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: project.taskCount > 0 ? `${(project.completedTasks / project.taskCount) * 100}%` : "0%"
                }}
              ></div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <ProjectForm
          projectId={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}
