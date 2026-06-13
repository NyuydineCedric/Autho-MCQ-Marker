export const getItem = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};

export const initializeSampleData = () => {
  if (!getItem("exams")) {
    const sampleExam = {
      id: "exam_1",
      title: "JavaScript Fundamentals",
      description: "Test your basic JavaScript knowledge",
      timeLimit: 30,
      questions: [
        {
          id: "q1",
          text: "What is the output of `typeof null`?",
          type: "mcq",
          options: ["'object'", "'null'", "'undefined'", "'number'"],
          correctAnswer: "'object'",
          solution: "In JavaScript, `typeof null` returns 'object' due to a historical bug.",
        },
        {
          id: "q2",
          text: "Which method adds an element to the end of an array?",
          type: "mcq",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: "push()",
          solution: "The `push()` method adds one or more elements to the end of an array and returns the new length.",
        },
      ],
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setItem("exams", [sampleExam]);
  }

  if (!getItem("results")) {
    setItem("results", []);
  }
};