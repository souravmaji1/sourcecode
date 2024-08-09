'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,


  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Share2, Twitter, Facebook, User, Send } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Mail, MessageSquare } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@clerk/nextjs';
import Streetview from 'react-google-streetview';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHozaXdzOTkydXJkMmxzbHA1bnp0bWs1In0.LGUGYHSMfNEeSsk2p94ftw';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px'
};
// Initialize Supabase client
const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

export default function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserListing, setIsUserListing] = useState(false);
  const { kanbanId } = useParams();
  const [mapTab, setMapTab] = useState('normal');
  const { user } = useUser();

  const [coordinates, setCoordinates] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);


  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleMessageFormChange = (e) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const shareOnTwitter = () => {
    const text = `Check out this  http://localhost:3000/dashboard/kanban/${kanbanId}  ${
      isUserListing ? property.listingtype : 'property'
    } listing: ${
      isUserListing
        ? `${property.address}, ${property.city}, ${property.state}`
        : `${property.location.address.line}, ${property.location.address.city}, ${property.location.address.state}`
    }`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, '_blank');
  };

  const sendMessage = async () => {
    try {
      const { data, error } = await supabase.from('chats').insert({
        listing_id: kanbanId,
        sender_name: messageForm.name,
        sender_email: messageForm.email,
        message: messageForm.message,
        sender_id: user.id,
        seller_id: property.userid || 'unknown'
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
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        // First, try to fetch from Supabase (user listings)
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('rentalinformation')
          .select('*')
          .eq('id', kanbanId)
          .single();

        if (supabaseData) {
          setProperty(supabaseData);
          setCoordinates([supabaseData.longitude, supabaseData.latitude]);
          setIsUserListing(true);
        } else {
          // If not found in Supabase, fetch from API
          const response = await axios.get(
            `https://realtor-base.p.rapidapi.com/realtor/homedetails`,
            {
              params: { property_id: kanbanId },
              headers: {
                'x-rapidapi-host': 'realtor-base.p.rapidapi.com',
                'x-rapidapi-key':
                  '21584b3dedmshf00016c0cbfb311p1454d5jsnc4044cc9a45b'
              }
            }
          );
          setProperty(response.data.data);
          console.log(response.data.data);
          setIsUserListing(false);
        }
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (kanbanId) {
      fetchPropertyDetails();
    }
  }, [kanbanId]);

  const NormalMap = React.memo(({ coordinates }) => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
      if (!coordinates) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 12
      });

      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

      map.addControl(new mapboxgl.NavigationControl());

      return () => {
        marker.remove();
        map.remove();
      };
    }, [coordinates]);

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%', borderRadius: '10px' }} />;
  });

  // Street View Component
  const StreetViewMap = React.memo(({ coordinates }) => {
    const streetViewOptions = {
      position: coordinates ? { lat: parseFloat(coordinates[1]), lng: parseFloat(coordinates[0]) } : null,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
    };

    return (
      <div style={{ height: '400px', width: '100%', borderRadius: '10px' }}>
        <Streetview
          apiKey="AIzaSyDouThG6E25LaMNsjVJ_cYVpfh3KHQJ_jM"
          streetViewPanoramaOptions={streetViewOptions}
        />
      </div>
    );
  });
 

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="text-center">No property details found.</div>;
  }

  const getOfficePhone = () => {
    if (
      !isUserListing &&
      property.community &&
      property.community.advertisers
    ) {
      const office = property.community.advertisers[0].office;
      if (office && office.phones && office.phones.length > 0) {
        return office.phones[0].number;
      }
    }
    return 'Not available';
  };


  const streetViewOptions = {
    position: coordinates ? { lat: parseFloat(coordinates[1]), lng: parseFloat(coordinates[0]) } : null,
    pov: { heading: 0, pitch: 0 },
    zoom: 1,
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="mb-4 flex items-center justify-between space-y-2">
          <Heading
            title="Property Details"
            description="View detailed information about the selected property"
          />
          <div className="hidden items-center space-x-2 md:flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex space-x-2 p-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnTwitter}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnFacebook}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogTrigger asChild>
          <Button className=" text-black">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Contact Seller</DialogTitle>
            <DialogDescription className="text-gray-500">
              Send a message to the seller about this property. We'll make sure they receive it promptly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Your Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={messageForm.name}
                  onChange={handleMessageFormChange}
                  className="pl-10"
                  placeholder="John Doe"
                />
              
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Your Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={messageForm.email}
                  onChange={handleMessageFormChange}
                  className="pl-10"
                  placeholder="john@example.com"
                />
             
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Your Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={messageForm.message}
                onChange={handleMessageFormChange}
                rows={4}
                placeholder="I'm interested in this property. Can you provide more details?"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={sendMessage} className="w-full  text-black">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>
              {isUserListing
                ? `${property.address}, ${property.city}, ${property.state}`
                : `${property.location.address.line}, ${property.location.address.city}, ${property.location.address.state}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                {isUserListing && property.image_url ? (
                  <img
                    src={property.image_url}
                    alt="Property"
                    className="h-auto w-full rounded-lg shadow-lg"
                  />
                ) : (
                  !isUserListing &&
                  (property.primary_photo || property.photos[0]) && (
                    <img
                      src={
                        property.primary_photo
                          ? property.primary_photo.href
                          : property.photos[0].href
                      }
                      alt="Property"
                      className="h-auto w-full rounded-lg shadow-lg"
                    />
                  )
                )}
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold">Key Details</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Price</TableCell>
                      <TableCell className='text-white' >
                        {isUserListing
                          ? property.listingtype === 'sale'
                            ? `$${property.price}`
                            : `$${property.rentalprice}/mo`
                          : `$${property.list_price}/mo`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bedrooms</TableCell>
                      <TableCell className='text-white' >
                        {isUserListing
                          ? property.bedrooms
                          : property.description.beds}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bathrooms</TableCell>
                      <TableCell className='text-white' >
                        {isUserListing
                          ? property.bathrooms
                          : property.description.baths}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Square Feet</TableCell>
                      <TableCell className='text-white' >
                        {isUserListing
                          ? property.squarefootage
                          : property.description.sqft}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Property Type
                      </TableCell>
                      <TableCell  className='text-white' >
                        {isUserListing
                          ? property.propertytype
                          : property.description.type}
                      </TableCell>
                    </TableRow>
                    {!isUserListing && (
                      <>
                        <TableRow>
                          <TableCell className="font-medium">
                            Year Built
                          </TableCell>
                          <TableCell>
                            {property.description.year_built}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Price per Sqft
                          </TableCell>
                          <TableCell>${property.price_per_sqft}/sqft</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Office Phone
                          </TableCell>
                          <TableCell>{getOfficePhone()}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {!isUserListing && (
              <Tabs defaultValue="features" className="mt-6">
                <TabsList>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="schools">Schools</TabsTrigger>
                  <TabsTrigger value="price-history">Price History</TabsTrigger>
                </TabsList>
                <TabsContent value="features">
                  <Card>
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className=" gap-2"
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                      >
                        {property.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="schools">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nearby Schools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Distance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {property.schools.schools
                            .slice(0, 3)
                            .map((school, index) => (
                              <TableRow key={index}>
                                <TableCell>{school.name}</TableCell>
                                <TableCell>
                                  {school.education_levels.join(', ')}
                                </TableCell>
                                <TableCell>{school.rating}/10</TableCell>
                                <TableCell>
                                  {school.distance_in_miles.toFixed(1)} miles
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="price-history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Price History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {property.property_history &&
                      property.property_history.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Event</TableHead>
                              <TableHead>Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {property.property_history
                              .slice(0, 5)
                              .map((history, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {new Date(
                                      history.date
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{history.event_name}</TableCell>
                                  <TableCell>${history.price}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p>No price history available for this property.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            <Card className="mt-6" style={{ marginTop: '20px' }}>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-white'>
                  {isUserListing
                    ? property.description
                    : property.description.text}
                </p>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Details:</CardTitle>
              </CardHeader>
              <CardContent>
                <p  className='text-white' >Seller Name: {property.sellername}</p>
                <p className='text-white' >Email: {property.selleremail}</p>
                <p className='text-white'  >Phone No: {property.sellerphone}</p>
              </CardContent>
            </Card>

       

{coordinates && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Property Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mapTab} onValueChange={setMapTab}>
              <TabsList>
                <TabsTrigger value="normal">Normal Map</TabsTrigger>
                <TabsTrigger value="street">Street View</TabsTrigger>
              </TabsList>
              <TabsContent value="normal">
              {mapTab === 'normal' && <NormalMap coordinates={coordinates} />}
            </TabsContent>
            <TabsContent value="street">
              {mapTab === 'street' && <StreetViewMap coordinates={coordinates} />}
            </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}






          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

function PropertyDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <div>
              <Skeleton className="mb-4 h-8 w-1/2" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Skeleton className="mb-4 h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
