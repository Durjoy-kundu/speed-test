
import React, { useEffect, useState, useRef } from 'react';

const sentences = [ 
    "The quick brown fox jumps over the lazy dog. Typing tests are a fun way to practice speed. Practice makes perfect in everything you do.",
  "Typing tests are a fun way to practice speed. React makes it painless to create UI components.",
  "React makes it painless to create UI components. The quick brown fox jumps over the lazy dog. Tailwind CSS helps you style quickly",
  "Tailwind CSS helps you style quickly and efficiently. Practice makes perfect in everything you do",
  "Practice makes perfect in everything you do.Typing tests are a fun way to practice speed."
 ];

const getRandomSentence = (count = 4) =>{
      const shuffled = sentences.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join('\n');
}
  

export default function TypingTest() {
  const [sentence, setSentence] = useState('');
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (started && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      endTest();
    }
    return () => clearInterval(intervalRef.current);
  }, [started, timer]);

  const startTest = () => {
    setSentence(getRandomSentence(4));
    setInput('');
    setTimer(60);
    setStarted(true);
    setFinished(false);
    setStats({ wpm: 0, accuracy: 0 });
  };

  const endTest = () => {
    clearInterval(intervalRef.current);
    setStarted(false);
    setFinished(true);
    calculateStats();
  };

  const calculateStats = () => {
    const words = input.trim().split(' ').filter(Boolean).length;
    const correctChars = sentence
      .split('')
      .filter((char, i) => char === input[i]).length;
    const accuracy = ((correctChars / input.length) * 100).toFixed(2);
    const wpm = Math.round((words / (60 - timer)) * 60);
    setStats({ wpm: wpm || 0, accuracy: accuracy || 0 });
  };

  const renderSentence = () => {
    return sentence.split('').map((char, i) => {
      let color = '';
      if (i < input.length) {
        color = char === input[i] ? 'text-green-400' : 'text-red-500';
      }
      return (
        <span key={i} className={`${color}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">⚡ Typing Speed Test</h1>

      <div className="mb-4 text-lg leading-relaxed break-words">
        {renderSentence()}
      </div>

      <textarea
        className="w-full h-24 p-4 rounded-md bg-gray-700 text-white outline-none resize-none"
        placeholder="Start typing here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!started}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-xl text-yellow-400">⏳ Time: {timer}s</p>
        <div className="space-x-2">
          <button
            onClick={startTest}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
          >
            Start Test
          </button>
          <button
            onClick={endTest}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            End Test
          </button>
        </div>
      </div>

      {finished && (
        <div className="mt-6 p-4 bg-gray-700 rounded-md">
          <h2 className="text-2xl mb-2 text-blue-400">🏁 Test Result</h2>
          <p>WPM: <span className="text-green-400 font-bold">{stats.wpm}</span></p>
          <p>Accuracy: <span className="text-yellow-300 font-bold">{stats.accuracy}%</span></p>
        </div>
      )}
    </div>
  );
}
