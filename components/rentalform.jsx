'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { Plus, Code } from 'lucide-react';
import Confetti from 'react-confetti';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { ethers } from 'ethers';
// Initialize Supabase client
const supabase = createClient(
  'https://tbnfcmekmqbhxfvrzmbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibmZjbWVrbXFiaHhmdnJ6bWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDg1MjkyNSwiZXhwIjoyMDM2NDI4OTI1fQ.QPyLbV_M2ZGvw_bpbpPZui4HBtODsDHhFR92p4Yos1I'
);

export default function PropertyListingForm() {
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0
  });

  const detectSize = useCallback(() => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const [isAgent, setIsAgent] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        const signer = provider.getSigner();
        setSigner(signer);
        
        const account = await signer.getAddress();
        setAccount(account);
        
        setIsWalletConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      setError('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    detectSize();
    return () => window.removeEventListener('resize', detectSize);
  }, [detectSize]);

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

  const [listingMethod, setListingMethod] = useState('platform');

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    propertytype: '',
    bedrooms: '',
    bathrooms: '',
    squarefootage: '',
    lotsize: '',
    price: '',
    sellername: '',
    selleremail: '',
    sellerphone: '',
    description: '',
    listingtype: '',
    securitydeposit: '',
    rentalprice: '',
    latitude: '',
    longitude: ''
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdListingId, setCreatedListingId] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      setUploading(true);
      const { error: uploadError } = await supabase.storage
        .from('rentalinformation')
        .upload(filePath, image);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
        error: urlError
      } = supabase.storage.from('rentalinformation').getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      setError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('userid', user.id)
      .single();

    if (data) {
      setIsAgent(data.role === 'agent');
    } else {
      setIsAgent('notagent');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      setError('No user logged in');
      return;
    }

    let imageUrl = null;
    if (image) {
    imageUrl = await uploadImage();
    if (!imageUrl) return; // Stop if image upload failed
    }

    if (listingMethod === 'platform') {
      if (!isAgent && !paymentCompleted) {
        setShowPayPal(true);
        return;
      }
      await listPropertyOnPlatform();
    } else if (listingMethod === 'blockchain') {
      if (!isWalletConnected) {
        setError('Please connect your wallet first.');
        return;
      }
      await listPropertyOnBlockchain(imageUrl);
    }
  };

  const listPropertyOnPlatform = async () => {
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // Stop if image upload failed
      }

      const { data, error } = await supabase
        .from('rentalinformation')
        .insert([
          {
            userid: user.id,
            ...formData,
            image_url: imageUrl
          }
        ])
        .select();

      if (error) throw error;

      handleSuccessfulListing(data[0].id);
    } catch (error) {
      handleListingError('Failed to create property listing on platform. Please try again.');
    }
  };

  const listPropertyOnBlockchain = async (imageUrl) => {
    if (!signer || !account) {
      setError('Wallet is not connected. Please connect your wallet first.');
      return;
    }
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Helper function to safely parse numeric values
      const safeParseEther = (value) => {
        if (!value || value === '') return ethers.utils.parseEther('0');
        return ethers.utils.parseEther(value.toString());
      };
  
      const safeParseUnits = (value, decimals = 18) => {
        if (!value || value === '') return ethers.utils.parseUnits('0', decimals);
        return ethers.utils.parseUnits(value.toString(), decimals);
      };
  
      const safeParseBigNumber = (value) => {
        if (!value || value === '') return ethers.BigNumber.from(0);
        return ethers.BigNumber.from(value.toString());
      };
  
      const propertyInput = {
        userId: user.id,
        location: {
          useraddress: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          zip: formData.zip || '',
          latitude: safeParseUnits(formData.latitude),
          longitude: safeParseUnits(formData.longitude)
        },
        details: {
          propertyType: formData.propertytype || '',
          bedrooms: safeParseBigNumber(formData.bedrooms),
          bathrooms: safeParseBigNumber(formData.bathrooms),
          squareFootage: safeParseBigNumber(formData.squarefootage),
          lotSize: safeParseBigNumber(formData.lotsize),
          description: formData.description || '',
          imageUrl: imageUrl || ''
        },
        seller: {
          name: formData.sellername || '',
          email: formData.selleremail || '',
          phone: formData.sellerphone || ''
        },
        pricing: {
          price: safeParseEther(formData.price),
          securityDeposit: safeParseEther(formData.securitydeposit),
          rentalPrice: safeParseEther(formData.rentalprice)
        }
      };
  
      console.log('Property Input:', propertyInput); // Log the input for debugging
  
      const tx = await contract.listProperty(propertyInput, formData.listingtype || '', {
        gasLimit: 1000000 // Adjust this value as needed
      });
      await tx.wait();
  
      handleSuccessfulListing('blockchain');
    } catch (error) {
      console.error('Blockchain Error:', error); // Log the full error
      handleListingError('Failed to list property on blockchain. Please try again.');
    }
  };

  const handleSuccessfulListing = (id) => {
    console.log('Property listing added successfully:', id);
    setShowConfetti(true);
    setSuccess(true);
    setCreatedListingId(id);
    resetForm();
  };

  const handleListingError = (errorMessage) => {
    console.error('Error listing property:', errorMessage);
    setError(errorMessage);
  };

  const resetForm = () => {
    setFormData({
      address: '',
      city: '',
      state: '',
      zip: '',
      propertytype: '',
      bedrooms: '',
      bathrooms: '',
      squarefootage: '',
      lotsize: '',
      price: '',
      sellername: '',
      selleremail: '',
      sellerphone: '',
      description: '',
      listingtype: '',
      securitydeposit: '',
      rentalprice: '',
      latitude: '',
      longitude: ''
    });
    setImage(null);
  };


  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={1000}
          gravity={0.5}
          initialVelocityY={20}
          initialVelocityX={10}
          explosionForce={5}
          colors={[
            '#ff0000',
            '#00ff00',
            '#0000ff',
            '#ffff00',
            '#ff00ff',
            '#00ffff'
          ]}
        />
      )}

      <div className="mb-4 flex items-center justify-between space-y-2">
        <Heading
          title="List Your Property"
          description="You just need to fill the form to list your Property for sale or rent"
        />
        <div className="hidden items-center space-x-2 md:flex">
          <Link href="/dashboard">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <Card className="">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Fill all the Details{' '}
          </CardTitle>
          <CardDescription>
            Enter the details below to advertise your property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && (
            <div className="mb-4 text-green-500">
              Property listing created successfully!
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid gap-2 mt-4">
            <Label htmlFor="listingMethod" className="text-sm font-medium">
              Listing Method
            </Label>
            <Select
              id="listingMethod"
              value={listingMethod}
              onValueChange={(value) => setListingMethod(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select listing method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">List on Platform</SelectItem>
                <SelectItem value="blockchain">List on Blockchain</SelectItem>
              </SelectContent>
            </Select>
          </div>
                <div className="grid gap-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="San Francisco"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="CA"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zip" className="text-sm font-medium">
                    Zip Code
                  </Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="94101"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude" className="text-sm font-medium">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="37.7749"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude" className="text-sm font-medium">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="-122.4194"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="propertytype" className="text-sm font-medium">
                  Property Type
                </Label>
                <Select
                  id="propertytype"
                  value={formData.propertytype}
                  onValueChange={(value) =>
                    handleSelectChange('propertytype', value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">
                      Single-Family Home
                    </SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bedrooms" className="text-sm font-medium">
                    Bedrooms
                  </Label>
                  <Select
                    id="bedrooms"
                    value={formData.bedrooms}
                    onValueChange={(value) =>
                      handleSelectChange('bedrooms', value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bathrooms" className="text-sm font-medium">
                    Bathrooms
                  </Label>
                  <Select
                    id="bathrooms"
                    value={formData.bathrooms}
                    onValueChange={(value) =>
                      handleSelectChange('bathrooms', value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="squarefootage"
                    className="text-sm font-medium"
                  >
                    Square Footage
                  </Label>
                  <Input
                    id="squarefootage"
                    type="number"
                    value={formData.squarefootage}
                    onChange={handleInputChange}
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lotsize" className="text-sm font-medium">
                    Lot Size (sq ft)
                  </Label>
                  <Input
                    id="lotsize"
                    type="number"
                    value={formData.lotsize}
                    onChange={handleInputChange}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="listingtype" className="text-sm font-medium">
                  Listing Type
                </Label>
                <Select
                  id="listingtype"
                  value={formData.listingtype}
                  onValueChange={(value) =>
                    handleSelectChange('listingtype', value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                    <SelectItem value="findingpartners">
                      Finding Partners
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.listingtype === 'sale' && (
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Sale Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="500000"
                    required
                  />
                </div>
              )}
              {formData.listingtype === 'rent' && (
                <>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="rentalprice"
                      className="text-sm font-medium"
                    >
                      Rental Price (per month)
                    </Label>
                    <Input
                      id="rentalprice"
                      type="number"
                      value={formData.rentalprice}
                      onChange={handleInputChange}
                      placeholder="2000"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="securitydeposit"
                      className="text-sm font-medium"
                    >
                      Security Deposit
                    </Label>
                    <Input
                      id="securitydeposit"
                      type="number"
                      value={formData.securitydeposit}
                      onChange={handleInputChange}
                      placeholder="3000"
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sellername" className="text-sm font-medium">
                  Seller Name
                </Label>
                <Input
                  id="sellername"
                  value={formData.sellername}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="selleremail" className="text-sm font-medium">
                  Seller Email
                </Label>
                <Input
                  id="selleremail"
                  type="email"
                  value={formData.selleremail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellerphone" className="text-sm font-medium">
                  Seller Phone
                </Label>
                <Input
                  id="sellerphone"
                  type="tel"
                  value={formData.sellerphone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Property Description
                </Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images" className="text-sm font-medium">
                  Upload Image
                </Label>
                <Input
                  id="images"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {image && <p className="text-sm text-gray-500">{image.name}</p>}
              </div>
            </div>
          </form>

          {!isAgent && showPayPal && !paymentCompleted && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">Payment Required</h3>
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'AQ3hHQbVcAFxIVpKOip-LluE3whXGHLeLpI215fswm7_9ulbeO6vlwMxpN5tE7vdQN8ej44pvFleU91r'
                }}
              >
                <div>
                  <div
                    style={{
                      padding: '10px',
                      background: 'white',
                      borderRadius: '5px'
                    }}
                  >
                    <PayPalButtons
                      style={{
                        disableMaxWidth: 'true'
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: '9.00'
                              }
                            }
                          ]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          setPaymentCompleted(true);
                          listProperty(); // Call listProperty after successful payment
                        });
                      }}
                    />
                  </div>
                </div>
              </PayPalScriptProvider>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-end">
          {listingMethod === 'blockchain' && !isWalletConnected ? (
            <Button onClick={connectWallet} disabled={uploading}>
              Connect Wallet
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={uploading || (listingMethod === 'blockchain' && !isWalletConnected)}>
              {uploading
                ? 'Uploading...'
                : listingMethod === 'blockchain'
                ? 'List on Blockchain'
                : isAgent || paymentCompleted
                ? 'List Property'
                : 'Proceed to Payment'}
            </Button>
          )}
          </div>
        </CardFooter>
      </Card>

      {success && (
        <Card className="mx-auto max-w-4xl p-6 sm:p-8 md:p-10">
          <CardContent>
            {createdListingId && (
              <div className="mt-4">
                <p
                  className="mb-2 font-semibold"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Use this code to embed your listing:
                </p>
                <pre
                  style={{
                    padding: '10px',
                    background: '#2b2727',
                    borderRadius: '10px'
                  }}
                >
                  <code>{`<iframe src="http://localhost:3000/kanban/${createdListingId}" />`}</code>
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
