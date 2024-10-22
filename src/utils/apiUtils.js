// import { error } from "console";

// const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
// const TRANSCRIPTION_API_ENDPOINT = 'https://speech.googleapis.com/v1/speech:recognize';

// export async function getChatGPTResponse(message) {
//   const response = await fetch(OPENAI_API_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: message }]
//     })
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   else
//   {
//     console.log(error);
//   }

//   const data = await response.json();
//   return data.choices[0].message.content;
// }

// export async function transcribeAudio(audioBlob) {
//   const formData = new FormData();
//   formData.append('audio', audioBlob);

//   const response = await fetch(TRANSCRIPTION_API_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${process.env.REACT_APP_TRANSCRIPTION_API_KEY}`
//     },
//     body: formData
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await response.json();
//   return data.transcript;
// }
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const TRANSCRIPTION_API_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';

export async function getChatGPTResponse(message) {
  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    throw new Error(`ChatGPT error: ${err.message}`);
  }
}

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch(TRANSCRIPTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (err) {
    throw new Error(`Transcription error: ${err.message}`);
  }
}