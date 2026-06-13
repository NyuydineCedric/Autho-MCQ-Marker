import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExams } from "../contexts/ExamContext";
import Layout from "../components/Layout";
import { Plus, Trash2, Save, ArrowLeft, FileQuestion } from "lucide-react";

const CreateExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExam, createExam, updateExam } = useExams();
  const existingExam = id ? getExam(id) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (existingExam) {
      setTitle(existingExam.title);
      setDescription(existingExam.description);
      setTimeLimit(existingExam.timeLimit);
      setQuestions(existingExam.questions);
    }
  }, [existingExam]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        solution: "",
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const examData = {
      title,
      description,
      timeLimit,
      questions,
      isActive: true,
    };
    if (existingExam) {
      updateExam(id, examData);
    } else {
      createExam(examData);
    }
    navigate("/teacher");
  };

  return (
    <Layout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {existingExam ? "Edit Exam" : "Create New Exam"}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Exam Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Exam Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min={1}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus size={18} /> Add Question
              </button>
            </div>
            {questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileQuestion className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No questions added yet.</p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Add your first question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-800">
                        Question {qIndex + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Question Text
                        </label>
                        <textarea
                          value={q.text}
                          onChange={(e) =>
                            updateQuestion(qIndex, "text", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Options
                        </label>
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <input
                              key={optIndex}
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                updateOption(qIndex, optIndex, e.target.value)
                              }
                              placeholder={`Option ${optIndex + 1}`}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            updateQuestion(
                              qIndex,
                              "correctAnswer",
                              e.target.value,
                            )
                          }
                          placeholder="Enter the correct answer text exactly"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">
                          Solution Explanation
                        </label>
                        <textarea
                          value={q.solution}
                          onChange={(e) =>
                            updateQuestion(qIndex, "solution", e.target.value)
                          }
                          rows={2}
                          placeholder="Explain why this answer is correct"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/teacher")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Save size={18} />
              {existingExam ? "Update Exam" : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateExam;
