let mediaRecorder;
let audioChunks = [];

export async function startAudioRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.start();
    return true;
  } catch (err) {
    console.error('Error accessing microphone:', err);
    throw new Error('Error accessing microphone: ' + err.message);
  }
}

export function stopAudioRecording() {
  return new Promise(resolve => {
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      audioChunks = [];
      
      // Stop all tracks in the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      resolve(audioBlob);
    };
    mediaRecorder.stop();
  });
}