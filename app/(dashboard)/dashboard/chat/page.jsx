import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChattingPage from '../../../../components/chat';

const breadcrumbItems = [{ title: 'Chats', link: '/dashboard/chat' }];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ChattingPage />
      </div>
    </ScrollArea>
  );
}
