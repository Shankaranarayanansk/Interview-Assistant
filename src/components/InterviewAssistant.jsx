import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mic, Loader } from "lucide-react"
import { startAudioRecording, stopAudioRecording } from '../utils/audioUtils';
import { transcribeAudio, getChatGPTResponse }  from '../utils/apiUtils';

export default function InterviewAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopAudioRecording();
      setIsRecording(false);
      processAudio(audioBlob);
    } else {
      await startAudioRecording();
      setIsRecording(true);
    }
  };

  const processAudio = async (audioBlob) => {
    setIsLoading(true);
    try {
      const transcriptText = await transcribeAudio(audioBlob);
      setTranscript(transcriptText);
      const gptResponse = await getChatGPTResponse(transcriptText);
      setResponse(gptResponse);
    } catch (error) {
      console.error('Error processing audio:', error);
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
            className={`w-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
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

      {transcript && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>{transcript}</CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>{response}</CardContent>
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