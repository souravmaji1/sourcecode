'use client'
import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams } from 'next/navigation';

const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg';
const supabase = createClient(supabaseUrl, supabaseKey);

const AgentAnalytics = () => {
  const { sharedState } = useAppContext();
  const params = useParams();
  const chatbotId = Number(params.id) || sharedState.currentChatbotId;

  const [data, setData] = useState({
    totalTokens: 0,
    totalInteractions: 0,
    totalConversations: 0,
    finetuneId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch finetune_id for the given chatbotId
      const { data: chatbotData, error: chatbotError } = await supabase
        .from('chatbot')
        .select('finetune_id')
        .eq('id', chatbotId)
        .single();

      if (chatbotError) {
        console.error('Error fetching finetune_id:', chatbotError);
        return;
      }

      const finetuneId = chatbotData?.finetune_id;

      if (!finetuneId) {
        console.error('finetune_id not found');
        return;
      }

      // Fetch total tokens, total interactions, and total conversations
      const { data: statsData, error: statsError } = await supabase
        .from('chatbot')
        .select('*')
        .eq('finetune_id', finetuneId)
        .single();

      if (statsError) {
        console.error('Error fetching stats:', statsError);
        return;
      }

      console.log(statsData)

      setData({
        totalTokens: statsData?.total_tokens || 0,
        totalInteractions: statsData?.total_content || 0,
        totalConversations: statsData?.total_conversations || 0,
        finetuneId,
      });
    };

    fetchData();
  }, [chatbotId]);

  return (
    <div className="p-6 h-[--webkit-fill-available]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-purple-500 w-6 h-6 mr-2"></div>
          <h1 className="text-xl font-semibold">Agent Analytics</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded border border-gray-300 flex items-center">
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 flex items-center">
            Last 24 Days
            <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">Select a time range visit on widgets Stats and performance</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold mb-1">Monthly Interaction</h2>
          <div className="bg-purple-500 h-6 w-full rounded"></div>
          <p className="text-xs text-gray-600 mt-1">Used {data.totalInteractions} out of Infinity interactions /mo</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-1">AI Token Usage</h2>
          <div className="bg-purple-500 h-6 w-full rounded"></div>
          <p className="text-xs text-gray-600 mt-1">Used {data.totalTokens} out of 1,000,000 AI Token/mo</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {['Total Interaction', 'Total Conversation', 'Avg Message/Chat'].map((title, index) => (
          <div key={title} className="border p-4 rounded shadow">
            <h3 className="text-3xl font-bold text-center mb-2">
              {index === 0 ? data.totalInteractions : 
               index === 1 ? data.totalConversations : 
               index === 2 ? (data.totalInteractions / (data.totalConversations || 1)).toFixed(2) :
               'N/A'}
            </h3>
            <p className="text-sm text-center">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded shadow">
          <div className="flex items-center mb-2">
            <div className="bg-purple-500 w-4 h-4 mr-2"></div>
            <h2 className="text-sm font-semibold">Top Intents</h2>
          </div>
          <p className="text-xs text-gray-600 mb-2">Most triggered intents on your agent</p>
          <div className="bg-purple-200 p-4 rounded text-purple-700 text-center">
            Not enough Data to show
          </div>
        </div>
        <div className="p-4 rounded shadow">
          <div className="flex items-center mb-2">
            <div className="bg-purple-500 w-4 h-4 mr-2"></div>
            <h2 className="text-sm font-semibold">Understood Messages</h2>
          </div>
          <p className="text-xs text-gray-600 mb-2">The % of messages understood by our assistant.</p>
          <div className="bg-purple-200 p-4 rounded text-purple-700 text-center">
            Not enough Data to show
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAnalytics;
