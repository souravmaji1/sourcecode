'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey);

const ReplyGenPromptInterface = () => {
  const { sharedState, setSharedState } = useAppContext();
  const params = useParams();
  const { user } = useUser();
  const chatbotId = Number(params.id) || sharedState.currentChatbotId;

  // State variables with default messages
  const [initialMessage, setInitialMessage] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [model, setModel] = useState('GPT-4o-OpenAI');
  const [temperature, setTemperature] = useState(0.5);
  const [uiEngine, setUiEngine] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('chatbot')
          .select('*')
          .eq('id', chatbotId)
          .single();

        if (error) throw error;

        if (data) {
          setInitialMessage(data.initial_message || "I am your virtual assistant. How can I help you today?");
          setInitialPrompt(data.initial_prompt || "Greet the User with \"Hi there! Let's get you started.\" You can write organized markdown including lists, bold text, italic, etc.");
          setSystemPrompt(data.system_prompt || "You are a friendly, polite, genius customer-care bot delivering efficient solutions from our comprehensive knowledge base.");
          setModel(data.model || 'GPT-4o-OpenAI');
          setTemperature(data.temperature ?? 0.5);
          setUiEngine(data.ui_engine ?? false);
        } else {
          // Set default values if no data is returned
          setInitialMessage("I am your virtual assistant. How can I help you today?");
          setInitialPrompt("Greet the User with \"Hi there! Let's get you started.\" You can write organized markdown including lists, bold text, italic, etc.");
          setSystemPrompt("You are a friendly, polite, genius customer-care bot delivering efficient solutions from our comprehensive knowledge base.");
        }
      } catch (error) {
        console.error('Error fetching chatbot data:', error);
        // Fallback to default values in case of error
        setInitialMessage("I am your virtual assistant. How can I help you today?");
        setInitialPrompt("Greet the User with \"Hi there! Let's get you started.\" You can write organized markdown including lists, bold text, italic, etc.");
        setSystemPrompt("You are a friendly, polite, genius customer-care bot delivering efficient solutions from our comprehensive knowledge base.");
      }
    };

    fetchData();
  }, [chatbotId]);

  const updateSupabase = async (data: any) => {
    try {
      const { error } = await supabase
        .from('chatbot')
        .update(data)
        .eq('id', chatbotId);

      if (error) throw error;
      console.log('Chatbot settings updated successfully');
    } catch (error) {
      console.error('Error updating chatbot settings:', error);
    }
  };

  const handleUpdateClick = () => {
    const newData = {
      initial_message: initialMessage || "I am your virtual assistant. How can I help you today?",
      initial_prompt: initialPrompt || "Greet the User with \"Hi there! Let's get you started.\" You can write organized markdown including lists, bold text, italic, etc.",
      system_prompt: systemPrompt || "You are a friendly, polite, genius customer-care bot delivering efficient solutions from our comprehensive knowledge base.",
      model: model,
      temperature: temperature,
      ui_engine: uiEngine,
      userId: user?.id
    };

    setSharedState((prevState) => ({
      ...prevState,
      currentChatbotId: chatbotId,
      ...newData
    }));

    updateSupabase(newData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">The initial message the AI agent will start with</label>
                <Input
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial prompt to agent (If provided Will override initial messages)</label>
                <Textarea
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">System Prompt</label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-80">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">LLM</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4o-OpenAI">GPT-4o-OpenAI</SelectItem>
                    <SelectItem value="gpt-4o| tools">gpt-4o| tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temperature: {temperature}</label>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  max={1}
                  step={0.1}
                />
                <p className="text-xs text-gray-500 mt-1">Higher values mean more randomness</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">UI Engine (Experimental)</span>
                <Switch
                  checked={uiEngine}
                  onCheckedChange={setUiEngine}
                />
              </div>
              <p className="text-xs text-gray-500">Enabling this will append further instructions in system prompt to make the AI agent output JSON data that can be used to render elements, like buttons, cards, carousels, etc. This feature is experimental and may not work as expected.</p>
              <button 
          onClick={handleUpdateClick} 
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Update Chatbot Settings
        </button>
            </CardContent>
          </Card>
        </div>
      </div>

     
    </div>
  );
};

export default ReplyGenPromptInterface;

