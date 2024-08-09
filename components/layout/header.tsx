import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:flex items-center">
          <Link href={'/'} target="_blank" className="flex items-center">
            <Image
              src="/logo.png"  // Replace with the actual path to your logo image
              alt="Logo"
              width={34}
              height={34}
              className="mr-2"
            />
            <span className="text-lg font-semibold">BuyEstate</span>  {/* Add your brand name or text here */}
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        
        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}