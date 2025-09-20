import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ProfilePage() {
  const user = useQuery(api.auth.loggedInUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // In a real app, you'd call a mutation to update the user profile
    setIsEditing(false);
    // updateProfile mutation would go here
  };

  const stats = [
    { label: "Member Since", value: user ? new Date(user._creationTime).toLocaleDateString() : "N/A" },
    { label: "Account Type", value: "Free Plan" },
    { label: "Last Login", value: "Today" },
    { label: "Time Zone", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
  ];

  const achievements = [
    { icon: "🎯", title: "Task Master", description: "Completed 50+ tasks", earned: true },
    { icon: "📅", title: "Consistent", description: "Used TaskFlow for 30 days", earned: true },
    { icon: "🚀", title: "Project Pro", description: "Created 10+ projects", earned: false },
    { icon: "⚡", title: "Speed Demon", description: "Completed 10 tasks in one day", earned: false },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.name || "User"}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm mt-1">
                  Change Avatar
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${achievement.earned ? "" : "grayscale"}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        achievement.earned ? "text-green-800" : "text-gray-600"
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? "text-green-600" : "text-gray-500"
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                📧 Change Email
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                🔒 Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                📱 Two-Factor Auth
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                📥 Export Data
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                🗑️ Delete Account
              </button>
              <p className="text-xs text-gray-500">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
