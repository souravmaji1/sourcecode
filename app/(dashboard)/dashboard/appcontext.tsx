'use client'
import { createClient } from '@supabase/supabase-js'
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
// Initialize Supabase client
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Chatbot {
  id: number;
  userId: string;
  promptData: string;
  designData: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

interface SharedState {
  chatbots: Chatbot[];
  currentChatbotId: number | null;
  [key: string]: any;
}

interface AppContextType {
  sharedState: SharedState;
  setSharedState: React.Dispatch<React.SetStateAction<SharedState>>;
  createChatbot: () => Promise<number | null>;
  fetchChatbots: () => Promise<void>;
  fetchChatbotById: (id: number) => Promise<Chatbot | null>;
  updateChatbot: (id: number, data: Partial<Chatbot>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [sharedState, setSharedState] = useState<SharedState>({
    chatbots: [],
    currentChatbotId: null,
  });

  const { user } = useUser();

  const fetchChatbots = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('*')
        .eq('userId', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSharedState(prevState => ({
        ...prevState,
        chatbots: data as Chatbot[],
      }));
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  }, [user]);

  const fetchChatbotById = useCallback(async (id: number): Promise<Chatbot | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('*')
        .eq('id', id)
        .eq('userId', user.id)
        .single();

      if (error) throw error;

      return data as Chatbot;
    } catch (error) {
      console.error('Error fetching chatbot:', error);
      return null;
    }
  }, [user]);

  const createChatbot = useCallback(async (): Promise<number | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chatbot')
        .insert({ 
          promptData: '', 
          designData: '', 
          name: 'New Chatbot', 
          userId: user.id 
        })
        .select()

      if (error) throw error;

      if (data && data[0]) {
        const newChatbot: Chatbot = data[0] as Chatbot;

        setSharedState(prevState => ({
          ...prevState,
          chatbots: [newChatbot, ...prevState.chatbots],
          currentChatbotId: newChatbot.id,
        }));

        return newChatbot.id;
      }
    } catch (error) {
      console.error('Error creating chatbot:', error);
    }
    return null;
  }, [user]);

  const updateChatbot = useCallback(async (id: number, data: Partial<Chatbot>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chatbot')
        .update(data)
        .eq('id', id)
        .eq('userId', user.id);

      if (error) throw error;

      setSharedState(prevState => ({
        ...prevState,
        chatbots: prevState.chatbots.map(chatbot =>
          chatbot.id === id ? { ...chatbot, ...data } : chatbot
        ),
      }));
    } catch (error) {
      console.error('Error updating chatbot:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchChatbots();
    }
  }, [fetchChatbots, user]);

  return (
    <AppContext.Provider value={{ 
      sharedState, 
      setSharedState, 
      createChatbot, 
      fetchChatbots, 
      fetchChatbotById, 
      updateChatbot 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppWrapper');
  }
  return context;
}