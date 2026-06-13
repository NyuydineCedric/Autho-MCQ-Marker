import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useExams } from "../contexts/ExamContext";
import { useResults } from "../contexts/ResultContext";
import Layout from "../components/Layout";
import { ArrowLeft, CheckCircle, XCircle, Info } from "lucide-react";

const ExamResults = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getExam } = useExams();
  const { results } = useResults();

  const viewAsTeacher = location.state?.viewAsTeacher;
  const targetStudentId = location.state?.studentId;

  const [exam, setExam] = useState(null);
  const [result, setResult] = useState(null);
  const [isTeacherView, setIsTeacherView] = useState(false);

  useEffect(() => {
    const examData = getExam(examId);
    if (!examData) {
      navigate("/student");
      return;
    }
    setExam(examData);
    let targetResult;
    if (viewAsTeacher && targetStudentId) {
      targetResult = results.find(
        (r) => r.examId === examId && r.studentId === targetStudentId,
      );
      setIsTeacherView(true);
    } else {
      targetResult = results.find(
        (r) => r.examId === examId && r.studentId === user.email,
      );
      setIsTeacherView(false);
    }
    if (!targetResult) {
      navigate("/student");
      return;
    }
    setResult(targetResult);
  }, [
    examId,
    getExam,
    results,
    user.email,
    navigate,
    viewAsTeacher,
    targetStudentId,
  ]);

  if (!exam || !result)
    return (
      <Layout role="student">
        <div className="text-center py-12">Loading results...</div>
      </Layout>
    );

  const scorePercentage = (result.score / result.total) * 100;
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-blue-600";
    if (scorePercentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  return (
    <Layout role={isTeacherView ? "teacher" : "student"}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(isTeacherView ? "/teacher" : "/student")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {exam.title} - Results
            </h1>
            {isTeacherView && (
              <p className="text-gray-500">Student: {targetStudentId}</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-4">
            <span className={`text-3xl font-bold ${getScoreColor()}`}>
              {Math.round(scorePercentage)}%
            </span>
          </div>
          <p className="text-gray-600">
            You scored {result.score} out of {result.total} questions correctly.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Detailed Review
          </h2>
          <div className="space-y-4">
            {exam.questions.map((q, index) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`border rounded-lg p-4 ${isCorrect ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle
                        size={18}
                        className="text-green-500 mt-0.5"
                      />
                    ) : (
                      <XCircle size={18} className="text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">
                        {index + 1}. {q.text}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-500">Your answer:</span>{" "}
                          <span
                            className={
                              isCorrect ? "text-green-700" : "text-red-700"
                            }
                          >
                            {userAnswer || "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-500">
                              Correct answer:
                            </span>{" "}
                            <span className="text-green-700">
                              {q.correctAnswer}
                            </span>
                          </p>
                        )}
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Info size={14} />
                            <span className="text-xs font-medium">
                              Solution
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{q.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExamResults;
