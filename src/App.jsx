import React from 'react';
import InterviewAssistant from './components/InterviewAssistant';

function App() {
  return (
    <div className="flex flex-col min-h-screen  position:sticky ">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Interview AI Assistant</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50">
        <InterviewAssistant />
      </main>

      <footer className="bg-white border-t mt-auto position:sticky">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p className='font-weight : text-black'>© {new Date().getFullYear()} AI Assistant Copyrights @ <a href="https://shankaranarayanansk.web.app/" className='font-bold font-weight: text-black hover:text-red-600	
'>Shankar Dev</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;