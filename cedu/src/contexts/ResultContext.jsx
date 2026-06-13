import { createContext, useContext, useState, useEffect } from "react";
import { getItem, setItem } from "../utils/storage";

const ResultContext = createContext();
export const useResults = () => useContext(ResultContext);

export const ResultProvider = ({ children }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = getItem("results");
    if (stored) setResults(stored);
  }, []);

  const submitResult = (result) => {
    const newResult = {
      id: Date.now().toString(),
      ...result,
      submittedAt: new Date().toISOString(),
    };
    const updated = [...results, newResult];
    setResults(updated);
    setItem("results", updated);
    return newResult;
  };

  const getResultsByStudent = (studentId) =>
    results.filter((r) => r.studentId === studentId);

  const getResultsByExam = (examId) =>
    results.filter((r) => r.examId === examId);

  const getAllResultsWithDetails = (exams) => {
    return results.map((result) => {
      const exam = exams.find((e) => e.id === result.examId);
      return { ...result, examTitle: exam?.title || "Unknown Exam" };
    });
  };

  return (
    <ResultContext.Provider
      value={{
        results,
        submitResult,
        getResultsByStudent,
        getResultsByExam,
        getAllResultsWithDetails,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
