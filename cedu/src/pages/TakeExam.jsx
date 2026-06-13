import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useExams } from "../contexts/ExamContext";
import { useResults } from "../contexts/ResultContext";
import { Clock, AlertCircle } from "lucide-react";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getExam } = useExams();
  const { submitResult } = useResults();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const examData = getExam(id);
    if (!examData || !examData.isActive) {
      navigate("/student");
      return;
    }
    setExam(examData);
    setTimeLeft(examData.timeLimit * 60);
  }, [id, getExam, navigate]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  const handleSubmit = () => {
    if (submitted) return;
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    const result = {
      examId: exam.id,
      studentId: user.email,
      score,
      total: exam.questions.length,
      answers,
      submittedAt: new Date().toISOString(),
    };
    submitResult(result);
    setSubmitted(true);
    navigate("/student", { state: { examCompleted: true } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  if (!exam)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading exam...</div>
      </div>
    );

  const allQuestionsAnswered = exam.questions.every((q) => answers[q.id]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-semibold text-gray-800">{exam.title}</h1>
          <div className="flex items-center gap-2 text-red-600 font-mono">
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              Please answer all questions before submitting. You cannot change
              your answers after submission.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {exam.questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="font-medium text-gray-800 mb-4">
                {index + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`px-6 py-3 rounded-lg font-semibold ${allQuestionsAnswered ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Submit Exam
          </button>
        </div>
        {!allQuestionsAnswered && (
          <p className="text-sm text-red-500 mt-2 text-right">
            Please answer all questions before submitting.
          </p>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
