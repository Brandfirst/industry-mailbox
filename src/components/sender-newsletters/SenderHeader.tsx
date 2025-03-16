
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

interface SenderHeaderProps {
  senderName: string;
  newsletterCount: number;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const SenderHeader = ({ 
  senderName, 
  newsletterCount, 
  isFollowing, 
  onFollowToggle 
}: SenderHeaderProps) => {
  return (
    <>
      {/* Cover image section */}
      <div 
        className="h-60 w-full relative bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=400&q=80)`,
          backgroundPosition: '50% 50%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      {/* Profile header */}
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 mb-8">
          <Avatar className="w-32 h-32 border-4 border-white rounded-full shadow-lg bg-white">
            <AvatarFallback className="text-4xl font-bold bg-orange-500 text-white">
              {senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col md:flex-row flex-1 gap-4 md:items-end">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-gray-900">{senderName}</h1>
              <p className="text-gray-600">
                {newsletterCount} nyhetsbrev
              </p>
            </div>
            
            <Button 
              onClick={onFollowToggle} 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "bg-white text-gray-700" : "bg-orange-500 hover:bg-orange-600 text-white"}
            >
              {isFollowing ? (
                <><BellOff className="mr-2 h-4 w-4" /> Følger</>
              ) : (
                <><Bell className="mr-2 h-4 w-4" /> Følg</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SenderHeader;
