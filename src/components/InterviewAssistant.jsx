import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { startAudioRecording, stopAudioRecording, cleanup } from '../utils/audioUtils';
import { transcribeAudio, getGeminiResponse } from '../utils/apiUtils';

const InterviewAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const formatResponse = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-bold text-lg text-gray-800 mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      } else if (line.startsWith('* **')) {
        const boldText = line.match(/\*\*(.*?)\*\*/)?.[1] || '';
        const restText = line.replace(`* **${boldText}**`, '');
        return (
          <p key={index} className="ml-4 my-1">
            • <span className="font-semibold">{boldText}</span>{restText}
          </p>
        );
      } else {
        return (
          <p key={index} className="my-2 text-gray-700">
            {line}
          </p>
        );
      }
    });
  };

  const processAudio = async (transcriptText) => {
    setIsLoading(true);
    try {
      const aiResponse = await getGeminiResponse(transcriptText);
      setResponse(aiResponse);
    } catch (err) {
      setError('Error processing audio: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the toggleRecording function
  const toggleRecording = async () => {
    setError('');
    
    if (isRecording) {
      try {
        const transcriptText = await stopAudioRecording();
        setIsRecording(false);
        // Process the transcript directly
        await processAudio(transcriptText);
      } catch (err) {
        setError("Didn't catch anything referesh & try:"+err.message);
      }
    } else {
      try {
        const started = await startAudioRecording();
        if (started) {
          setIsRecording(true);
        }
      } catch (err) {
        setError('Error starting recording: ' + err.message);
      }
    }
  };  

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-center">Interview Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loader"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : isRecording ? (
              <>
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mr-2" />
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
        <Card className="mb-4 border-red-500">
          <CardContent className="text-red-500 p-4">
            {error}
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none">
              {formatResponse(response)}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && !isRecording && (
        <div className="flex justify-center items-center mt-4">
          <div className="loader-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .loader {
          width: 1rem;
          height: 1rem;
          border: 2px solid #ffffff;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
        }

        .loader-dots {
          display: flex;
          gap: 0.5rem;
        }

        .loader-dots div {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #3b82f6;
          border-radius: 50%;
          animation: bounce 0.5s alternate infinite;
        }

        .loader-dots div:nth-child(2) {
          animation-delay: 0.16s;
        }

        .loader-dots div:nth-child(3) {
          animation-delay: 0.32s;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-0.5rem);
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewAssistant;  