import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.js";
import Landing from "./Landing.js";
import Dialog from "./dialog.js";
import ReadingPassage from "./ReadingPassageGenerator.js";
import WritingChecker from "./WritingChecker.js"; // Импортируем компонент
import Listening from "./Listening.js";

const root = createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/app" element={<App />} />
      <Route path="/" element={<Landing />} />
      <Route path="/dialog" element={<Dialog />} />
      <Route path="/writing" element={<WritingChecker />} />
      <Route path="/reading" element={<ReadingPassage />} />
      <Route path="/listening" element={<Listening />} />
    </Routes>
  </Router>
);
