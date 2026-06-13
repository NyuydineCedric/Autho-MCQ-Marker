import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useExams } from "../contexts/ExamContext";
import { useResults } from "../contexts/ResultContext";
import Layout from "../components/Layout";
import { ClipboardList, BarChart3, Clock, CheckCircle } from "lucide-react";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { exams } = useExams();
  const { getResultsByStudent } = useResults();
  const navigate = useNavigate();

  const studentResults = getResultsByStudent(user?.email);
  const completedExamIds = studentResults.map((r) => r.examId);
  const availableExams = exams.filter(
    (exam) => exam.isActive && !completedExamIds.includes(exam.id),
  );
  const completedExams = exams.filter((exam) =>
    completedExamIds.includes(exam.id),
  );

  const stats = {
    available: availableExams.length,
    completed: completedExams.length,
    totalMarks: studentResults.reduce((sum, r) => sum + r.score, 0),
    averageScore:
      studentResults.length > 0
        ? Math.round(
            studentResults.reduce(
              (sum, r) => sum + (r.score / r.total) * 100,
              0,
            ) / studentResults.length,
          )
        : 0,
  };

  return (
    <Layout role="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-500">Matricule: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Exams</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.available}
                </p>
              </div>
              <ClipboardList className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Marks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalMarks}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.averageScore}%
                </p>
              </div>
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Available Exams</h2>
          </div>
          <div className="p-6">
            {availableExams.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No exams available at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {exam.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {exam.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>{exam.questions.length} Questions</span>
                        <span>{exam.timeLimit} minutes</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/student/take-exam/${exam.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Start Exam
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {completedExams.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Completed Exams</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {completedExams.map((exam) => {
                  const result = studentResults.find(
                    (r) => r.examId === exam.id,
                  );
                  return (
                    <div
                      key={exam.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {exam.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Score: {result?.score}/{result?.total}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${result?.score / result?.total >= 0.5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {Math.round((result?.score / result?.total) * 100)}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/student/results/${exam.id}`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                      >
                        View Results
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
