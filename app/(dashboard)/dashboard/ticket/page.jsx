'use client'
import React, { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey)

const AdminTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState({});
  const [replyMessages, setReplyMessages] = useState({});
  const [error, setError] = useState(null);
  const [modelAdapterIds, setModelAdapterIds] = useState([]);
  const [expandedTickets, setExpandedTickets] = useState({});
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchModelAdapterIds();
    }
  }, [user]);

  const fetchModelAdapterIds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('finetune_id')
        .eq('userId', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const ids = data.map(item => item.finetune_id);
        setModelAdapterIds(ids);
        fetchTickets(ids);
      } else {
        setError("No chatbots found associated with your account.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching model adapter IDs:', error);
      setError('Failed to fetch chatbot information');
      setLoading(false);
    }
  };

  const fetchTickets = async (ids) => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .in('model_adapter_id', ids)
        .order('created_at', { ascending: false });

      if (ticketError) throw ticketError;

      if (ticketData && ticketData.length > 0) {
        setTickets(ticketData);
        fetchMessages(ticketData.map(ticket => ticket.id));
      } else {
        setError("No tickets found for your chatbots.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets');
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketIds) => {
    try {
      const { data: messageData, error: messageError } = await supabase
        .from('ticket_messages')
        .select('*')
        .in('ticket_id', ticketIds)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;

      const messageMap = {};
      messageData.forEach(message => {
        if (!messageMap[message.ticket_id]) {
          messageMap[message.ticket_id] = [];
        }
        messageMap[message.ticket_id].push(message);
      });

      setMessages(messageMap);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketReply = async (ticketId) => {
    const replyMessage = replyMessages[ticketId] || '';
    if (!replyMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          content: replyMessage,
          is_from_user: false
        })
        .select();

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), data[0]]
      }));

      setReplyMessages(prev => ({ ...prev, [ticketId]: '' }));
    } catch (error) {
      console.error('Error sending ticket reply:', error);
      setError('Failed to send reply');
    }
  };

  const toggleTicketExpansion = (ticketId) => {
    setExpandedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  if (loading) {
    return <Alert><AlertTitle>Loading</AlertTitle><AlertDescription>Fetching your ticket information...</AlertDescription></Alert>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  if (tickets.length === 0) {
    return <Alert><AlertTitle>No Tickets</AlertTitle><AlertDescription>No tickets have been created for your chatbots yet.</AlertDescription></Alert>;
  }

  return (
    <div className="h-screen flex flex-col">
    <Card className="flex-grow overflow-hidden">
      <CardHeader>
        <CardTitle>Your Chatbot Tickets</CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-hidden">
        <ScrollArea className="h-[70vh] pr-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="mb-4">
              <CardHeader className="cursor-pointer" onClick={() => toggleTicketExpansion(ticket.id)}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  {expandedTickets[ticket.id] ? <ChevronUp /> : <ChevronDown />}
                </div>
                <p className="text-sm text-muted-foreground">Status: {ticket.status}</p>
                <p className="text-sm text-muted-foreground">Model Adapter ID: {ticket.model_adapter_id}</p>
              </CardHeader>
              {expandedTickets[ticket.id] && (
                <CardContent>
                  <p className="mb-2">{ticket.description}</p>
                  <Separator className="my-2" />
                  <ScrollArea className="h-[200px] mb-2">
                    {messages[ticket.id]?.map((msg, index) => (
                      <div key={index} className={`mb-2 ${msg.is_from_user ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg text-sm ${
                          msg.is_from_user ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <form onSubmit={(e) => { e.preventDefault(); handleTicketReply(ticket.id); }} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={replyMessages[ticket.id] || ''}
                      onChange={(e) => setReplyMessages(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                      placeholder="Type your reply..."
                      className="flex-grow"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              )}
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
  );
};

export default AdminTicketManagement;