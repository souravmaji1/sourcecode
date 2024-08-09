'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Search,
  MapPin,
  Star,
  Briefcase,
  ArrowLeft,
  Badge,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { createClient } from '@supabase/supabase-js';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import Vapi from '@vapi-ai/web';
import { toast } from '@/components/ui/use-toast';
import { CardDescription
} from '@/components/ui/card';
import { DialogFooter } from '@/components/ui/dialog';

const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

export default function RedesignedProfessionalsPage() {
  const [filters, setFilters] = useState({
    location: '',
    specialty: '',
    rating: ''
  });
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('professionals').select('*');
      if (error) throw error;
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setError('Failed to fetch professionals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      const { location, specialty, rating } = filters;
      return (
        (location === '' ||
          professional.city.toLowerCase() === location.toLowerCase()) &&
        (specialty === '' ||
          professional.profession.toLowerCase() === specialty.toLowerCase()) &&
        (rating === '' || professional.rating >= parseInt(rating))
      );
    });
  }, [professionals, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white  py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Heading
          title="Find Your Professional"
          description="Connect with experts and get your work done as quick as possible"
        />
        <div className="hidden items-center space-x-2 md:flex">
          <Link href="/dashboard/professionform">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>

      <Separator />

      <Card className="mb-8 mt-4 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Filter Professionals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {[...new Set(professionals.map((p) => p.city))].map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.specialty}
              onValueChange={(value) => handleFilterChange('specialty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {[...new Set(professionals.map((p) => p.profession))].map(
                  (profession) => (
                    <SelectItem
                      key={profession}
                      value={profession.toLowerCase()}
                    >
                      {profession}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select
              value={filters.rating}
              onValueChange={(value) => handleFilterChange('rating', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars &amp; Up</SelectItem>
                <SelectItem value="3">3 Stars &amp; Up</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {filteredProfessionals.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-8 text-center shadow-md">
          <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold">No professionals found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search for different criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfessionals.map((professional) => (
            <Card
              key={professional.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={professional.avatar}
                      alt={professional.fullName}
                    />
                    <AvatarFallback style={{ width: '6vw' }}>
                      {professional.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {professional.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {professional.profession}
                    </p>
                  </div>
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {professional.about}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {professional.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />5
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="p-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => setSelectedProfessional(professional)}
                    >
                      View Profile
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto ">
                   
                      <ProfessionalProfile
                        professional={selectedProfessional}
                      />
                  
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfessionalProfile({ professional }) {
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleMessageFormChange = (e) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const sendMessage = async () => {
    try {
      const { data, error } = await supabase.from('professionalchat').insert({
        sender_name: messageForm.name,
        sender_email: messageForm.email,
        sender_id: user.id,
        message: messageForm.message,
        professionid: professional.userid || 'unknown',
        recipient_name: professional.fullName
      });

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the seller.'
      });

      setMessageForm({ name: '', email: '', message: '' });
      setIsMessageDialogOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const vapiInstance = new Vapi('67b304bb-8cc0-4f4a-91fd-ebd0538e00d8');
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      console.log('Call has started.');
      setIsCallActive(true);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call has ended.');
      setIsCallActive(false);
    });

    vapiInstance.on('message', (msg) => {
      console.log('Received message:', msg);
      setMessage(JSON.stringify(msg, null, 2));
    });

    vapiInstance.on('error', (e) => {
      console.error('Error:', e);
    });

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, []);

  const startCall = () => {
    if (vapi) {
      vapi.start({
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US'
        },
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant for ${professional.fullName}, a ${professional.profession}. Use the following content to assist users: ${professional.aiContent}`
            }
          ]
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer'
        },
        name: `Vapi Demo Assistant`
      });
    }
  };

  const stopCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  if (!professional) return null;

  return (
   
      <div className="space-y-6 ">
        <SheetHeader>
          <div className="flex items-center space-x-4" style={{ gap: '10px' }}>
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={professional.avatar}
                alt={professional.fullName}
              />
              <AvatarFallback style={{ width: '62px', height: '62px' }}>
                {professional.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold">
                {professional.fullName}
              </SheetTitle>
              <p className="text-muted-foreground">{professional.profession}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <MapPin className="mr-1 h-3 w-3" />
            {professional.city}
          </Badge>
          <Badge variant="secondary">
            <Star className="mr-1 h-3 w-3" />
            {professional.rating}
          </Badge>
        </div>

        <Separator />

        <SheetDescription>
          <h3 className="mb-2 text-lg font-semibold">About</h3>
          <p className="text-sm text-gray-600">{professional.about}</p>
        </SheetDescription>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Contact Information</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{professional.phone || 'N/A'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{professional.email || 'N/A'}</span>
              </li>
              <li className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{professional.website || 'N/A'}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Professional Details</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Skills: {professional.skills} years</span>
              </li>
              <li className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Specializations: {professional.profession} </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-2 text-lg font-semibold">AI Assistant</h3>
            <div className="space-y-2" style={{ display: 'grid' }}>
              <Button onClick={startCall} disabled={isCallActive}>
                Start Call
              </Button>
              <Button onClick={stopCall} disabled={!isCallActive}>
                End Call
              </Button>
            </div>
            {message && (
              <div className="mt-4">
                <h4 className="font-semibold">Last Message:</h4>
                <pre className="whitespace-pre-wrap rounded bg-gray-100 p-2 text-sm">
                  {message}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-6">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">Contact Professional</CardTitle>
    <CardDescription>Send a message to {professional.fullName}</CardDescription>
  </CardHeader>
  <CardContent>
    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-black">
          <Mail className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Contact {professional.fullName}</DialogTitle>
          <DialogDescription>
            Fill out the form below to send a message directly to the professional.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={messageForm.name}
              onChange={handleMessageFormChange}
              placeholder="John Doe"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Your Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={messageForm.email}
              onChange={handleMessageFormChange}
              placeholder="johndoe@example.com"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">Your Message</Label>
            <Textarea
              id="message"
              name="message"
              value={messageForm.message}
              onChange={handleMessageFormChange}
              placeholder="Write your message here..."
              className="w-full min-h-[100px]"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full  text-black">
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </CardContent>
</Card>
      </div>
  
  );
}
