import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ExamProvider } from "./contexts/ExamContext";
import { ResultProvider } from "./contexts/ResultContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateExam from "./pages/CreateExam";
import StudentDashboard from "./pages/StudentDashboard";
import TakeExam from "./pages/TakeExam";
import ExamResults from "./pages/ExamResults";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <ResultProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/create-exam" element={<CreateExam />} />
                <Route path="/teacher/edit-exam/:id" element={<CreateExam />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/take-exam/:id" element={<TakeExam />} />
                <Route
                  path="/student/results/:examId?"
                  element={<ExamResults />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </ResultProvider>
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
