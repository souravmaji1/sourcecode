'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Share2, Twitter, Facebook, MessageSquare, Send } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ethers } from 'ethers';
import { useUser } from '@clerk/nextjs';

// Initialize mapboxgl with your access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHozaXdzOTkydXJkMmxzbHA1bnp0bWs1In0.LGUGYHSMfNEeSsk2p94ftw';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px'
};

// ABI and contract address (replace with your actual values)


export default function Web3PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { propertyId } = useParams();
  const { user } = useUser();

  const [coordinates, setCoordinates] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const { webthreeId } = useParams();

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
    const text = `Check out this web3 property listing: ${property.address}, ${property.city}, ${property.state}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_propertyId",
          "type": "uint256"
        }
      ],
      "name": "buyProperty",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "userId",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "useraddress",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "city",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "state",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "zip",
                  "type": "string"
                },
                {
                  "internalType": "int256",
                  "name": "latitude",
                  "type": "int256"
                },
                {
                  "internalType": "int256",
                  "name": "longitude",
                  "type": "int256"
                }
              ],
              "internalType": "struct RealEstateListing.Location",
              "name": "location",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "propertyType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "bedrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "bathrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "squareFootage",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lotSize",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "imageUrl",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Details",
              "name": "details",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "email",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "phone",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Seller",
              "name": "seller",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "securityDeposit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "rentalPrice",
                  "type": "uint256"
                }
              ],
              "internalType": "struct RealEstateListing.Pricing",
              "name": "pricing",
              "type": "tuple"
            }
          ],
          "internalType": "struct RealEstateListing.PropertyInput",
          "name": "input",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "listingType",
          "type": "string"
        }
      ],
      "name": "listProperty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "propertyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "userId",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "PropertyListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "propertyId",
          "type": "uint256"
        }
      ],
      "name": "PropertyRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "propertyId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "PropertySold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "propertyId",
          "type": "uint256"
        }
      ],
      "name": "PropertyUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_propertyId",
          "type": "uint256"
        }
      ],
      "name": "removeProperty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_propertyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newPrice",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_newDescription",
          "type": "string"
        }
      ],
      "name": "updateProperty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllActiveProperties",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "userId",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "useraddress",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "city",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "state",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "zip",
                  "type": "string"
                },
                {
                  "internalType": "int256",
                  "name": "latitude",
                  "type": "int256"
                },
                {
                  "internalType": "int256",
                  "name": "longitude",
                  "type": "int256"
                }
              ],
              "internalType": "struct RealEstateListing.Location",
              "name": "location",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "propertyType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "bedrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "bathrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "squareFootage",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lotSize",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "imageUrl",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Details",
              "name": "details",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "email",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "phone",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Seller",
              "name": "seller",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "securityDeposit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "rentalPrice",
                  "type": "uint256"
                }
              ],
              "internalType": "struct RealEstateListing.Pricing",
              "name": "pricing",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "listingType",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct RealEstateListing.Property[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_propertyId",
          "type": "uint256"
        }
      ],
      "name": "getProperty",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "userId",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "useraddress",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "city",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "state",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "zip",
                  "type": "string"
                },
                {
                  "internalType": "int256",
                  "name": "latitude",
                  "type": "int256"
                },
                {
                  "internalType": "int256",
                  "name": "longitude",
                  "type": "int256"
                }
              ],
              "internalType": "struct RealEstateListing.Location",
              "name": "location",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "propertyType",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "bedrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "bathrooms",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "squareFootage",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lotSize",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "imageUrl",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Details",
              "name": "details",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "email",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "phone",
                  "type": "string"
                }
              ],
              "internalType": "struct RealEstateListing.Seller",
              "name": "seller",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "securityDeposit",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "rentalPrice",
                  "type": "uint256"
                }
              ],
              "internalType": "struct RealEstateListing.Pricing",
              "name": "pricing",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "listingType",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct RealEstateListing.Property",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "properties",
      "outputs": [
        {
          "internalType": "string",
          "name": "userId",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "useraddress",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "city",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "state",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "zip",
              "type": "string"
            },
            {
              "internalType": "int256",
              "name": "latitude",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "longitude",
              "type": "int256"
            }
          ],
          "internalType": "struct RealEstateListing.Location",
          "name": "location",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "propertyType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "bedrooms",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "bathrooms",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "squareFootage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lotSize",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            }
          ],
          "internalType": "struct RealEstateListing.Details",
          "name": "details",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "phone",
              "type": "string"
            }
          ],
          "internalType": "struct RealEstateListing.Seller",
          "name": "seller",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "securityDeposit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "rentalPrice",
              "type": "uint256"
            }
          ],
          "internalType": "struct RealEstateListing.Pricing",
          "name": "pricing",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "listingType",
          "type": "string"
        },
        {
          "internalType": "address payable",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "propertyCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const contractAddress = "0xf1aec139aea4664b10a6dfcb02ba02bd6b2264f8";

  const sendMessage = async () => {
    try {
      // Implement your message sending logic here
      // This could involve interacting with your smart contract or a centralized backend

      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the property owner.'
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
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-testnet-dataseed.bnbchain.org');
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const propertyDetails = await contract.getProperty(webthreeId);
        console.log(propertyDetails);
        
        // Safely extract and format values
        const formatBigNumber = (value, defaultValue = '0') => {
          return value && !value.isZero() ? ethers.utils.formatEther(value) : defaultValue;
        };

        const toNumber = (value, defaultValue = 0) => {
          return value && !value.isZero() ? value.toNumber() : defaultValue;
        };

        setProperty({
          id: webthreeId,
          address: propertyDetails.location?.useraddress || 'N/A',
          city: propertyDetails.location?.city || 'N/A',
          state: propertyDetails.location?.state || 'N/A',
          price: formatBigNumber(propertyDetails.pricing?.price),
          bedrooms: toNumber(propertyDetails.details?.bedrooms),
          bathrooms: toNumber(propertyDetails.details?.bathrooms),
          squareFootage: toNumber(propertyDetails.details?.squareFootage),
          description: propertyDetails.details?.description || 'No description available',
          image_url: propertyDetails.details?.imageUrl || '/placeholder-image.jpg',
          latitude: formatBigNumber(propertyDetails.location?.latitude, '0'),
          longitude: formatBigNumber(propertyDetails.location?.longitude, '0'),
          ownerAddress: propertyDetails.owner || 'Unknown'
        });

        setCoordinates([
          parseFloat(formatBigNumber(propertyDetails.location?.longitude, '0')),
          parseFloat(formatBigNumber(propertyDetails.location?.latitude, '0'))
        ]);
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (webthreeId) {
      fetchPropertyDetails();
    }
  }, [webthreeId]);

  useEffect(() => {
    if (coordinates && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 12
      });

      new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
      map.current.addControl(new mapboxgl.NavigationControl());
    }
  }, [coordinates]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="text-center">No property details found.</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="mb-4 flex items-center justify-between space-y-2">
          <Heading
            title="Web3 Property Details"
            description="View detailed information about the selected web3 property"
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
                  <Button variant="outline" size="icon" onClick={shareOnTwitter}>
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareOnFacebook}>
                    <Facebook className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Owner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Contact Property Owner</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Send a message to the owner about this property. We'll make sure they receive it promptly.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={messageForm.name}
                      onChange={handleMessageFormChange}
                      className="pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Your Email
                    </Label>
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
                  <Button onClick={sendMessage} className="w-full bg-green-600 hover:bg-green-700 text-white">
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
            <CardTitle>{`${property.address}, ${property.city}, ${property.state}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                {property.image_url && (
                  <img
                    src={property.image_url}
                    alt="Property"
                    className="h-auto w-full rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold">Key Details</h2>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Price</TableCell>
                      <TableCell>{`${property.price} ETH`}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bedrooms</TableCell>
                      <TableCell>{property.bedrooms}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bathrooms</TableCell>
                      <TableCell>{property.bathrooms}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Square Feet</TableCell>
                      <TableCell>{property.squareFootage}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Owner Address</TableCell>
                      <TableCell>{`${property.ownerAddress.slice(0, 6)}...${property.ownerAddress.slice(-4)}`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{property.description}</p>
              </CardContent>
            </Card>

            {coordinates && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Property Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={mapContainer} style={mapContainerStyle} />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}