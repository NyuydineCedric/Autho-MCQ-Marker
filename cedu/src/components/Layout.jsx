import { BookOpen, LayoutDashboard } from "lucide-react";
import { APP_NAME } from "../utils/constants";

const Layout = ({ children, role }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                {APP_NAME}
              </span>
            </div>
            <nav className="space-y-2">
              <a
                href={role === "teacher" ? "/teacher" : "/student"}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </a>
              {role === "student" && (
                <a
                  href="/student/results"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BookOpen size={18} />
                  My Results
                </a>
              )}
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
