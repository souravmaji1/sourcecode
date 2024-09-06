'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-purple-600">
            REPLYGEN
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/affiliates" className="text-gray-600 hover:text-gray-900">
            Affiliates
          </Link>
          <Link href="/discord" className="text-gray-600 hover:text-gray-900">
            Discord
          </Link>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900">
            Docs
          </Link>
          <Link href="/vv-stack" className="text-gray-600 hover:text-gray-900">
            VV Stack
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button className="bg-purple-600 text-white hover:bg-purple-400">
              Sign in
            </Button>
          </Link>
        </div>
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
        >
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/affiliates" className="block text-gray-600 hover:text-gray-900">
            Affiliates
          </Link>
          <Link href="/discord" className="block text-gray-600 hover:text-gray-900">
            Discord
          </Link>
          <Link href="/docs" className="block text-gray-600 hover:text-gray-900">
            Docs
          </Link>
          <Link href="/vv-stack" className="block text-gray-600 hover:text-gray-900">
            VV Stack
          </Link>
          <Link href="/pricing" className="block text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-400">
              Sign in
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
