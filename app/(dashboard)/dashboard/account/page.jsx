'use client'
import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  if (!user) return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px] mt-4" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl} alt={user.fullName} />
              <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">User ID</p>
              <p className="text-sm text-gray-500">{user.id}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;