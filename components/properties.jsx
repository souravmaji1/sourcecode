'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Home, Building, Filter, Eye, Users, Sofa, Share2 } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Initialize Supabase client
const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

// ABI and contract address (you'll need to replace these with your actual values)
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

export default function RealtorListings() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState('rent');
  const [locations, setLocations] = useState([]);
  const [web3Listings, setWeb3Listings] = useState([]);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    minRent: '',
    maxRent: '',
    securityDeposit: ''
  });

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filtered;
    if (listingType === 'web3') {
      filtered = web3Listings.filter((listing) => {
        const basicFilters =
          (!filters.location ||
            listing.city.toLowerCase() === filters.location.toLowerCase()) &&
          (!filters.bedrooms || parseInt(listing.bedrooms) >= parseInt(filters.bedrooms)) &&
          (!filters.bathrooms || parseInt(listing.bathrooms) >= parseInt(filters.bathrooms));

        if (listing.listingType === 'rent') {
          return (
            basicFilters &&
            (!filters.minRent || parseFloat(listing.rentalPrice) >= parseFloat(filters.minRent)) &&
            (!filters.maxRent || parseFloat(listing.rentalPrice) <= parseFloat(filters.maxRent)) &&
            (!filters.securityDeposit || parseFloat(listing.securityDeposit) <= parseFloat(filters.securityDeposit))
          );
        } else if (listing.listingType === 'sale') {
          return (
            basicFilters &&
            (!filters.minPrice || parseFloat(listing.price) >= parseFloat(filters.minPrice)) &&
            (!filters.maxPrice || parseFloat(listing.price) <= parseFloat(filters.maxPrice))
          );
        }
        return basicFilters;
      });
    } else {
      filtered = allListings.filter((listing) => {
        if (listing.listingtype !== listingType) return false;

        const basicFilters =
          (!filters.location ||
            listing.city.toLowerCase() === filters.location.toLowerCase()) &&
          (!filters.bedrooms || listing.bedrooms >= parseInt(filters.bedrooms)) &&
          (!filters.bathrooms || listing.bathrooms >= parseInt(filters.bathrooms));

        switch (listingType) {
          case 'rent':
            return (
              basicFilters &&
              (!filters.minRent || listing.rentalprice >= parseFloat(filters.minRent)) &&
              (!filters.maxRent || listing.rentalprice <= parseFloat(filters.maxRent)) &&
              (!filters.securityDeposit || listing.securitydeposit <= parseFloat(filters.securityDeposit))
            );
          case 'sale':
            return (
              basicFilters &&
              (!filters.minPrice || listing.price >= parseFloat(filters.minPrice)) &&
              (!filters.maxPrice || listing.price <= parseFloat(filters.maxPrice))
            );
          case 'showcase':
          case 'findingpartners':
          case 'unfurnished':
            return basicFilters;
          default:
            return false;
        }
      });
    }

    setFilteredListings(filtered);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listingType, filters, allListings, web3Listings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rentalinformation')
        .select('*');

      if (error) throw error;
      setAllListings(data);
      setFilteredListings(
        data.filter((listing) => listing.listingtype === listingType)
      );

      // Extract unique locations
      const uniqueLocations = [...new Set(data.map((listing) => listing.city))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching Supabase listings:', error);
    }
    setLoading(false);
  };

  const fetchWeb3Listings = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-testnet-dataseed.bnbchain.org');
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const activeProperties = await contract.getAllActiveProperties();
      
      const formattedProperties = activeProperties.map((prop, index) => ({
        id: index.toString(), // Using index as id since the returned data doesn't seem to have a unique identifier
        userID: prop[0],
        address: prop[1][0],
        city: prop[1][1],
        state: prop[1][2],
        zip: prop[1][3],
        latitude: ethers.utils.formatUnits(prop[1][4], 0),
        longitude: ethers.utils.formatUnits(prop[1][5], 0),
        propertyType: prop[2][0],
        bedrooms: ethers.utils.formatUnits(prop[2][1], 0),
        bathrooms: ethers.utils.formatUnits(prop[2][2], 0),
        squareFootage: ethers.utils.formatUnits(prop[2][3], 0),
        lotSize: ethers.utils.formatUnits(prop[2][4], 0),
        description: prop[2][5],
        image_url: prop[2][6],
        sellerName: prop[3][0],
        sellerEmail: prop[3][1],
        sellerPhone: prop[3][2],
        price: ethers.utils.formatEther(prop[4][0]),
        securityDeposit: ethers.utils.formatEther(prop[4][1]),
        rentalPrice: ethers.utils.formatEther(prop[4][2]),
        listingType: prop[5],
        owner: prop[6],
        isActive: prop[7]
      }));

      setWeb3Listings(formattedProperties);
      setFilteredListings(formattedProperties);
    } catch (error) {
      console.error('Error fetching Web3 listings:', error);
    }
    setLoading(false);
  };

  const handleTypeChange = (type) => {
    setListingType(type);
    if (type === 'web3') {
      fetchWeb3Listings();
    } else {
      applyFilters();
    }
    // Reset filters when changing listing type
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      minRent: '',
      maxRent: '',
      securityDeposit: ''
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const renderListing = (listing) => (
    <Card key={listing.id} className="overflow-hidden">
      <div className="relative h-48">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt="Property"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <Badge className="absolute right-2 top-2">{listing.listingType || listing.listingtype}</Badge>
      </div>
      <CardContent className="p-4">
        <h2 className="mb-2 text-lg font-semibold">
          {`${listing.address || listing.useraddress}, ${listing.city}, ${listing.state}`}
        </h2>
        <p className="text-sm text-gray-600">
          {listing.created_at ? `Listed on: ${new Date(listing.created_at).toLocaleDateString()}` : 'Web3 Listing'}
        </p>
        {(listing.listingType === 'sale' || listing.listingtype === 'sale') && (
          <p className="mt-2 text-sm font-bold">Price: ${listing.price}</p>
        )}
        {(listing.listingType === 'rent' || listing.listingtype === 'rent') && (
          <>
            <p className="mt-2 text-sm font-bold">
              Rent: ${listing.rentalPrice || listing.rentalprice}/mo
            </p>
            <p className="text-sm text-gray-600">
              Security Deposit: ${listing.securityDeposit || listing.securitydeposit}
            </p>
          </>
        )}
        <p className="mt-1 text-sm text-gray-600">
          {`${listing.bedrooms} bed, ${listing.bathrooms} bath`}
        </p>
        <Badge className="mt-2">
          {listing.listingType === 'showcase' || listing.listingtype === 'showcase'
            ? 'Showcase'
            : listing.listingType === 'findingpartners' || listing.listingtype === 'findingpartners'
            ? 'Finding Partners'
            : listing.listingType === 'web3'
            ? 'Web3 Listing'
            : 'User Listing'}
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="mb-4">
      <div className="mb-4 flex items-center justify-between space-y-2">
        <Heading
          title="Properties Section"
          description="View all Listed Properties based on your filters"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
              <SheetDescription>
                Set your preferences to filter the listings.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {(listingType === 'sale' || listingType === 'web3') && (
                <>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="minPrice">Min Price</Label>
                    <Input
                      id="minPrice"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange('minPrice', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="maxPrice">Max Price</Label>
                    <Input
                      id="maxPrice"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', e.target.value)
                      }
                    />
                  </div>
                </>
              )}
              {(listingType === 'rent' || listingType === 'web3') && (
                <>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="minRent">Min Rent</Label>
                    <Input
                      id="minRent"
                      name="minRent"
                      value={filters.minRent}
                      onChange={(e) =>
                        handleFilterChange('minRent', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="maxRent">Max Rent</Label>
                    <Input
                      id="maxRent"
                      name="maxRent"
                      value={filters.maxRent}
                      onChange={(e) =>
                        handleFilterChange('maxRent', e.target.value)
                      }
                    />
                  </div>



                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="securityDeposit">
                      Max Security Deposit
                    </Label>
                    <Input
                      id="securityDeposit"
                      name="securityDeposit"
                      value={filters.securityDeposit}
                      onChange={(e) =>
                        handleFilterChange('securityDeposit', e.target.value)
                      }
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="location">Location</Label>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange('location', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={(e) =>
                    handleFilterChange('bedrooms', e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={(e) =>
                    handleFilterChange('bathrooms', e.target.value)
                  }
                />
              </div>
            </div>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </SheetContent>
        </Sheet>
      </div>

      <Separator />

      <div className="mt-4 flex items-center space-x-2">
        <Button
          onClick={() => handleTypeChange('rent')}
          variant={listingType === 'rent' ? 'default' : 'outline'}
        >
          <Building className="mr-2 h-4 w-4" /> Rent
        </Button>
        <Button
          onClick={() => handleTypeChange('sale')}
          variant={listingType === 'sale' ? 'default' : 'outline'}
        >
          <Home className="mr-2 h-4 w-4" /> Sale
        </Button>
        <Button
          onClick={() => handleTypeChange('showcase')}
          variant={listingType === 'showcase' ? 'default' : 'outline'}
        >
          <Eye className="mr-2 h-4 w-4" /> Showcase
        </Button>
        <Button
          onClick={() => handleTypeChange('findingpartners')}
          variant={listingType === 'findingpartners' ? 'default' : 'outline'}
        >
          <Users className="mr-2 h-4 w-4" /> Want Partners
        </Button>
        <Button
          onClick={() => handleTypeChange('unfurnished')}
          variant={listingType === 'unfurnished' ? 'default' : 'outline'}
        >
          <Sofa className="mr-2 h-4 w-4" /> Unfurnished
        </Button>
        <Button
          onClick={() => handleTypeChange('web3')}
          variant={listingType === 'web3' ? 'default' : 'outline'}
        >
          <Share2 className="mr-2 h-4 w-4" /> Web3
        </Button>
      </div>

      <ScrollArea className="mt-4 h-[80vh]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
           <Link
           key={listing.id}
           href={
             listingType === 'web3'
               ? `/dashboard/webthree/${listing.id}`
               : `/dashboard/kanban/${listing.id}`
           }
           passHref
         >
              {renderListing(listing)}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
