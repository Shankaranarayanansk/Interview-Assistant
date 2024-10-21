let mediaRecorder;
let audioChunks = [];

export function startAudioRecording() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        mediaRecorder.start();
        resolve();
      })
      .catch(error => {
        console.error('Error accessing the microphone', error);
        reject(error);
      });
  });
}

export function stopAudioRecording() {
  return new Promise(resolve => {
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];
      resolve(audioBlob);
    };
    mediaRecorder.stop();
  });
}