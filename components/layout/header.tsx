'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/app/(dashboard)/dashboard/appcontext';
import Image from 'next/image';
import { AreaChart } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const isHomePage = ['/dashboard', '/dashboard/setting', '/dashboard/billing', '/dashboard/account', '/dashboard/ticket'].includes(pathname);
  const { sharedState } = useAppContext();
  const [showSignOut, setShowSignOut] = useState(false);
  const { signOut } = useClerk();

  const navItems = [
    { label: 'Design', href: '/dashboard/design', activeColor: 'bg-purple-500' },
    { label: 'Crawl', href: '/dashboard/crawl', activeColor: 'bg-purple-500' },
    { label: 'Prompt', href: '/dashboard/prompt', activeColor: 'bg-purple-500' },
    { label: 'Knowledge', href: '/dashboard/knowledge', activeColor: 'bg-purple-500' },
    { label: 'Conversation', href: '/dashboard/conversation', activeColor: 'bg-purple-500' },
    { label: 'Analytics', href: '/dashboard/analytics', activeColor: 'bg-purple-500'},
    { label: 'Integration', href: '/dashboard/integration', activeColor: 'bg-purple-500' },
    { label: 'Install', href: '/dashboard/install', activeColor: 'bg-purple-500' },
    { label: 'Setting', href: '/dashboard/setting', activeColor: 'bg-purple-500' },
  ];

  const handleAccountClick = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <header className={cn(
      "supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b backdrop-blur",
    )}>
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center pl-4">
          <Link href="/" className="text-xl font-bold text-purple-600">
            REPLYGEN
          </Link>
        </div>

        {!isHomePage && (
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              const href = sharedState.currentChatbotId
                ? `${item.href}/${sharedState.currentChatbotId}`
                : item.href;

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname.startsWith(item.href)
                      ? `text-white ${item.activeColor}`
                      : "text-foreground/60",
                    "px-3 py-2 rounded-md"
                  )}
                >
           
             {item.label}
            
               
                </Link>
              );
            })}
          </nav>
        )}

{isHomePage && (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/Robot.png" alt="My Chatbots" width={24} height={24} />
              <span className="text-sm font-medium">My Chatbots</span>
            </Link>
            <Link href="/partner" className="flex items-center gap-2">
              <Image src="/StarFour.png" alt="Become a Partner" width={24} height={24} />
              <span>Become a Partner</span>
            </Link>
            <Link href="/dashboard/billing" className="flex items-center gap-2">
              <Image src="/currency.png" alt="Billing" width={24} height={24} />
              <span>Billing</span>
            </Link>
            <Link href="/dashboard/account" className="flex items-center gap-2">
              <Image src="/User.png" alt="Account" width={24} height={24} />
              <span>Account</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
