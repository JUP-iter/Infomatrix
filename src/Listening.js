import React, { useState, useRef } from "react";
import "./Listening.css";

const API_KEY = process.env.REACT_APP_OPEN_API_KEY; // Ключ из .env
const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
const parts = ["Part 1", "Part 2", "Part 3", "Part 4"];

const Listening = () => {
  const [testData, setTestData] = useState({
    script: "",
    questions: [],
    answers: {},
  });
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPart, setSelectedPart] = useState(parts[0]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  // Генерация теста
  const generateTest = async () => {
    setIsLoading(true);
    setError("");
    setTestData({ script: "", questions: [], answers: {} });
    setUserAnswers({});
    setAudioUrl(null);
    setShowTranscript(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "user",
                content: `
Сгенерируй тест для IELTS Listening ${selectedPart} с очень длинным текстом (1000+ слов), полным деталей, примеров и пояснений, как в реальных тестах IELTS. Добавь "воду" — лишние детали, описания и разъяснения, чтобы текст был объемным. Для диалогов (Part 1, Part 3) используй формат "Speaker N: текст". Верни ответ в формате JSON:
{
  "script": "Очень длинный текст (1000+ слов), похожий на IELTS Listening. Экранируй все специальные символы (\\n, \\t, кавычки), чтобы текст был валидным JSON.",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "What is the main reason John gives for his decision?",
      "options": ["A. Financial benefits", "B. Personal interest", "C. Family pressure"],
      "correct": "B"
    },
    {
      "type": "gap_fill",
      "question": "The lecture will take place in the ____ building on campus.",
      "correct": "Science"
    },
    {
      "type": "matching",
      "question": "Match the speakers to their opinions:",
      "options": ["Anna - Supports the idea", "Ben - Opposes the idea", "Clara - Neutral"],
      "correct": ["Anna - Supports the idea", "Ben - Opposes the idea"]
    }
    // Добавь еще 7 вопросов, чтобы всего было ровно 10 вопросов
  ],
  "answers": {"1": "B", "2": "Science", "3": "Anna - Supports the idea, Ben - Opposes the idea", "4": "...", "5": "...", "6": "...", "7": "...", "8": "...", "9": "...", "10": "..."}
}

Требования:
- Part 1: Диалог между двумя людьми на бытовую тему (например, аренда жилья, планирование поездки).
- Part 2: Монолог на общую тему (например, описание мероприятия или места).
- Part 3: Дискуссия между 2-3 людьми (например, студенты обсуждают проект).
- Part 4: Лекция профессора (например, научная тема или история).
- Текст должен быть очень длинным (1000+ слов), содержать много деталей, примеров, пояснений и "воды" (лишних описаний).
- Вопросов должно быть ровно 10, с разными типами: multiple choice, gap fill, matching. Каждый вопрос должен быть сложным, требовать понимания контекста, деталей и неявной информации.
- Убедись, что ответ — это валидный JSON. Экранируй все специальные символы (переносы строк, табуляцию, кавычки) в тексте, чтобы JSON можно было корректно распарсить.
              `,
              },
            ],
            temperature: 0.2,
            max_tokens: 6000, // Увеличено для длинного текста и 10 вопросов
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const rawContent = data.choices[0].message.content;

      console.log("Сырой ответ от API:", rawContent);

      let content;
      try {
        content = JSON.parse(rawContent);
      } catch (parseError) {
        throw new Error(
          `Ошибка парсинга JSON: ${parseError.message}. Сырой ответ: ${rawContent}`
        );
      }

      if (!content.script || !content.questions || !content.answers) {
        throw new Error(
          "Неполный ответ от API. Ожидались поля script, questions и answers."
        );
      }

      // Проверяем количество вопросов
      if (content.questions.length !== 10) {
        throw new Error(
          `API вернул ${content.questions.length} вопросов вместо ожидаемых 10. Попробуй сгенерировать тест еще раз.`
        );
      }

      setTestData(content);
      await generateAudio(content.script);
    } catch (err) {
      setError(`Не удалось сгенерировать тест: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Парсинг сценария на реплики
  const parseScript = (script) => {
    const lines = script.trim().split("\n");
    return lines
      .map((line) => {
        const match = line.match(/^(Speaker \d+): (.+)$/);
        return match
          ? { speaker: match[1], text: match[2] }
          : { speaker: "default", text: line };
      })
      .filter((entry) => entry.text.trim() !== "");
  };

  // Назначение голосов персонажам
  const assignVoices = (dialogue) => {
    const speakers = [...new Set(dialogue.map((d) => d.speaker))];
    const voiceMap = {};
    speakers.forEach((speaker, index) => {
      voiceMap[speaker] = voices[index % voices.length];
    });
    return voiceMap;
  };

  // Генерация и объединение аудио
  const generateAudio = async (script) => {
    try {
      const dialogue = parseScript(script);
      const voiceMap = assignVoices(dialogue);
      const audioContext = new AudioContext();
      const audioBuffers = [];

      for (const { speaker, text } of dialogue) {
        const voice = voiceMap[speaker] || "alloy";
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "tts-1",
            input: text,
            voice: voice,
          }),
        });

        if (!response.ok)
          throw new Error(`Ошибка генерации аудио для ${speaker}`);
        const audioBlob = await response.blob();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
      }

      const totalDuration = audioBuffers.reduce(
        (sum, buf) => sum + buf.duration,
        0
      );
      const offlineContext = new OfflineAudioContext(
        1,
        totalDuration * audioContext.sampleRate,
        audioContext.sampleRate
      );
      let currentTime = 0;
      audioBuffers.forEach((buffer) => {
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        source.connect(offlineContext.destination);
        source.start(currentTime);
        currentTime += buffer.duration;
      });

      const renderedBuffer = await offlineContext.startRendering();
      const wavBlob = bufferToWave(renderedBuffer);
      setAudioUrl(URL.createObjectURL(wavBlob));
    } catch (error) {
      setError("Ошибка при генерации аудио. Попробуй снова.");
      console.error("Ошибка при генерации аудио:", error);
    }
  };

  // Конвертация AudioBuffer в WAV
  const bufferToWave = (buffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    let offset = 0;

    const setUint32 = (data) => {
      view.setUint32(offset, data, true);
      offset += 4;
    };
    const setUint16 = (data) => {
      view.setUint16(offset, data, true);
      offset += 2;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // Длина файла - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // Размер = 16
    setUint16(1); // AudioFormat, 1=PCM
    setUint16(numOfChan); // Количество каналов
    setUint32(buffer.sampleRate); // Частота дискретизации
    setUint32(buffer.sampleRate * 2 * numOfChan); // Байтрейт
    setUint16(numOfChan * 2); // BlockAlign
    setUint16(16); // Биты на сэмпл
    setUint32(0x61746164); // "data"
    setUint32(buffer.length * numOfChan * 2); // Размер данных

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i])
        );
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  // Обработка ответов пользователя
  const handleAnswerChange = (questionNum, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionNum]: answer }));
  };

  // Проверка ответов
  const checkAnswers = () => {
    let score = 0;
    testData.questions.forEach((question, index) => {
      let correctAnswer;
      if (Array.isArray(question.correct)) {
        correctAnswer = question.correct.join(", ").toLowerCase();
      } else {
        correctAnswer = question.correct.toLowerCase();
      }
      const userAnswer = (userAnswers[index + 1] || "").toLowerCase().trim();
      if (correctAnswer === userAnswer) score++;
    });
    alert(`Твой результат: ${score} из ${testData.questions.length}`);
  };

  return (
    <div className="test-container">
      <h1>IELTS Listening Practice</h1>
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Загрузка...</div>}

      <div className="controls">
        <label>Выбери часть:</label>
        <select
          onChange={(e) => setSelectedPart(e.target.value)}
          value={selectedPart}
          disabled={isLoading}
        >
          {parts.map((part) => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={generateTest}
        disabled={isLoading}
        className="generate-btn"
      >
        {isLoading ? "Генерируется..." : "Сгенерировать тест"}
      </button>

      {testData.questions.length > 0 && (
        <>
          <div className="audio-player">
            <h3>Аудио</h3>
            <audio ref={audioRef} controls src={audioUrl}>
              Ваш браузер не поддерживает аудио.
            </audio>
          </div>

          <h2>Вопросы</h2>
          <div className="questions">
            {testData.questions.map((question, index) => (
              <div key={index} className="question-item">
                <p>{`${index + 1}. ${question.question}`}</p>
                {question.type === "multiple_choice" && (
                  <select
                    onChange={(e) =>
                      handleAnswerChange(index + 1, e.target.value)
                    }
                  >
                    <option value="">Выберите ответ</option>
                    {question.options.map((option, i) => (
                      <option key={i} value={option.split(". ")[0]}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {question.type === "gap_fill" && (
                  <input
                    type="text"
                    onChange={(e) =>
                      handleAnswerChange(index + 1, e.target.value)
                    }
                    placeholder="Ваш ответ"
                  />
                )}
                {question.type === "matching" && (
                  <textarea
                    onChange={(e) =>
                      handleAnswerChange(index + 1, e.target.value)
                    }
                    placeholder="Введите соответствия (например, Anna - Supports the idea, Ben - Opposes the idea)"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={checkAnswers} className="check-btn">
              Проверить ответы
            </button>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="transcript-btn"
            >
              {showTranscript ? "Скрыть транскрипт" : "Показать транскрипт"}
            </button>
          </div>

          {showTranscript && (
            <div className="script">
              <h2>Транскрипт</h2>
              <p>{testData.script}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Listening;
