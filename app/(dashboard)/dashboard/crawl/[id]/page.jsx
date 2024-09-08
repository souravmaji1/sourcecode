'use client'

import React, { useState, useEffect } from 'react';
import { Globe, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import {  X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
// Initialize Supabase client (replace with your actual Supabase URL and anon key)
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey);

const ReplyGenCrawler = () => {
  const [modelName, setModelName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [editableFormattedContent, setEditableFormattedContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [datasetId, setDatasetId] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [finetuneJobId, setFinetuneJobId] = useState("");
  const [linksFound, setLinksFound] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const { user } = useUser();
  const [credits, setCredits] = useState(null);

  const router = useRouter();
  const { sharedState, setSharedState } = useAppContext();
  const params = useParams();
  const chatbotId = Number(params.id) || sharedState.currentChatbotId;
  
  const [ systemprompt, setSystemPrompt] = useState('');

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (!chatbotId) {
      router.push('/dashboard');
    } else {
      fetchDataFromSupabase(); // Fetch data on mount
      setSharedState(prevState => ({
        ...prevState,
        currentChatbotId: chatbotId,
      }));
    }
  }, [chatbotId, router, setSharedState]);

  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  const fetchUserCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('userid', user.id)
        .single();

      if (error) throw error;

      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching user credits:', error);
      setError('Failed to fetch user credits. Please try again.');
    }
  };


  const fetchDataFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('*')
        .eq('id', chatbotId)
        .single();

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (data) {
        setSystemPrompt(data.system_prompt || 'Default Name');
        setModelName(data.title);
      } else {
        console.log('No data found, showing default values');
      }
    } catch (error) {
      console.error('Error fetching chatbot data from Supabase:', error);
    }
  };


  const addLink = () => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const removeLink = (linkToRemove) => {
    setLinks(links.filter(link => link !== linkToRemove));
  };


  const handleScrape = async () => {
    try {
      setError(null);
      setEditableFormattedContent('');
      setTotalCharacters(0);
      setLinksFound(0);

      for (const url of links) {
        const response = await fetch(`https://replygenbackend.onrender.com/scrape?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to scrape website: ${url}`);
        }
        const data = await response.json();

        // Calculate total characters and links found
        const chars = Object.values(data).reduce((acc, curr) => {
          if (Array.isArray(curr)) {
            return acc + curr.join(' ').length;
          }
          return acc + (curr ? curr.length : 0);
        }, 0);

        setTotalCharacters(prev => prev + chars);
        setLinksFound(prev => prev + data.h1.length + data.h2.length + data.h3.length);

        const formattedSamples = formatScrapedData(data, url);
        setEditableFormattedContent(prev => prev + formattedSamples + '\n\n');
      }
    } catch (err) {
      console.error('Scraping error:', err);
      setError(`Failed to scrape websites: ${err.message}`);
    }
  };
  




  const formatScrapedData = (data, url) => {
    let formattedText = '';
    
    if (data.title) {
      formattedText += `User: What is the title of the website?\nChatbot: The title of the website is "${data.title}".\n\n`;
    }
    
    if (data.metaDescription) {
      formattedText += `User: What is the meta description of the website?\nChatbot: The meta description of the website is "${data.metaDescription}".\n\n`;
    }
    
    data.h1.forEach((h1, index) => {
      formattedText += `User: What is h1 heading ${index + 1}?\nChatbot: H1 heading ${index + 1} is "${h1}".\n\n`;
    });
    
    data.h2.forEach((h2, index) => {
      formattedText += `User: What is h2 heading ${index + 1}?\nChatbot: H2 heading ${index + 1} is "${h2}".\n\n`;
    });
    
    data.h3.forEach((h3, index) => {
      formattedText += `User: What is h3 heading ${index + 1}?\nChatbot: H3 heading ${index + 1} is "${h3}".\n\n`;
    });
    
    data.paragraphs.forEach((p, index) => {
      formattedText += `User: What is paragraph ${index + 1} about?\nChatbot: Paragraph ${index + 1} is about: ${p}\n\n`;
    });
    
    return formattedText.trim();
  };

  const uploadDataset = async () => {
    if (!editableFormattedContent) {
      setError("Please scrape a website first.");
      return;
    }
  
    try {
      const formData = new FormData();
      
      const formattedSamples = formatSamples(editableFormattedContent);
      const jsonlContent = formattedSamples.map(JSON.stringify).join('\n');
      const blob = new Blob([jsonlContent], { type: 'application/json' });
      formData.append('file', blob, 'samples.jsonl');
  
      setProgress(10);
      
      const uploadResponse = await fetch('https://replygenbackend.onrender.com/upload-dataset', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Dataset upload failed');
      }
  
      const uploadData = await uploadResponse.json();
      setDatasetId(uploadData.datasetId);
      setProgress(50);
      setUploadComplete(true);
      setResult({ ...result, datasetId: uploadData.datasetId });
    } catch (err) {
      setError(err.message);
    }
  };

  const formatSamples = (rawSamples) => {
    try {
      const lines = rawSamples.split('\n').filter(line => line.trim() !== '');
      const formattedSamples = [];
      
      for (let i = 0; i < lines.length; i += 2) {
        if (i + 1 < lines.length) {
          const user = lines[i].replace('User:', '').trim();
          const chatbot = lines[i + 1].replace('Chatbot:', '').trim();
          formattedSamples.push({
            messages: [
              { role: "System", content: systemprompt || "You are a chatbot trained to answer to my every question." },
              { role: "User", content: user },
              { role: "Chatbot", content: chatbot }
            ]
          });
        }
      }
      
      return formattedSamples;
    } catch (err) {
      throw new Error('Failed to format samples. Please check the input format.');
    }
  };

  const startFineTuning = async () => {
    if (!datasetId) {
      setError("Please upload a dataset first.");
      return;
    }
  
    if (credits < 25) {
      setError("Insufficient credits. You need at least 25 credits to start fine-tuning.");
      return;
    }
  
    try {
      const finetuneData = {
        name: modelName,
        settings: {
          base_model: {
            base_type: "BASE_TYPE_CHAT",
          },
          dataset_id: datasetId
        }
      };
  
      const finetuneResponse = await axios.post(
        'https://api.cohere.com/v1/finetuning/finetuned-models', 
        finetuneData,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer 9MJzxkVoFlOO37IBNZaZKM4LUi06I9Z4mbPKQwYr`
          }
        }
      );
  
      setProgress(100);
      setResult({ result: "fine tune created successfully", finetuneJobId: finetuneResponse.data.finetuned_model.id });
      setFinetuneJobId(finetuneResponse.data.finetuned_model.id);

      console.log(finetuneResponse.data.finetuned_model.id)

      // Store the fine-tune ID in Supabase
      const { data, error } = await supabase
      .from('chatbot')
      .update({
        finetune_id: `${finetuneResponse.data.finetuned_model.id}-ft`
      })
      .eq('id', chatbotId);

      if (error) {
        console.error('Error storing fine-tune ID:', error);
        setError('Failed to store fine-tune ID. Please try again.');
      }
  
      // Update credits
      const newCredits = credits - 25;
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('userid', user.id);
  
      if (updateError) {
        console.error('Error updating credits:', updateError);
        setError('Failed to update credits. Please try again.');
      } else {
        setCredits(newCredits);
      }
    } catch (err) {
      console.error('Fine-tuning error:', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <ScrollArea className=" w-full" style={{height:"-webkit-fill-available"}} >
    <div className="flex flex-col space-y-6 p-6 rounded-lg" style={{height:"-webkit-fill-available"}}>
      
     
      
     
      
      <div className="flex space-x-4 items-center">
      <Input
          type="text"
          placeholder="https://"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <Button
          onClick={addLink}
          className="w-26 bg-purple-500"
          style={{textWrap:"nowrap"}}
        >Add Link </Button>
      </div>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Added Links:</span>
          {links.map((link, index) => (
            <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              <span className="truncate max-w-[150px]">{link}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0" 
                onClick={() => removeLink(link)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}


      <Button
        onClick={handleScrape}
        className="w-full bg-purple-500"
        disabled={links.length === 0}
      >
        Crawl All Links
      </Button>
      
      <div className="text-sm text-gray-600">
        Links Found: {linksFound} - Total Characters: {totalCharacters}
      </div>

      {editableFormattedContent && (
              <div className="mt-4">
                <Textarea
                  rows={8}
                  value={editableFormattedContent}
                  onChange={(e) => setEditableFormattedContent(e.target.value)}
                />
               
              </div>
            )}
      
      <div className="flex-grow"></div>
      
      <div className="mt-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Initiate Training with Files:
        </h4>
        {!uploadComplete && (
          <Button type="button" onClick={uploadDataset} className="mt-2 bg-purple-500  ">Upload Dataset</Button>
        )}

        {/* Show Start Fine-tuning Button After Upload Completes */}
        {uploadComplete && (
          <Button  className=' bg-purple-500'   onClick={startFineTuning}  disabled={!uploadComplete || credits < 25}  >
            Start Fine-tuning
          </Button>
        )}
      </div>
    {/* {progress > 0 && <Progress value={progress} className="mt-4" />} */}

      
      {result && <p className="text-green-500">{result.result}</p>}
    </div>
    </ScrollArea>
  );
};

export default ReplyGenCrawler;