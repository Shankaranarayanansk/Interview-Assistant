// src/utils/audioUtils.js
let mediaRecorder = null;
let audioChunks = [];

export async function startAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

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
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
          resolve(audioBlob);
        };
        mediaRecorder.stop();
      } else {
        reject(new Error('No active recording found'));
      }
    } catch (err) {
      reject(err);
    }
  });
}