'use client'


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamic from 'next/dynamic';
import { ScrollArea } from '@/components/ui/scroll-area';
import QRCode from 'qrcode.react';


const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg'
const supabase = createClient(supabaseUrl, supabaseKey)

const integrations = [
  { name: "WhatsApp", description: "Connect your agent to a business WA number.", status: "ACTIVE" },
  { name: "Instagram", status: "SOON" },
  { name: "Messenger", description: "Connect your agent to Facebook Messenger.", status: "ACTIVE" },
  { name: "Discord", description: "Connect your agent to a channel.", status: "ACTIVE" },
  { name: "Telegram", status: "ACTIVE" },
  { name: "Google Business Chat", description: "Google chat has been killed by google. MOB", status: "SOON" },
  { name: "Email", status: "SOON" },
  { name: "Make.com", description: "Connect your agent using Make.com custom app.", status: "ACTIVE" },
  { name: "Shopify", description: "Add your chatbot to your Shopify store.", status: "ACTIVE" },
];

const IntegrationDashboard = () => {
  const { sharedState, setSharedState } = useAppContext();
  const chatbotId = sharedState.currentChatbotId;
  const router = useRouter();
  const [finetuneid, setFinetuneid] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [botToken, setBotToken] = useState('');
  const [modelId, setModelId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [qrCode, setQrCode] = useState('');

  const [makeInstructions, setMakeInstructions] = useState('');

  const [shopifyScript, setShopifyScript] = useState('');

  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [appSecret, setAppSecret] = useState('');

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
      fetchDataFromSupabase();
      setSharedState(prevState => ({
        ...prevState,
        currentChatbotId: chatbotId,
      }));
    }
  }, [chatbotId, setSharedState, router]);

  const handleConnect = (platform) => {
    setCurrentPlatform(platform);
    setIsDialogOpen(true);
    setBotToken('');
    setModelId(finetuneid); // Pre-fill with the fetched finetune_id
    setConnectionStatus('');
    setQrCode('');
    setAccessToken('');
    setVerifyToken('');
    setAppSecret('');
    if (platform === 'Shopify') {
      const script = `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.width = '350px';
    container.style.height = '500px';
    container.style.zIndex = '9999';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    container.style.borderRadius = '10px';
    container.style.overflow = 'hidden';
    
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-widget-url.com/?model=${finetuneid}';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    container.appendChild(iframe);
    document.body.appendChild(container);
  });
</script>`;
      setShopifyScript(script);
    } else if (platform === 'Make.com') {
      const instructions = `To install the custom app, please copy and paste the following link in your browser:

https://www.make.com/en/hq/app-invitation/b1ef57e902b43940749465bf2fabbef4

Follow the instructions on the Make.com website to complete the installation.`;
      setMakeInstructions(instructions);
    }
  };

  const connectBot = async () => {
    setIsConnecting(true);
    setConnectionStatus('Connecting...');

    try {
      let endpoint;
      let payload;

      switch (currentPlatform) {
        case 'WhatsApp':
          endpoint = '/start-whatsapp-bot';
          payload = { modelId, userId: chatbotId };
          break;
        case 'Messenger':
          endpoint = '/start-facebook-bot';
          payload = { accessToken, verifyToken, appSecret, modelId };
          break;
        case 'Discord':
          endpoint = '/start-discord-bot';
          payload = { botToken, modelId, userId: chatbotId };
          break;
        case 'Telegram':
          endpoint = '/start-telegram-bot';
          payload = { botToken, modelId, userId: chatbotId };
          break;
        default:
          throw new Error('Unsupported platform');
      }

      const response = await axios.post(`http://localhost:4000${endpoint}`, payload);

      if (currentPlatform === 'WhatsApp' && response.data.qrCode) {
        setQrCode(response.data.qrCode);
        setConnectionStatus('Please scan the QR code to connect WhatsApp.');
      } else {
        setConnectionStatus('Connected successfully!');
      }

    } catch (error) {
      setConnectionStatus('Connection failed. Please try again.');
      console.error(`Error connecting ${currentPlatform} bot:`, error);
    }

    setIsConnecting(false);
  };


  const QRCodeDisplay = ({ qrCode }) => (
    <div className="flex flex-col items-center justify-center">
      {qrCode ? (
        <>
          <QRCode value={qrCode} size={256} />
          <p className="mt-4 text-sm text-gray-600">Scan this QR code with WhatsApp to connect your bot</p>
        </>
      ) : (
        <p className="text-red-500">Failed to generate QR code. Please try again.</p>
      )}
    </div>
  );

  return (
    <div className="flex h-screen ">
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <span className="mr-2">{integration.name}</span>
                    <span className="text-sm text-gray-500">({integration.status})</span>
                  </h3>
                  {integration.description && (
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  )}
                </div>
                <Button 
                  className="text-white border-purple-500 bg-purple-500  "
                  onClick={() => integration.status === 'ACTIVE' && handleConnect(integration.name)}
                  disabled={integration.status !== 'ACTIVE'}
                >
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">{currentPlatform} Integration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
          {currentPlatform === 'Shopify' ? (
              <>
              <ScrollArea className="h-72 w-48 rounded-md ">
              <div className="p-4 " style={{height:'27vh',width:'40vw'}}>
                <p className="text-sm text-black">To integrate your chatbot with your Shopify store, add the following script to your themes <code>theme.liquid</code> file, just before the closing <code>&lt;/head&gt;</code> tag:</p>
                <pre className="bg-gray-700 p-4 rounded-md overflow-x-auto">
                  <code>{shopifyScript}</code>
                </pre>
                <p className="text-sm">Make sure to replace <code>https://your-widget-url.com</code> with the actual URL of your chatbot widget.</p>
                <Button
                  onClick={() => navigator.clipboard.writeText(shopifyScript)}
                  className="w-full mt-4"
                >
                  Copy Script
                </Button>
                </div>
                </ScrollArea>
              </>
            ) :  currentPlatform === 'Make.com' ? (
              <ScrollArea className="h-72 w-48 rounded-md">
                <div className="p-4" style={{height:'27vh',width:'40vw'}}>
                  <p className="text-sm text-black">{makeInstructions}</p>
                  <Button
                    onClick={() => navigator.clipboard.writeText('https://www.make.com/en/hq/app-invitation/b1ef57e902b43940749465bf2fabbef4')}
                    className="w-full mt-4"
                  >
                    Copy Link
                  </Button>
                </div>
              </ScrollArea>
            
             ) : qrCode && currentPlatform === 'WhatsApp' ? (
              <QRCodeDisplay qrCode={qrCode} />
            ) : (
              <>
                {currentPlatform === 'Messenger' ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="accessToken" className="text-sm font-medium">Access Token</label>
                      <Input
                        id="accessToken"
                        placeholder="Enter Messenger Access Token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="verifyToken" className="text-sm font-medium">Verify Token</label>
                      <Input
                        id="verifyToken"
                        placeholder="Enter Messenger Verify Token"
                        value={verifyToken}
                        onChange={(e) => setVerifyToken(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="appSecret" className="text-sm font-medium">App Secret</label>
                      <Input
                        id="appSecret"
                        placeholder="Enter Messenger App Secret"
                        value={appSecret}
                        onChange={(e) => setAppSecret(e.target.value)}
                      />
                    </div>
                  </>
                ) : currentPlatform !== 'WhatsApp' && (
                  <div className="space-y-2">
                    <label htmlFor="botToken" className="text-sm font-medium">{currentPlatform} Bot Token</label>
                    <Input
                      id="botToken"
                      placeholder={`Enter ${currentPlatform} Bot Token`}
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="modelId" className="text-sm font-medium">Model ID</label>
                  <Input
                    id="modelId"
                    placeholder="Enter Model ID"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={connectBot}
                  disabled={isConnecting || 
                    (currentPlatform === 'Messenger' && (!accessToken || !verifyToken || !appSecret || !modelId)) ||
                    (currentPlatform !== 'WhatsApp' && currentPlatform !== 'Messenger' && (!botToken || !modelId))}
                  className="w-full bg-purple-500"
                >
                  {isConnecting ? 'Connecting...' : `Connect ${currentPlatform} Bot`}
                </Button>
              </>
            )}
            {connectionStatus && (
              <p className={`text-sm ${connectionStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {connectionStatus}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationDashboard;