// src/utils/apiUtils.js

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
 console.error('Gemini API key is not set in environment variables');
}

export async function getGeminiResponse(message) {
 try {
   if (!GEMINI_API_KEY) {
     throw new Error('Gemini API key is not configured');
   }

   const formattedPrompt = `
     Answer the following interview question in this format:

     **Question:**
     ${message}

     **Answer:**
     [Provide a clear as human content and don't give the code if not need  ]

     **Key Points:**
     * **Important Concept:** **[Explain key concept]**
     * **Real Time Example:** [Provide an Real time example and explain]
     * **Code:** [Give code in optimized with time complexity and no comment line in java ]
     * **Implementation:** [Give the step by step to implement ]
   `;

   const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       contents: [{
         parts: [{
           text: formattedPrompt
         }]
       }],
       safetySettings: [{
         category: "HARM_CATEGORY_HARASSMENT",
         threshold: "BLOCK_MEDIUM_AND_ABOVE"
       }],
       generationConfig: {
         temperature: 0.7,
         topK: 40,
         topP: 0.95,
         maxOutputTokens: 1024,
       }
     }),
   });

   if (!response.ok) {
     const errorData = await response.json().catch(() => null);
     console.error('API Response:', errorData);
     throw new Error(
       `API error: ${response.status} - ${errorData?.error?.message || response.statusText}`
     );
   }

   const data = await response.json();
   console.log('Gemini Response:', data);
   
   if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
     return data.candidates[0].content.parts[0].text;
   } else {
     throw new Error('Unexpected response structure from Gemini API');
   }
 } catch (err) {
   console.error('Gemini API error:', err);
   throw new Error(`Gemini API error: ${err.message}`);
 }
}

export async function transcribeAudio(audioBlob) {
 return new Promise((resolve, reject) => {
   try {
     const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
     recognition.continuous = false;
     recognition.interimResults = false;
     recognition.lang = 'en-US';

     // Convert blob to audio
     const audio = new Audio(URL.createObjectURL(audioBlob));
     
     recognition.onstart = () => {
       console.log('Speech recognition started');
       audio.play();
     };

     recognition.onresult = (event) => {
       const transcript = event.results[0][0].transcript;
       console.log('Transcribed text:', transcript);
       resolve(transcript);
     };

     recognition.onerror = (event) => {
       console.error('Speech recognition error:', event.error);
       reject(new Error(`Transcription error: ${event.error}`));
     };

     recognition.onend = () => {
       console.log('Speech recognition ended');
       audio.pause();
       URL.revokeObjectURL(audio.src);
     };

     recognition.start();
   } catch (err) {
     console.error('Speech recognition setup error:', err);
     reject(err);
   }
 });
}