// audioUtils.js
let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;
let recognition = null;

export async function startAudioRecording() {
  try {
    // Clean up any existing streams first
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
    audioChunks = [];
    mediaRecorder = null;
    
    // Get new audio stream
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(audioStream);
    
    // Set up speech recognition
    recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.start();
    mediaRecorder.start();
    
    return true;
  } catch (err) {
    console.error('Error starting recording:', err);
    throw new Error('Failed to start recording: ' + err.message);
  }
}

export async function stopAudioRecording() {
  return new Promise((resolve, reject) => {
    try {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording found'));
        return;
      }

      // Stop recognition
      if (recognition) {
        recognition.stop();
      }

      // Get final results from recognition
      recognition.onresult = (event) => {
        const results = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        resolve(results);
      };

      recognition.onerror = (error) => {
        reject(new Error(`Speech recognition error: ${error.error}`));
      };

      // Clean up
      mediaRecorder.stop();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
      }
      
      mediaRecorder = null;
      audioChunks = [];
    } catch (err) {
      reject(err);
    }
  });
}

export function cleanup() {
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  mediaRecorder = null;
  audioChunks = [];
}
