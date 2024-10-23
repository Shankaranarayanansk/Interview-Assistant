const OPENAI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const OPENAI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getChatGPTResponse(message) {
  try {
    const response = await fetch(`${OPENAI_API_ENDPOINT}?key=${OPENAI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message,
          }],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    return data.generatedContent;
  } catch (err) {
    throw new Error(`ChatGPT error: ${err.message}`);
  }
}

export async function transcribeAudio(audioBlob) {
  return new Promise((resolve, reject) => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    const audio = new Audio();

    audio.src = URL.createObjectURL(audioBlob);
    audio.play();

    recognition.lang = 'en-US';
    recognition.maxResults = 10;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      reject(new Error(`Transcription error: ${event.error}`));
    };

    recognition.onend = () => {
      console.log('Transcription ended');
    };

    recognition.start();
  });
}