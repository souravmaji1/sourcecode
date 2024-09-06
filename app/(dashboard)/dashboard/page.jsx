'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, MessageCircle, BarChart3 } from "lucide-react";
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey);

const ChatbotDashboard = () => {
  const router = useRouter();
  const { sharedState, createChatbot } = useAppContext();
  const { user, isLoaded } = useUser();

  const [totalContent, setTotalContent] = useState(0);
  const [totalConversations, setTotalConversations] = useState(0);
  const [maxMessages, setMaxMessages] = useState(40);

  useEffect(() => {
    const fetchChatbotStats = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('chatbot')
          .select('*')
          .eq('userId', user.id);

        if (error) {
          console.error('Error fetching chatbot stats:', error);
        } else if (data) {
          const content = data.reduce((sum, chatbot) => {
            const contentValue = parseInt(chatbot.total_content) || 0;
            return sum + contentValue;
          }, 0);
          const conversations = data.reduce((sum, chatbot) => {
            const conversationsValue = parseInt(chatbot.total_conversations) || 0;
            return sum + conversationsValue;
          }, 0);
          setTotalContent(content);
          setTotalConversations(conversations);
        }
      }
    };

    fetchChatbotStats();
  }, [user]);

  const handleCreateChatbot = async () => {
    if (!user) {
      alert('Please log in to create a chatbot');
      return;
    }

    const newChatbotId = await createChatbot();
    if (newChatbotId) {
      router.push(`/dashboard/design/${newChatbotId}`);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  // Get only the first 3 chatbots
  const displayedChatbots = sharedState.chatbots.slice(0, 3);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ChatBots</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedState.chatbots.length}</div>
            <p className="text-xs text-muted-foreground">No. of chatbots Created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContent.toString().padStart(4, '0')}/{maxMessages}</div>
            <p className="text-xs text-muted-foreground">Consumed Messages this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations.toString().padStart(4, '0')}</div>
            <p className="text-xs text-muted-foreground">No. of Leads Captured</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Build your Chatbots</h2>
      <p className="text-sm text-muted-foreground mb-4">Craft customized chatbots for your business and customer support.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          style={{background:'url(/createbot.png)', backgroundRepeat:'no-repeat'}}
          className="text-white cursor-pointer transition-colors h-60"
          onClick={handleCreateChatbot}
        >
          <CardContent className="flex flex-col items-center justify-center h-40">
          </CardContent>
        </Card>
        {displayedChatbots.map((chatbot) => (
          <Card 
            key={chatbot.id} 
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => router.push(`/dashboard/design/${chatbot.id}`)}
          >
            <CardContent className="flex flex-col items-center justify-center h-40">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{chatbot.name || `Chatbot ${chatbot.id}`}</p>
              <p className="text-xs text-muted-foreground">ID: {chatbot.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatbotDashboard;