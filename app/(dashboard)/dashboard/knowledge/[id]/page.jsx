'use client'

import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey);


const FileUploadAndTraining = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { sharedState } = useAppContext();
  const chatbotId =  sharedState.currentChatbotId;



  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleAudioFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const generateRandomModelName = () => {
    const adjectives = ['Smart', 'Clever', 'Bright', 'Quick', 'Wise', 'Astute', 'Brilliant'];
    const nouns = ['Assistant', 'Helper', 'Aide', 'Mentor', 'Guide', 'Advisor', 'Companion'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 1000)}`;
  };

  const handleTrainBot = async () => {
    if (!audioFile) {
      setError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      // Upload file
      const uploadResponse = await axios.post('https://api.vapi.ai/file', formData, {
        headers: {
          'Authorization': 'Bearer 47bc2bc7-173d-4474-b2c5-ed12188b82b3',
          'Content-Type': 'multipart/form-data'
        }
      });

      const vapiFileId = uploadResponse.data.id;

      // Generate random model name
      const randomModelName = generateRandomModelName();

      // Initialize Vapi assistant
      const assistantResponse = await axios({
        method: 'post',
        url: 'https://api.vapi.ai/assistant',
        headers: {
         'Authorization': 'Bearer 47bc2bc7-173d-4474-b2c5-ed12188b82b3',
          'Content-Type': 'application/json'
        },
        data: {
          model: {
            knowledgeBase: {
              fileIds: [vapiFileId],
              provider: 'canonical'
            },
            provider: "openai",
            model: "gpt-3.5-turbo"
          },
          firstMessage: `Hello, I'm ${randomModelName}. How can I assist you today?`
        }
      });

      console.log('Vapi Assistant Initialized:', assistantResponse.data);

      const { data, error } = await supabase
      .from('chatbot')
      .update({
        assistant_id: assistantResponse.data.id
      })
      .eq('id', chatbotId);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload file and initialize assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-purple-500' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Choose a file or drag & drop it here
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            PDF and TXT formats supported
          </p>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="rounded px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300">
                Browse File
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleAudioFileChange}
                accept=".pdf,.txt"
              />
            </label>
          </div>
          {audioFile && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
              <FileText className="mr-2 h-5 w-5" />
              <span>{audioFile.name}</span>
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleTrainBot}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            disabled={!audioFile || isLoading}
          >
            {isLoading ? 'Processing...' : 'Create & Train Bot'}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUploadAndTraining;