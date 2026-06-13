import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useExams } from "../contexts/ExamContext";
import { useResults } from "../contexts/ResultContext";
import Layout from "../components/Layout";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  FileQuestion,
} from "lucide-react";

const TeacherDashboard = () => {
  const { logout } = useAuth();
  const { exams, deleteExam } = useExams();
  const { getAllResultsWithDetails } = useResults();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("exams");
  const [selectedExamResults, setSelectedExamResults] = useState(null);

  const resultsWithDetails = getAllResultsWithDetails(exams);
  const totalStudents = new Set(resultsWithDetails.map((r) => r.studentId))
    .size;

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter((e) => e.isActive).length,
    totalSubmissions: resultsWithDetails.length,
    totalStudents,
  };

  const handleDeleteExam = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteExam(id);
    }
  };

  const getResultsForExam = (examId) => {
    const examResults = resultsWithDetails.filter((r) => r.examId === examId);
    setSelectedExamResults({
      examTitle: exams.find((e) => e.id === examId)?.title || "Exam",
      results: examResults,
    });
  };

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Exams</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalExams}
                </p>
              </div>
              <FileQuestion className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Exams</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeExams}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Submissions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalSubmissions}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Students</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalStudents}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "exams"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Manage Exams
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "results"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            View Results
          </button>
        </div>

        {activeTab === "exams" && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => navigate("/teacher/create-exam")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Create New Exam
              </button>
            </div>
            <div className="space-y-3">
              {exams.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No exams created yet.</p>
                  <button
                    onClick={() => navigate("/teacher/create-exam")}
                    className="mt-3 text-blue-600 hover:underline"
                  >
                    Create your first exam
                  </button>
                </div>
              ) : (
                exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {exam.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${exam.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            {exam.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          {exam.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FileQuestion size={14} />
                            {exam.questions.length} Questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {exam.timeLimit} minutes
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {
                              resultsWithDetails.filter(
                                (r) => r.examId === exam.id,
                              ).length
                            }{" "}
                            Submissions
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => getResultsForExam(exam.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Results"
                        >
                          <BarChart3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/teacher/edit-exam/${exam.id}`)
                          }
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {resultsWithDetails.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No results submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Student
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Exam
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Score
                      </th>
                      <th className="text-left py-3 text-gray-600 font-medium">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsWithDetails.map((result) => (
                      <tr key={result.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-800">
                          {result.studentId}
                        </td>
                        <td className="py-3 text-gray-800">
                          {result.examTitle}
                        </td>
                        <td className="py-3">
                          <span className="font-medium">
                            {result.score}/{result.total}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({Math.round((result.score / result.total) * 100)}%)
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 text-sm">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Modal */}
      {selectedExamResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Results for "{selectedExamResults.examTitle}"
              </h3>
              <button
                onClick={() => setSelectedExamResults(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {selectedExamResults.results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No submissions for this exam yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedExamResults.results.map((result) => (
                    <div key={result.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">
                          {result.studentId}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(result.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Score: {result.score}/{result.total}
                        </span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${result.score / result.total >= 0.5 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {Math.round((result.score / result.total) * 100)}%
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedExamResults(null);
                          navigate(`/student/results/${result.examId}`, {
                            state: {
                              viewAsTeacher: true,
                              studentId: result.studentId,
                            },
                          });
                        }}
                        className="mt-2 text-blue-600 text-sm hover:underline flex items-center gap-1"
                      >
                        <Eye size={14} /> View Detailed Answers
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TeacherDashboard;
