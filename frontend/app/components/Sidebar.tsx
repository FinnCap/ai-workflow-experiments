import {
  Bot,
  Code2,
  FileClock,
  GitBranch,
  MessageSquare
} from "lucide-react";
import { NavLink } from "react-router";


export default function Sidebar() {
  const navItems = [
    {
      name: "APIs",
      path: "/api",
      icon: Code2,
    },
    {
      name: "Agents",
      path: "/agent",
      icon: Bot,
    },
    {
      name: "Flows",
      path: "/flow",
      icon: GitBranch,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Log",
      path: "/log",
      icon: FileClock,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Workflow</h1>
        <p className="text-sm text-gray-600 mt-1">AI Workflow Experiments</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}