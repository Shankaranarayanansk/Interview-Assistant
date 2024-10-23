import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mic, Loader } from "lucide-react"
import { startAudioRecording, stopAudioRecording } from '../utils/audioUtils';
import { transcribeAudio, getChatGPTResponse } from '../utils/apiUtils';

export default function InterviewAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interviewerQuestion, setInterviewerQuestion] = useState('');

  const toggleRecording = async () => {
    setError(''); // Clear any previous errors
    
    if (isRecording) {
      try {
        const audioBlob = await stopAudioRecording();
        setIsRecording(false);
        await processAudio(audioBlob);
      } catch (err) {
        setError('Error stopping recording: ' + err.message);
      }
    } else {
      const started = await startAudioRecording();
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const processAudio = async (audioBlob) => {
    setIsLoading(true);
    try {
      const transcriptText = await transcribeAudio(audioBlob);
      setTranscript(transcriptText);
      setInterviewerQuestion(transcriptText); // Set interviewer question
      const gptResponse = await getChatGPTResponse(transcriptText);
      setResponse(gptResponse);
    } catch (err) {
      setError('Error processing audio: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Interview Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={toggleRecording}
            className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            disabled={isLoading}
          >
            {isRecording ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-4 bg-red-50">
          <CardContent className="text-red-500 py-4">{error}</CardContent>
        </Card>
      )}

      {transcript && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Interviewer Question</CardTitle>
          </CardHeader>
          <CardContent>{interviewerQuestion}</CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{response}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}