import { createContext, useContext, useState, useEffect } from "react";
import { getItem, setItem } from "../utils/storage";

const ExamContext = createContext();
export const useExams = () => useContext(ExamContext);

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const stored = getItem("exams");
    if (stored) setExams(stored);
  }, []);

  const saveExams = (newExams) => {
    setExams(newExams);
    setItem("exams", newExams);
  };

  const createExam = (examData) => {
    const newExam = {
      id: Date.now().toString(),
      ...examData,
      questions: examData.questions || [],
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    saveExams([...exams, newExam]);
    return newExam;
  };

  const updateExam = (id, examData) => {
    const updated = exams.map((exam) =>
      exam.id === id ? { ...exam, ...examData } : exam,
    );
    saveExams(updated);
  };

  const deleteExam = (id) => {
    saveExams(exams.filter((exam) => exam.id !== id));
  };

  const getExam = (id) => exams.find((exam) => exam.id === id);

  return (
    <ExamContext.Provider
      value={{ exams, createExam, updateExam, deleteExam, getExam }}
    >
      {children}
    </ExamContext.Provider>
  );
};
