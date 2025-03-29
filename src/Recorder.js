import React, { useState, useRef, useEffect } from "react";
import Timer from "./Timer.js";

const Recorder = ({
  isRecording,
  setIsRecording,
  askRandomQuestion,
  analyzeText,
  question,
  handleSpeak,
}) => {
  const [transcript, setTranscript] = useState("");
  const recognition = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-EN";

      recognition.current.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setTranscript((prev) => prev + transcript + " ");
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      alert("Your browser does not support Web Speech API");
    }
  }, []); // Создаем `recognition` только один раз при монтировании компонента

  const startRecording = async () => {
    if (!isRecording && recognition.current) {
      setTranscript("");
      setIsRecording(true);
      recognition.current.start();
      await askRandomQuestion();
    }
  };

  const stopRecording = () => {
    if (isRecording && recognition.current) {
      recognition.current.stop();
      setIsRecording(false);
      analyzeText(question, transcript);
    }
  };

  return (
    <div>
      <Timer
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        stopRecording={stopRecording}
      />
      <div className="button-group">
        <button
          className="button button-start"
          onClick={startRecording}
          disabled={isRecording}
        >
          Start Recording
        </button>
        <button
          className="button button-stop"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <div>
        <h3>Question:</h3>
        <p>{question}</p>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default Recorder;
