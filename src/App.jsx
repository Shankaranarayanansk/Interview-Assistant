// src/App.js
import React from 'react';
import InterviewAssistant from './components/InterviewAssistant';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Interview AI Assistant</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <InterviewAssistant />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Interview AI Assistant.@ <a href="https://shankaranarayanansk.web.app/" className='font-bold font-weight: text-black	
'>Shankar Dev</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;