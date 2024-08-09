'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Video, Calendar, DollarSign, FileText, Send, MessageCircle, User, Inbox, PaperPlane } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

const MeetingMessage = ({ meetingLink }) => {
  return (
    <div className="my-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-2 flex items-center">
        <Video className="mr-2 text-blue-500" />
        <span className="font-semibold text-blue-700">
          Zoom Meeting Created
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-600">
        A new Zoom meeting has been scheduled.
      </p>
      <a
        href={meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Join Meeting
      </a>
    </div>
  );
};

const PaymentMessage = ({ amount, currency, status }) => {
  return (
    <div
      className={`bg-${
        status === 'completed' ? 'green' : 'yellow'
      }-50 border border-${
        status === 'completed' ? 'green' : 'yellow'
      }-200 my-2 rounded-lg p-4`}
    >
      <div className="mb-2 flex items-center">
        <DollarSign
          className={`text-${
            status === 'completed' ? 'green' : 'yellow'
          }-500 mr-2`}
        />
        <span
          className={`font-semibold text-${
            status === 'completed' ? 'green' : 'yellow'
          }-700`}
        >
          Payment {status === 'completed' ? 'Completed' : 'Initiated'}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        Amount: {amount} {currency}
      </p>
      <p className="text-sm text-gray-600">Status: {status}</p>
    </div>
  );
};

const MeetingsDialog = ({ meetings }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scheduled Meetings</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="mb-4 rounded border p-2">
              <p>
                <strong>Topic:</strong> {meeting.topic}
              </p>
              <p>
                <strong>Time:</strong>{' '}
                {new Date(meeting.start_time).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong> {meeting.duration} minutes
              </p>
              <a
                href={meeting.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Join Meeting
              </a>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default function MessageCenter() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [activeTab, setActiveTab] = useState('sent');
  const [loading, setLoading] = useState(true);
  const [isProfessional, setIsProfessional] = useState(false);
  const [professionals, setProfessionals] = useState({});
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomMeetingData, setZoomMeetingData] = useState({
    topic: '',
    start_time: '',
    duration: 30
  });
  const [meetings, setMeetings] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [professionalPaypalEmail, setProfessionalPaypalEmail] = useState('');

  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [escrowData, setEscrowData] = useState({
    description: '',
    amount: '',
    buyerEmail: '',
    sellerEmail: ''
  });

  

  useEffect(() => {
    if (user) {
      checkIfProfessional();
      fetchMessages();
      fetchMeetings();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (selectedThread) {
      fetchProfessionalPaypalEmail(selectedThread.professionid);
    }
  }, [selectedThread]);

  const checkIfProfessional = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id')
        .eq('userid', user.id)
        .single();

      if (error) throw error;
      setIsProfessional(!!data);
    } catch (error) {
      console.error('Error checking if user is professional:', error);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionalchat')
        .select('*')
        .or(`sender_id.eq.${user.id},professionid.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);

      const uniqueProfessionIds = [
        ...new Set(data.map((msg) => msg.professionid))
      ];
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('userid, fullName')
        .in('userid', uniqueProfessionIds);

      if (profError) throw profError;

      const profMap = {};
      profData.forEach((prof) => {
        profMap[prof.userid] = prof.fullName;
      });
      setProfessionals(profMap);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .or(
          `sender_email.eq.${user.primaryEmailAddress?.emailAddress},professional_email.eq.${user.primaryEmailAddress?.emailAddress}`
        )
        .order('start_time', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    await sendMessage(replyMessage);
    setReplyMessage('');
  };

  const handlePayment = async (details) => {
    try {
      const paymentMessage = `Payment of ${details.purchase_units[0].amount.value} ${details.purchase_units[0].amount.currency_code} sent to ${details.purchase_units[0].payee.email_address}.`;

      const { data, error } = await supabase.from('professionalchat').insert({
        sender_id: user.id,
        sender_name: user.fullName || 'User',
        sender_email: user.primaryEmailAddress?.emailAddress,
        professionid: selectedThread.professionid,
        recipient_id: selectedThread.professionid,
        recipient_name: professionals[selectedThread.professionid],
        message: paymentMessage,
        is_payment: true,
        payment_amount: details.purchase_units[0].amount.value,
        payment_currency: details.purchase_units[0].amount.currency_code,
        payment_status: 'completed',
        paypal_transaction_id: details.id
      });

      if (error) throw error;

      setIsPaymentModalOpen(false);
      fetchMessages();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const createZoomMeeting = async () => {
    try {
      const response = await fetch('http://localhost:4000/create-zoom-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...zoomMeetingData,
          invitees: [selectedThread.sender_email]
        })
      });

      const data = await response.json();

      if (data.success) {
        const meetingMessage = `Zoom meeting created: ${data.meetingLink}`;
        await sendMessage(meetingMessage);

        // Save the Zoom meeting message for both parties
        const newMessage = {
          sender_id: user.id,
          sender_name: user.fullName || 'User',
          sender_email: user.primaryEmailAddress?.emailAddress,
          professionid: isProfessional ? user.id : selectedThread.professionid,
          recipient_id: isProfessional
            ? selectedThread.sender_id
            : selectedThread.professionid,
          recipient_name: isProfessional
            ? selectedThread.sender_name
            : professionals[selectedThread.professionid],
          message: meetingMessage
        };

        const { data: msgData, error: msgError } = await supabase
          .from('professionalchat')
          .insert(newMessage);

        if (msgError) throw msgError;

        // Store meeting information in Supabase
        const { error } = await supabase.from('meetings').insert({
          topic: zoomMeetingData.topic,
          start_time: zoomMeetingData.start_time,
          duration: zoomMeetingData.duration,
          join_url: data.meetingLink,
          sender_email: user.primaryEmailAddress?.emailAddress,
          professional_email: selectedThread.sender_email
        });

        if (error) throw error;

        fetchMeetings();
        setIsZoomModalOpen(false);
      } else {
        console.error('Failed to create Zoom meeting:', data.error);
      }
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
    }
  };

  const fetchProfessionalPaypalEmail = async (professionId) => {
    const { data, error } = await supabase
      .from('professionals')
      .select('paypal_email')
      .eq('userid', professionId)
      .single();

    if (error) {
      console.error('Error fetching professional PayPal email:', error);
    } else {
      setProfessionalPaypalEmail(data.paypal_email);
    }
  };

  const sendMessage = async (message) => {
    const newMessage = {
      sender_id: user.id,
      sender_name: user.fullName || 'User',
      sender_email: user.primaryEmailAddress?.emailAddress,
      professionid: isProfessional ? user.id : selectedThread.professionid,
      recipient_id: isProfessional
        ? selectedThread.sender_id
        : selectedThread.professionid,
      recipient_name: isProfessional
        ? selectedThread.sender_name
        : professionals[selectedThread.professionid],
      message: message
    };

    try {
      const { data, error } = await supabase
        .from('professionalchat')
        .insert(newMessage);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEscrowInputChange = (e) => {
    const { name, value } = e.target;
    setEscrowData((prev) => ({ ...prev, [name]: value }));
  };

 // Next.js component

 const createEscrowTransaction = async () => {
  try {
    const response = await fetch('http://localhost:5000/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyerEmail: escrowData.buyerEmail,
        sellerEmail: escrowData.sellerEmail,
        amount: parseFloat(escrowData.amount),
        description: escrowData.description
      })
    });

    const data = await response.json();

    if (response.ok) {
      const escrowMessage = `Escrow transaction created: ${data.id}`;
      await sendMessage(escrowMessage);
      setIsEscrowModalOpen(false);
      setEscrowData({ description: '', amount: '', buyerEmail: '', sellerEmail: '' }); // Reset form
    } else {
      console.error('Failed to create Escrow transaction:', data.error);
      // You might want to show an error message to the user here
    }
  } catch (error) {
    console.error('Error creating Escrow transaction:', error);
    // You might want to show an error message to the user here
  }
};

  const handleZoomInputChange = (e) => {
    const { name, value } = e.target;
    setZoomMeetingData((prev) => ({ ...prev, [name]: value }));
  };

  const groupMessagesByThread = () => {
    const grouped = {};
    messages.forEach((msg) => {
      if (msg) {
        const key = isProfessional ? msg.sender_id : msg.professionid;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(msg);
      }
    });
    return grouped;
  };

  const renderMessageContent = (msg) => {
    if (msg.message.startsWith('Zoom meeting created:')) {
      const meetingLink = msg.message.split(': ')[1];
      return <MeetingMessage meetingLink={meetingLink} />;
    } else if (msg.is_payment) {
      return (
        <PaymentMessage
          amount={msg.payment_amount}
          currency={msg.payment_currency}
          status={msg.payment_status}
        />
      );
    }
    return <p className="mt-1">{msg.message || 'No message'}</p>;
  };

  const renderThreadList = () => (
    <Card className="w-1/4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Chats</CardTitle>
        <CardDescription>Select a contact to start chatting</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {Object.entries(groupMessagesByThread()).map(([threadId, thread]) => (
            <div key={threadId} className="mb-2">
              <Button
                variant={selectedThread?.id === thread[0].id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleThreadSelect(thread[0])}
              >
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${threadId}`} />
                  <AvatarFallback>
                    {(isProfessional
                      ? thread[0]?.sender_name
                      : professionals[thread[0]?.professionid] || 'Unknown'
                    ).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2">
                  {isProfessional
                    ? thread[0]?.sender_name || 'Unknown'
                    : professionals[thread[0]?.professionid] || 'Unknown Professional'}
                </span>
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderMessageHistory = () => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Message History</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedThread ? (
          <>
            <ScrollArea className="mb-4 h-[220px]">
              {(
                groupMessagesByThread()[
                  isProfessional
                    ? selectedThread.sender_id
                    : selectedThread.professionid
                ] || []
              )
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {msg.sender_name && msg.sender_name.length > 0
                            ? msg.sender_name[0].toUpperCase()
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {isProfessional
                            ? msg.sender_id === user.id
                              ? 'You'
                              : msg.sender_name
                            : msg.sender_id === user.id
                            ? 'You'
                            : professionals[msg.professionid] || 'Professional'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleString()
                            : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    {renderMessageContent(msg)}
                    <Separator className="my-2" />
                  </div>
                ))}
            </ScrollArea>
            <div className="flex items-center gap-2">
              <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Zoom Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      name="topic"
                      placeholder="Meeting Topic"
                      value={zoomMeetingData.topic}
                      onChange={handleZoomInputChange}
                    />
                    <Input
                      name="start_time"
                      type="datetime-local"
                      value={zoomMeetingData.start_time}
                      onChange={handleZoomInputChange}
                    />
                    <Input
                      name="duration"
                      type="number"
                      placeholder="Duration (minutes)"
                      value={zoomMeetingData.duration}
                      onChange={handleZoomInputChange}
                    />
                    <Button onClick={createZoomMeeting}>Create Meeting</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {!isProfessional && (
                <Dialog open={isEscrowModalOpen} onOpenChange={setIsEscrowModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Escrow Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        name="description"
                        placeholder="Transaction Description"
                        value={escrowData.description}
                        onChange={handleEscrowInputChange}
                      />
                      <Input
                        name="amount"
                        type="number"
                        placeholder="Amount (USD)"
                        value={escrowData.amount}
                        onChange={handleEscrowInputChange}
                      />
                      <Input
                        name="buyerEmail"
                        type="email"
                        placeholder="Buyer Email"
                        value={escrowData.buyerEmail}
                        onChange={handleEscrowInputChange}
                      />
                      <Input
                        name="sellerEmail"
                        type="email"
                        placeholder="Seller Email"
                        value={escrowData.sellerEmail}
                        onChange={handleEscrowInputChange}
                      />
                      <Button onClick={createEscrowTransaction}>Create Escrow Transaction</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}



              <Dialog
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Payment</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <PayPalScriptProvider
                      options={{
                        'client-id':
                          'AQ3hHQbVcAFxIVpKOip-LluE3whXGHLeLpI215fswm7_9ulbeO6vlwMxpN5tE7vdQN8ej44pvFleU91r'
                      }}
                    >
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: '30'
                                },
                                payee: {
                                  email_address:
                                    'sb-v43ogm25175136@business.example.com'
                                }
                              }
                            ]
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            handlePayment(details);
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </DialogContent>
              </Dialog>
              <Input
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="flex-grow"
              />
              <Button onClick={handleReply}>Send</Button>
            </div>
          </>
        ) : (
          <p>Select a thread to view messages</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
     <Card className='p-4'>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        
        <TabsContent value="sent">
          <div className="grid grid-cols-2 gap-4">
            {renderThreadList()}
            {renderMessageHistory()}
          </div>
        </TabsContent>
        <TabsContent value="received">
          <div className="grid grid-cols-2 gap-4">
            {renderThreadList()}
            {renderMessageHistory()}
          </div>
        </TabsContent>
      </Tabs>
      </Card>
    </div>
  );
}
