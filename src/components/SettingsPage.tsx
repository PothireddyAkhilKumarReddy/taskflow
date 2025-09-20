import { useState } from "react";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      projectUpdates: true,
    },
    preferences: {
      theme: "light",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      startOfWeek: "monday",
    },
    privacy: {
      profileVisible: false,
      activityVisible: true,
      analyticsEnabled: true,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const settingSections = [
    {
      title: "Notifications",
      icon: "🔔",
      settings: [
        {
          key: "email",
          label: "Email Notifications",
          description: "Receive email updates about your tasks and projects",
          type: "toggle",
          value: settings.notifications.email,
        },
        {
          key: "push",
          label: "Push Notifications",
          description: "Get browser notifications for important updates",
          type: "toggle",
          value: settings.notifications.push,
        },
        {
          key: "taskReminders",
          label: "Task Reminders",
          description: "Remind me about upcoming due dates",
          type: "toggle",
          value: settings.notifications.taskReminders,
        },
        {
          key: "projectUpdates",
          label: "Project Updates",
          description: "Notify me when projects are updated",
          type: "toggle",
          value: settings.notifications.projectUpdates,
        },
      ],
    },
    {
      title: "Preferences",
      icon: "⚙️",
      settings: [
        {
          key: "theme",
          label: "Theme",
          description: "Choose your preferred color scheme",
          type: "select",
          value: settings.preferences.theme,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ],
        },
        {
          key: "language",
          label: "Language",
          description: "Select your preferred language",
          type: "select",
          value: settings.preferences.language,
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "fr", label: "Français" },
            { value: "de", label: "Deutsch" },
          ],
        },
        {
          key: "dateFormat",
          label: "Date Format",
          description: "How dates should be displayed",
          type: "select",
          value: settings.preferences.dateFormat,
          options: [
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
          ],
        },
        {
          key: "startOfWeek",
          label: "Start of Week",
          description: "First day of the week in calendar views",
          type: "select",
          value: settings.preferences.startOfWeek,
          options: [
            { value: "sunday", label: "Sunday" },
            { value: "monday", label: "Monday" },
          ],
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      settings: [
        {
          key: "profileVisible",
          label: "Public Profile",
          description: "Make your profile visible to other users",
          type: "toggle",
          value: settings.privacy.profileVisible,
        },
        {
          key: "activityVisible",
          label: "Activity Status",
          description: "Show when you're online or active",
          type: "toggle",
          value: settings.privacy.activityVisible,
        },
        {
          key: "analyticsEnabled",
          label: "Usage Analytics",
          description: "Help improve TaskFlow by sharing anonymous usage data",
          type: "toggle",
          value: settings.privacy.analyticsEnabled,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your TaskFlow experience</p>
      </div>

      <div className="space-y-8">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{setting.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    </div>

                    <div className="ml-6">
                      {setting.type === "toggle" ? (
                        <button
                          onClick={() =>
                            handleSettingChange(
                              section.title.toLowerCase().replace(" & ", "").replace(" ", ""),
                              setting.key,
                              !setting.value
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.value ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      ) : (
                        <select
                          value={setting.value as string}
                          onChange={(e) =>
                            handleSettingChange(
                              section.title.toLowerCase().replace(" & ", "").replace(" ", ""),
                              setting.key,
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {"options" in setting && setting.options?.map((option: { value: string; label: string }) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Reset to Defaults
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💾</span>
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Export Data</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Download all your tasks, projects, and comments as JSON
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Import Data</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Import tasks and projects from other applications
                  </p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                  Import
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-red-800">Clear All Data</h3>
                  <p className="text-sm text-red-600 mt-1">
                    Permanently delete all your tasks, projects, and comments
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
