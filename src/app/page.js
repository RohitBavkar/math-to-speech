"use client";

import { useState, useEffect } from "react";
import sre from "speech-rule-engine";

export default function Home() {
  const [mathInput, setMathInput] = useState(""); // User input
  const [speechOutput, setSpeechOutput] = useState(""); // Converted speech
  const [languages, setLanguages] = useState([]); // Available SRE languages
  const [selectedLang, setSelectedLang] = useState("en"); // Selected language

  // Fetch available languages from SRE
  useEffect(() => {
    const availableLanguages = sre.engineSetup().locales;
    setLanguages(availableLanguages);
  }, []);

  // Convert math expression to speech
  const handleConvert = () => {
    try {
      sre.setupEngine({
        locale: selectedLang,
        domain: "mathspeak",
        style: "default",
      });

      const speech = sre.toSpeech(mathInput);
      setSpeechOutput(speech);
      speakText(speech);
    } catch (error) {
      setSpeechOutput("Error in conversion.");
      console.error("Math speech error:", error);
    }
  };

  // Web Speech API to read text aloud
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Math Speech Converter
        </h2>

        <textarea
          rows="4"
          placeholder="Enter Math Expression (LaTeX)"
          value={mathInput}
          onChange={(e) => setMathInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 mb-4"
        />

        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 mb-4"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          onClick={handleConvert}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Convert to Speech
        </button>

        {speechOutput && (
          <p className="mt-4 text-gray-700">
            <strong>Speech Output:</strong> {speechOutput}
          </p>
        )}
      </div>
    </div>
  );
}
