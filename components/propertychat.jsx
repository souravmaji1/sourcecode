'use client'
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

const ChatComponent = () => {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
const [escrowData, setEscrowData] = useState({
  description: '',
  amount: '',
  buyerEmail: '',
  sellerEmail: ''
});

  useEffect(() => {
    if (user) {
      checkIfSeller();
      fetchUserList();
    }
  }, [user]);

  const checkIfSeller = async () => {
    const { data, error } = await supabase
      .from('rentalinformation')
      .select('userid')
      .eq('userid', user.id)
      .limit(1);

    setIsSeller(data && data.length > 0);
  };

  const fetchUserList = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('sender_id, sender_name, seller_id')
      .or(`sender_id.eq.${user.id},seller_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching user list:', error);
      return;
    }

    const uniqueUsers = Array.from(new Set(data.map(chat => 
      isSeller ? chat.sender_id : chat.seller_id
    ))).map(id => {
      const chat = data.find(c => isSeller ? c.sender_id === id : c.seller_id === id);
      return {
        id,
        name: isSeller ? chat.sender_name : 'Seller'
      };
    });

    setUserList(uniqueUsers);
  };

  const fetchMessages = async (userId) => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`sender_id.eq.${user.id},sender_id.eq.${userId},seller_id.eq.${user.id},seller_id.eq.${userId}`)
      .order('created_at', { ascending: true });
  
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
  
    setMessages(data);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchMessages(userId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: user.id,
      sender_name: user.fullName,
      seller_id: isSeller ? selectedUser : user.id,
      message: newMessage,
      listing_id: messages[0]?.listing_id
    };

    const { data, error } = await supabase
      .from('chats')
      .insert(messageData);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    fetchMessages(selectedUser);
  };

  

  return (
    <Card className='p-4 flex'>
      <Card className="w-1/4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chats</CardTitle>
          <CardDescription>Select a user to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {userList.map((user) => (
              <div key={user.id} className="mb-2">
                <Button
                  variant={selectedUser === user.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{user.name}</span>
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
            {selectedUser ? userList.find(u => u.id === selectedUser)?.name : 'Select a user to start chatting'}
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
                      {message.sender_id === user.id ? 'You' : message.sender_name} -{' '}
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
};

export default ChatComponent;