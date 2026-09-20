import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import CardList from './CardList';
import { BadgeCheck, Candy, Citrus, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import EditUser from './EditUser';
import { useAuth } from '@/firebase/AuthProvider';
import { useState } from 'react';
const UserProfile = () => {
  const { dbUser } = useAuth();
  console.log(dbUser);
  const name = dbUser?.displayName || 'John Doe';
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col mt-4 xl:flex-row gap-8">
        {/* Left */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* Users Badges Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="flex gap-4 mt-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    className="rounded-full bg-blue-500/30 border-1 border-blue-500/50 p-2"
                    size={36}
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified User</h1>
                  <p className="text-sm text-muted-foreground">
                    This User has been verified by the ADMIN
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Shield
                    size={36}
                    className="rounded-full bg-green-800/30 border-1 border-green-800/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Admin</h1>
                  <p className="text-sm text-muted-foreground">
                    Admin users have access to all features and can manage
                    users.
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Candy
                    size={36}
                    className="rounded-full bg-yellow-500/30 border-1 border-yellow-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Awarded</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has been awarded for their contributions.
                  </p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus
                    size={36}
                    className="rounded-full bg-orange-500/30 border-1 border-orange-500/50 p-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-sm text-muted-foreground">
                    This user has been popular in the community.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          {/* Info Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">User Information</h1>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </SheetTrigger>
                <EditUser setOpen={setOpen} />
              </Sheet>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">
                  Profile Completion
                </p>
                <Progress value={85} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Username : </span>
                <span>{dbUser?.displayName || 'John Doe'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email : </span>
                <span>{dbUser?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">PhotoURL : </span>
                <span>{dbUser?.image.slice(0, 25)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Role : </span>
                <Badge>{dbUser?.role || 'user'}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Joined on 2025.01.01
            </p>
          </div>
          {/* Card List Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <CardList title="Recent Transactions" />
          </div>
        </div>
        {/* Right */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* USER CARD Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">User Card</div>
          {/* CHART Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">Chart</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
