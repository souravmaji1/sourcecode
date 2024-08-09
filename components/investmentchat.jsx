'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send } from 'lucide-react'

const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

export default function InvestmentChat() {
  const { user } = useUser();
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      checkIfPropertyOwner();
    }
  }, [user]);

  const checkIfPropertyOwner = async () => {
    const { data, error } = await supabase
      .from('investment')
      .select('id')
      .eq('userid', user.id)
      .limit(1);

    if (error) {
      console.error('Error checking if property owner:', error);
    } else {
      setIsPropertyOwner(data.length > 0);
      fetchContactList(data.length > 0);
    }
  };

  const fetchContactList = async (ownerStatus) => {
    let query;
    if (ownerStatus) {
      query = supabase
        .from('investmentmessages')
        .select('sender_id, created_at')
        .eq('propertyowner', user.id);
    } else {
      query = supabase
        .from('investmentmessages')
        .select('propertyowner, created_at')
        .eq('sender_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact list:', error);
    } else {
      const uniqueContacts = [...new Set(data.map(item => 
        ownerStatus ? item.sender_id : item.propertyowner
      ))];
      setContactList(uniqueContacts.filter(id => id !== user.id).map(id => ({
        id,
        name: getContactLabel(uniqueContacts.indexOf(id)),
        lastMessage: data.find(msg => (ownerStatus ? msg.sender_id : msg.propertyowner) === id).created_at
      })));
    }
  };

  const fetchMessages = async (contactId) => {
    let query = supabase
      .from('investmentmessages')
      .select('*')
      .or(`sender_id.eq.${user.id},sender_id.eq.${contactId}`)
      .or(`propertyowner.eq.${user.id},propertyowner.eq.${contactId}`)
      .order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
    fetchMessages(contactId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim()) return;

    const messageData = {
      property_id: null,
      sender_id: user.id,
      message: newMessage,
      propertyowner: isPropertyOwner ? user.id : selectedContact,
    };

    const { data, error } = await supabase
      .from('investmentmessages')
      .insert([messageData]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      fetchMessages(selectedContact);
    }
  };

  const getContactLabel = (index) => {
    return isPropertyOwner ? `Sender ${index + 1}` : `Property Owner ${index + 1}`;
  };

  return (
    <Card className='p-4 flex'>
      <Card className="w-1/4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chats</CardTitle>
          <CardDescription>Select a {isPropertyOwner ? 'sender' : 'property owner'} to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {contactList.map((contact) => (
              <div key={contact.id} className="mb-2">
                <Button
                  variant={selectedContact === contact.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleContactSelect(contact.id)}
                >
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${contact.id}`} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{contact.name}</span>
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <MessageCircle className="mr-2" />
            {selectedContact ? contactList.find(c => c.id === selectedContact)?.name : 'Select a contact to start chatting'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full flex-col">
          <ScrollArea className="flex-1 pr-4">
            {messages.map((message, index) => (
              <div key={message.id} className="mb-4">
                <div
                  className={`flex ${
                    message.sender_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      message.sender_id === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.message}</p>
                    <small className="mt-1 block text-xs opacity-75">
                      {message.sender_id === user.id ? 'You' : getContactLabel(contactList.findIndex(c => c.id === message.sender_id))} -{' '}
                      {new Date(message.created_at).toLocaleString()}
                    </small>
                  </div>
                </div>
                {index < messages.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
             <div className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
          </ScrollArea>
         
        </CardContent>
      </Card>
    </Card>
  );
}