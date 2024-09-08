'use client'
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey)

const InstallChatWidget = () => {

  const { sharedState,setSharedState } = useAppContext();
  const chatbotId =  sharedState.currentChatbotId;
  const router = useRouter();
  const [ finetuneid, setFinetuneid] = useState('');


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

      setFinetuneid(data.finetune_id);

    } catch (error) {
      console.error('Error fetching chatbot data from Supabase:', error);
    }
  };

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
  }, [chatbotId, setSharedState]);






  const installCode = ` <iframe src="https://replygen.netlify.app/?model=${finetuneid}"
             width="100%" style={{height:'100vh'}} />`;

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
   

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
       
        <h2 className="text-xl font-semibold mb-4">Install the Chat widget</h2>
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <pre className=" p-4 rounded-md text-sm">
              {installCode}
            </pre>
            <div className="mt-4 flex justify-end">
              <Button  className="flex items-center bg-purple-500 ">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallChatWidget;