import { useState } from "react";

export function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: "🚀" },
    { id: "tasks", label: "Managing Tasks", icon: "📋" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "collaboration", label: "Collaboration", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "troubleshooting", label: "Troubleshooting", icon: "🔧" },
  ];

  const helpContent = {
    "getting-started": [
      {
        question: "How do I create my first task?",
        answer: "Click the '+ New Task' button in the top right corner of the Tasks page. Fill in the task details like title, description, priority, and due date, then click 'Create Task'."
      },
      {
        question: "How do I organize tasks into projects?",
        answer: "First, create a project by going to the Projects tab and clicking '+ New Project'. Then, when creating or editing a task, select the project from the dropdown menu."
      },
      {
        question: "Can I set due dates for tasks?",
        answer: "Yes! When creating or editing a task, you can set a due date. Tasks with overdue dates will be highlighted in red to help you stay on track."
      }
    ],
    "tasks": [
      {
        question: "How do I change a task's status?",
        answer: "You can change a task's status directly from the task list using the dropdown menu on the right side of each task. Options include To Do, In Progress, and Completed."
      },
      {
        question: "What do the priority levels mean?",
        answer: "Priority levels help you organize your work: High (urgent/important), Medium (important but not urgent), Low (nice to have). High priority tasks are highlighted in red."
      },
      {
        question: "How do I delete a task?",
        answer: "Click the trash icon (🗑️) next to any task. You'll be asked to confirm the deletion. Note: Only the task creator can delete tasks."
      }
    ],
    "projects": [
      {
        question: "What's the difference between tasks and projects?",
        answer: "Projects are containers that group related tasks together. Think of a project as a goal or initiative, and tasks as the individual steps needed to complete it."
      },
      {
        question: "Can I see project progress?",
        answer: "Yes! In the Projects tab, you can see how many tasks each project has and how many are completed. This gives you a quick overview of project progress."
      },
      {
        question: "How do I move a task to a different project?",
        answer: "Edit the task by clicking the edit icon (✏️), then select a different project from the dropdown menu, or select 'No Project' to remove it from all projects."
      }
    ],
    "collaboration": [
      {
        question: "Can I share tasks with others?",
        answer: "Currently, TaskFlow is designed for individual use. Each user has their own private workspace. Team collaboration features are planned for future releases."
      },
      {
        question: "Can I add comments to tasks?",
        answer: "Yes! Click on any task to view its details, where you can add comments, view the task history, and see all related information."
      }
    ],
    "settings": [
      {
        question: "How do I change my profile information?",
        answer: "Click on your profile picture or name in the top right corner, then select 'Profile' from the dropdown menu. You can update your name and other details there."
      },
      {
        question: "Can I change the app's appearance?",
        answer: "Currently, TaskFlow uses a clean, professional theme. Dark mode and theme customization options are planned for future updates."
      }
    ],
    "troubleshooting": [
      {
        question: "My tasks aren't syncing across devices",
        answer: "TaskFlow uses real-time synchronization. If you're experiencing sync issues, try refreshing the page or checking your internet connection. All data is automatically saved to the cloud."
      },
      {
        question: "I can't create new tasks",
        answer: "Make sure you're logged in and have a stable internet connection. If the problem persists, try refreshing the page or clearing your browser cache."
      },
      {
        question: "How do I report a bug or request a feature?",
        answer: "You can contact us through the About page or send an email to support@taskflow.com. We appreciate all feedback and bug reports!"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions and learn how to make the most of TaskFlow
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-32">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeCategory === category.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {categories.find(c => c.id === activeCategory)?.icon}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.label}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {helpContent[activeCategory as keyof typeof helpContent]?.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                📧 Contact Support
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                💬 Live Chat
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                📚 Video Tutorials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
