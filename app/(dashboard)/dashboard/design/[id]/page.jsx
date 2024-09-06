'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey)



export default function Design() {
  const { sharedState, setSharedState } = useAppContext();
  const params = useParams();
  const router = useRouter();
  const chatbotId = Number(params.id) || sharedState.currentChatbotId;

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
 // const [avatarUrl, setAvatarUrl] = useState('');
 const [ font, setFont] = useState('');
  const [theme, setTheme] = useState('light');
  const [buttonLayout, setButtonLayout] = useState('vertical');
  const [chatbotPosition, setChatbotPosition] = useState('bottom-right');
  const [avatarUrl, setAvatarUrl] = useState('');

  const defaultSettings = {
    name: 'Default Name',
    title: 'Default Title',
    description: 'Default Description',
    fontfamily: 'sans-serif',
    theme: 'light',
    button_layout: 'vertical',
    chatbot_position: 'bottom-right',
    avatar_url: '',
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
        setName(data.name || 'Default Name');
        setTitle(data.title || 'Default Title');
        setDescription(data.description || 'Default Description');
        setFont(data.fontfamily|| 'sans-serif');
        setTheme(data.theme || 'light');
        setButtonLayout(data.button_layout || 'vertical');
        setChatbotPosition(data.chatbot_position || 'bottom-right');
        setAvatarUrl(data.avatar_url || '');
      } else {
        console.log('No data found, showing default values');
      }
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
  }, [chatbotId, router, setSharedState]);

  const updateSupabase = async () => {
    const data = {
      name,
      title,
      description,
      fontfamily: font,
      theme,
      button_layout: buttonLayout,
      chatbot_position: chatbotPosition,
      avatar_url: avatarUrl,
    };

    try {
      const { error } = await supabase
        .from('chatbot')
        .update(data)
        .eq('id', chatbotId);

      if (error) throw error;
      console.log('Chatbot design settings updated successfully');
    } catch (error) {
      console.error('Error updating chatbot design settings:', error);
    }
  };

  const handleReset = () => {
    setName(defaultSettings.name);
    setTitle(defaultSettings.title);
    setDescription(defaultSettings.description);
    setFont(defaultSettings.fontfamily);
    setTheme(defaultSettings.theme);
    setButtonLayout(defaultSettings.button_layout);
    setChatbotPosition(defaultSettings.chatbot_position);
    setAvatarUrl(defaultSettings.avatar_url);

    updateSupabase(defaultSettings);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const getChatbotPreviewStyle = () => ({
    fontFamily: font,
    '--brand-color': theme,
  });

 

  const PromptText = () => (
    <p className="text-sm">
      Head to the prompt tab on Voiceglow to change the prompts which is the platform that is powering me!
    </p>
  );

  return (
    <div className="flex h-full bg-gray-100">
      <ScrollArea>
        <div className="flex-1 p-8">
          <div className="flex space-x-8">
            <div className="w-2/3">
              <Card>
              <CardHeader className="flex justify-between items-center p-4">
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <Button variant="outline" onClick={updateSupabase}>Update</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="branding">Branding</Label>
                    <Input id="branding" value={theme} onChange={(e) => setTheme(e.target.value)} />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <Label htmlFor="font">Font Family</Label>
                      <Input id="font" value={font} onChange={(e) => setFont(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="language">Widget Language</Label>
                      <Select defaultValue="english">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          {/* Add more language options */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Buttons Layout</Label>
                    <div className="flex space-x-4 mt-2">
                      <Button variant="outline" onClick={() => setButtonLayout('vertical')}>Vertical</Button>
                      <Button variant="outline" onClick={() => setButtonLayout('horizontal')}>Horizontal</Button>
                      <Button variant="outline" onClick={() => setButtonLayout('in-footer')}>In Footer</Button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                  <Label htmlFor="avatar">Launch Avatar</Label>
                    <Input id="avatar" type="file" onChange={handleFileUpload} />
                    {avatarUrl && (
                      <img src={avatarUrl} alt="Avatar Preview" className="mt-2 w-16 h-16 rounded-full" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="w-1/3">
              <Button variant="outline" className="w-full mb-4" onClick={handleReset}  >Reset Agent</Button>
              <Card className="bg-purple-100" style={getChatbotPreviewStyle()}>
                <CardHeader className="text-white" style={{borderRadius: '10px 10px 0 0', backgroundColor: 'var(--brand-color)'}}>
                  <div className="flex items-center">
                  {avatarUrl && (
                      <img src={avatarUrl} alt="Avatar Preview" className="mt-2 w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <h3 className="font-semibold pl-2">{title}</h3>
                      <p className="text-sm pl-2">{description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Head to the prompt tab on Voiceglow to change the prompts which is the platform that is powering me!</p>
                  
                  <div className="bg-white p-2 mt-20 rounded-lg flex items-center">
                    <Input placeholder="Type your message here..." className="flex-grow border-none" />
                    <Button size="icon" className="ml-2" style={{backgroundColor: 'var(--brand-color)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}