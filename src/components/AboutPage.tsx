export function AboutPage() {
  const features = [
    {
      icon: "📋",
      title: "Task Management",
      description: "Create, organize, and track your tasks with ease. Set priorities, due dates, and monitor progress."
    },
    {
      icon: "📁",
      title: "Project Organization",
      description: "Group related tasks into projects for better organization and team collaboration."
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Get detailed insights into your productivity patterns and task completion rates."
    },
    {
      icon: "🔄",
      title: "Real-time Updates",
      description: "Experience seamless real-time synchronization across all your devices."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We respect your privacy and never share your information."
    },
    {
      icon: "🎨",
      title: "Beautiful Interface",
      description: "Enjoy a clean, intuitive interface designed for productivity and ease of use."
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer with 8+ years of experience in building scalable web applications.",
      avatar: "👨‍💻"
    },
    {
      name: "Sarah Chen",
      role: "UX Designer",
      bio: "Passionate about creating user-centered designs that make complex tasks simple and enjoyable.",
      avatar: "👩‍🎨"
    },
    {
      name: "Mike Rodriguez",
      role: "Product Manager",
      bio: "Focused on building products that solve real problems and improve people's daily workflows.",
      avatar: "👨‍💼"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About TaskFlow</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          TaskFlow is a modern task management application designed to help individuals and teams 
          stay organized, productive, and focused on what matters most. Built with cutting-edge 
          technology and a user-first approach.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            To empower people and teams to achieve their goals by providing intuitive, 
            powerful tools that make task management effortless and enjoyable.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Built with Modern Technology</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚛️</div>
            <h4 className="font-semibold text-gray-900">React</h4>
            <p className="text-sm text-gray-600">Modern UI framework</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <h4 className="font-semibold text-gray-900">Convex</h4>
            <p className="text-sm text-gray-600">Real-time database</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="font-semibold text-gray-900">Tailwind CSS</h4>
            <p className="text-sm text-gray-600">Beautiful styling</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="font-semibold text-gray-900">Responsive</h4>
            <p className="text-sm text-gray-600">Works everywhere</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-600 mb-8">
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        <div className="flex justify-center space-x-6">
          <a href="mailto:hello@taskflow.com" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📧 Email Us
          </a>
          <a href="#" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            💬 Live Chat
          </a>
        </div>
      </div>

      {/* Version Info */}
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>TaskFlow v2.1.0 • Built with ❤️ for productivity enthusiasts</p>
      </div>
    </div>
  );
}
