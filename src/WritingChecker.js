import React, { useState } from "react";
import "./WritingChecker.css";

const WritingChecker = () => {
  const [taskType, setTaskType] = useState("task1");
  const [task1Essay, setTask1Essay] = useState("");
  const [task2Prompt, setTask2Prompt] = useState("");
  const [task2Essay, setTask2Essay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const wordCount = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleSubmit = async (isTask1) => {
    const apiKey = process.env.REACT_APP_OPEN_API_KEY;

    if (!apiKey) {
      alert("API key not found. Check your .env file");
      return;
    }

    setIsLoading(true);
    const essay = isTask1 ? task1Essay : task2Essay;
    const taskDescription = isTask1
      ? "IELTS Writing Task 1"
      : `IELTS Writing Task 2: ${task2Prompt}`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `
              You are an IELTS writing examiner. Analyze the following ${taskDescription} essay:
              - Provide a band score prediction (0-9)
              - Give detailed feedback in English using bullet points
              - Highlight strengths and areas for improvement
              - Check for: Task Achievement, Coherence/Cohesion, Lexical Resource, Grammatical Range/Accuracy
              - Suggest specific improvements
            `,
              },
              {
                role: "user",
                content: essay,
              },
            ],
            temperature: 0.2,
          }),
        }
      );

      const data = await response.json();
      const feedbackText = data.choices[0].message.content;
      const scoreMatch = feedbackText.match(/Band\s+(\d(\.\d)?)/i);

      setFeedback(feedbackText);
      setScore(scoreMatch ? parseFloat(scoreMatch[1]) : null);
    } catch (error) {
      setFeedback("Error analyzing essay. Check your API key and try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="writing-checker-container">
      <h1>Writing Checker</h1>

      <div className="task-selection">
        <button
          onClick={() => setTaskType("task1")}
          className={taskType === "task1" ? "active" : ""}
        >
          Writing Task 1
        </button>
        <button
          onClick={() => setTaskType("task2")}
          className={taskType === "task2" ? "active" : ""}
        >
          Writing Task 2
        </button>
      </div>

      {taskType === "task1" && (
        <div className="task1-section">
          <h2>Writing Task 1</h2>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (e) => setTask1Essay(e.target.result);
              reader.readAsText(file);
            }}
          />
          <textarea
            placeholder="Write your essay here (minimum 150 words)"
            value={task1Essay}
            onChange={(e) => setTask1Essay(e.target.value)}
          />
          <button
            disabled={wordCount(task1Essay) < 150 || isLoading}
            onClick={() => handleSubmit(true)}
          >
            {isLoading ? "Analyzing..." : "Submit Task 1"}
          </button>
        </div>
      )}

      {taskType === "task2" && (
        <div className="task2-section">
          <h2>Writing Task 2</h2>
          <textarea
            placeholder="Enter the task description here"
            value={task2Prompt}
            onChange={(e) => setTask2Prompt(e.target.value)}
          />
          <textarea
            placeholder="Write your essay here (minimum 250 words)"
            value={task2Essay}
            onChange={(e) => setTask2Essay(e.target.value)}
          />
          <button
            disabled={wordCount(task2Essay) < 250 || isLoading}
            onClick={() => handleSubmit(false)}
          >
            {isLoading ? "Analyzing..." : "Submit Task 2"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="feedback-section">
          <h3>AI Feedback & Score</h3>
          <div className={`score-badge ${score >= 6 ? "good" : "improve"}`}>
            {isLoading ? "Analyzing..." : `Band: ${score || "?"}`}
          </div>
          <pre className="feedback-text">{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default WritingChecker;
