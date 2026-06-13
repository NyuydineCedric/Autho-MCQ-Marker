import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, GraduationCap, LogIn, Mail, KeyRound } from "lucide-react";
import { APP_NAME } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (role === "teacher" && email !== "teacher@example.com") {
      setError("Teacher email must be teacher@example.com");
      return;
    }

    if (role === "student" && email.trim() === "") {
      setError("Please enter your matricule number");
      return;
    }

    const success = login(email, role);
    if (success) {
      navigate(role === "teacher" ? "/teacher" : "/student");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>
          <p className="text-gray-500 mt-2">Teacher & Student Exam Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                role === "student"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <User size={20} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                role === "teacher"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <GraduationCap size={20} />
              Teacher
            </button>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              {role === "teacher" ? <Mail size={18} /> : <KeyRound size={18} />}
              {role === "teacher" ? "Email Address" : "Matricule Number"}
            </label>
            <input
              type={role === "teacher" ? "email" : "text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "teacher"
                  ? "teacher@example.com"
                  : "Enter your matricule number"
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <LogIn size={20} />
            Login to {APP_NAME}
          </button>
        </form>

        {role === "teacher" && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Demo Teacher: teacher@example.com ({APP_NAME} Admin)
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
