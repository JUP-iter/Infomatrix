import React, { useState } from "react";
import "./ReadingPassageGenerator.css";

const ReadingPassageGenerator = () => {
  const [testData, setTestData] = useState({
    passage: "",
    questions: [],
    answers: {},
    userAnswers: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Функция для генерации теста
  const generateTest = async () => {
    setIsLoading(true);
    setError("");
    setTestData({
      passage: "",
      questions: [],
      answers: {},
      userAnswers: {},
    });

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPEN_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "user",
                content: `
Создай академический текст на 700–800 слов в стиле IELTS Reading на тему "The Impact of Technology on Education". Текст должен быть разделен на несколько абзацев, содержать сложную лексику и грамматические конструкции, как в реальных тестах IELTS.

После текста сгенерируй 13 вопросов в стиле IELTS Reading:
- 4 вопроса True/False/Not Given
- 4 вопроса Multiple Choice (с вариантами A, B, C, D)
- 3 вопроса Sentence Completion (с пропусками ____)
- 2 вопроса Matching Headings (соотнеси заголовки с абзацами)

Раздели ответ на три секции с тегами:
[PASSAGE] — для текста
[QUESTIONS] — для вопросов
[ANSWERS] — для ответов

Пример формата:
[PASSAGE]
Текст здесь...

[QUESTIONS]
1. True/False/Not Given: Вопрос 1
2. True/False/Not Given: Вопрос 2
...
13. Matching Headings: Вопрос 13

[ANSWERS]
1. True
2. False
...
13. A - Paragraph 1
              `,
              },
            ],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      if (!data.choices?.[0]?.message) throw new Error("Invalid API response");

      const content = data.choices[0].message.content;

      // Парсинг секций
      const passageMatch = content.match(/\[PASSAGE\](.*?)\[QUESTIONS\]/s);
      const questionsMatch = content.match(/\[QUESTIONS\](.*?)\[ANSWERS\]/s);
      const answersMatch = content.match(/\[ANSWERS\](.*)/s);

      const passage = passageMatch ? passageMatch[1].trim() : "";
      const questionsText = questionsMatch ? questionsMatch[1].trim() : "";
      const answersText = answersMatch ? answersMatch[1].trim() : "";

      if (!passage || !questionsText || !answersText) {
        throw new Error("API response is missing required sections.");
      }

      // Парсинг вопросов
      const questions = questionsText
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((q) => {
          const [num, rest] = q.split(". ");
          const [type, text] = rest.split(": ");
          return { id: num, type, text };
        });

      // Парсинг ответов
      const answers = answersText.split("\n").reduce((acc, line) => {
        const [num, ans] = line.split(". ");
        if (num && ans) acc[num] = ans.trim();
        return acc;
      }, {});

      setTestData({
        passage,
        questions,
        answers,
        userAnswers: {},
      });
    } catch (err) {
      setError(err.message || "Failed to generate test");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка выбора ответа
  const handleAnswer = (qId, value) => {
    setTestData((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [qId]: value,
      },
    }));
  };

  // Проверка ответов
  const checkAnswers = () => {
    const results = testData.questions.map((q) => {
      // Get the correct answer, default to "No correct answer" if undefined
      const correct = testData.answers[q.id] || "No correct answer";
      // Get the user's answer, default to "Not answered" if undefined
      const user = testData.userAnswers[q.id] || "Not answered";

      let isCorrect = false;

      // Only compare if both values are defined and usable
      if (correct !== "No correct answer" && user !== "Not answered") {
        // Ensure both are strings before calling toLowerCase
        if (typeof user === "string" && typeof correct === "string") {
          isCorrect = user.toLowerCase() === correct.toLowerCase();
        } else {
          // Handle non-string cases (e.g., numbers or direct equality)
          isCorrect = user === correct;
        }
      }

      return {
        qId: q.id,
        correct,
        user,
        isCorrect,
      };
    });

    // Display results
    alert(
      results
        .map(
          (r) =>
            `Q${r.qId}: ${r.isCorrect ? "✅" : "❌"} ` +
            `Your answer: ${r.user}, Correct: ${r.correct}`
        )
        .join("\n")
    );
  };

  // Отрисовка вопросов
  const renderQuestion = (q) => {
    const { id, type, text } = q;

    return (
      <div key={id} className="question">
        <h3>{`Question ${id}: ${type}`}</h3>
        <p>{text}</p>

        {type.includes("True/False/Not Given") && (
          <div className="options">
            {["True", "False", "Not Given"].map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={`q-${id}`}
                  checked={testData.userAnswers[id] === opt}
                  onChange={() => handleAnswer(id, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {type.includes("Multiple Choice") && (
          <div className="options">
            {["A", "B", "C", "D"].map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={`q-${id}`}
                  checked={testData.userAnswers[id] === opt}
                  onChange={() => handleAnswer(id, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {type.includes("Sentence Completion") && (
          <input
            type="text"
            value={testData.userAnswers[id] || ""}
            onChange={(e) => handleAnswer(id, e.target.value)}
            placeholder="Enter your answer"
          />
        )}

        {type.includes("Matching Headings") && (
          <select
            value={testData.userAnswers[id] || ""}
            onChange={(e) => handleAnswer(id, e.target.value)}
          >
            <option value="">Select a heading</option>
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="test-container">
      <h1>IELTS Reading Practice</h1>
      {error && <div className="error">{error}</div>}
      <button
        onClick={generateTest}
        disabled={isLoading}
        className="generate-btn"
      >
        {isLoading ? "Generating..." : "Generate Test"}
      </button>

      {testData.passage && (
        <>
          <div className="passage">{testData.passage}</div>
          <div className="questions">
            {testData.questions.map(renderQuestion)}
          </div>
          <button onClick={checkAnswers} className="check-btn">
            Check Answers
          </button>
        </>
      )}
    </div>
  );
};

export default ReadingPassageGenerator;
