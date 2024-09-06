import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, MessageCircle, Ticket, Mail, FileText, Webhook, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, href, isActive }) => {
  const { isMinimized } = useSidebar();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'flex items-center py-2 px-4 text-sm font-medium hover:bg-gray-100',
              isActive ? 'text-black' : 'text-gray-600'
            )}
          >
            <Icon size={20} className="mr-3" />
            {!isMinimized && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          side="right"
          sideOffset={8}
          className={!isMinimized ? 'hidden' : 'inline-block'}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">{title}</h3>
    {children}
  </div>
);

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className=" w-64 h-full p-4">
      <MenuSection title="Main Menu">
        <MenuItem icon={Home} label="Home" href="/dashboard" isActive={pathname === '/dashboard'} />
        <MenuItem icon={Settings} label="Setting" href="/dashboard/setting" isActive={pathname === '/dashboard/setting'} />
      </MenuSection>

      <MenuSection title="Activity">
        <MenuItem icon={MessageCircle} label="Chats" href="/chats" isActive={pathname === '/chats'} />
        <MenuItem icon={Ticket} label="Tickets" href="/dashboard/ticket" isActive={pathname === '/dashboard/ticket'} />
        <MenuItem icon={Mail} label="Emails" href="/emails" isActive={pathname === '/emails'} />
      </MenuSection>

      <MenuSection title="Setup">
        <MenuItem icon={MessageCircle} label="Chatbots" href="/chatbots" isActive={pathname === '/chatbots'} />
        <MenuItem icon={FileText} label="Ticket forms" href="/ticket-forms" isActive={pathname === '/ticket-forms'} />
        <MenuItem icon={Mail} label="Emails Inboxes" href="/email-inboxes" isActive={pathname === '/email-inboxes'} />
      </MenuSection>

      <MenuSection title="Connection">
        <MenuItem icon={Webhook} label="Webhooks" href="/webhooks" isActive={pathname === '/webhooks'} />
        <MenuItem icon={Share2} label="Integrations" href="/integrations" isActive={pathname === '/integrations'} />
      </MenuSection>
    </nav>
  );
}