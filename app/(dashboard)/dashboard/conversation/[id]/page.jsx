'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams } from 'next/navigation';

const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey);

const ModelChatHistoryViewer = () => {
  const [modelAdapterId, setModelAdapterId] = useState('');
  const [chatHistories, setChatHistories] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { sharedState } = useAppContext();
  const params = useParams();
  const chatbotId = Number(params.id) || sharedState.currentChatbotId;

  useEffect(() => {
    if (chatbotId) {
      fetchModelAdapterId();
    }
  }, [chatbotId]);

  const fetchModelAdapterId = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('finetune_id')
        .eq('id', chatbotId)
        .single();

      if (error) throw error;
      setModelAdapterId(data.finetune_id);
      fetchChatHistories(data.finetune_id);
    } catch (error) {
      console.error('Error fetching model adapter ID:', error);
      setError('Failed to load model adapter ID');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistories = async (adapterId) => {
    if (!adapterId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('model_adapter_id', adapterId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const groupedChats = data.reduce((acc, message) => {
        if (!acc[message.user_id]) {
          acc[message.user_id] = {
            messages: [],
            username: message.username || `User ${message.user_id.slice(0, 8)}...`,
            email: message.email || 'N/A',
            imageurl: message.imageurl || null
          };
        }
        acc[message.user_id].messages.push(message);
        return acc;
      }, {});

      setChatHistories(groupedChats);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error fetching chat histories:', error);
      setError('Failed to load chat histories');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatList = () => {
    if (Object.keys(chatHistories).length === 0) {
      return <div className="p-4 text-gray-500 text-center">No chats available</div>;
    }

    return Object.entries(chatHistories).map(([userId, { username, email, imageurl, messages }]) => (
      <div
        key={userId}
        onClick={() => setSelectedUserId(userId)}
        className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100 ${selectedUserId === userId ? 'bg-gray-200' : ''}`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageurl || "/api/placeholder/40/40"} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(messages[messages.length - 1].created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    ));
  };

  const renderSelectedChat = () => {
    if (!selectedUserId) return null;

    const chat = chatHistories[selectedUserId].messages;

    return (
      <ScrollArea className="h-[calc(100vh-180px)] w-full p-4">
        {chat.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
           <div className={`max-w-[70%] p-2 rounded-lg text-sm ${message.role === 'user' ? 'bg-purple-500 text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r">
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          {renderChatList()}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId && (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chatHistories[selectedUserId].imageurl || "/api/placeholder/40/40"} alt={chatHistories[selectedUserId].username} />
                  <AvatarFallback>{chatHistories[selectedUserId].username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{chatHistories[selectedUserId].username}</h2>
                  <p className="text-sm text-gray-500">{chatHistories[selectedUserId].email}</p>
                </div>
              </div>
            </div>
            {renderSelectedChat()}
          </>
        )}
        {!selectedUserId && (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to view the conversation
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="absolute bottom-4 right-4 w-96">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ModelChatHistoryViewer;
