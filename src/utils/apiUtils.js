const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const TRANSCRIPTION_API_ENDPOINT = 'https://speech.googleapis.com/v1/speech:recognize';

export async function getChatGPTResponse(message) {
  const response = await fetch(OPENAI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch(TRANSCRIPTION_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_TRANSCRIPTION_API_KEY}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.transcript;
}