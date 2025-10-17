import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface PresenceUser {
  id: string;
  email: string;
  color: string;
}

interface RealtimePresenceProps {
  diagramId: string;
  userId: string;
  userEmail: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const RealtimePresence = ({ diagramId, userId, userEmail }: RealtimePresenceProps) => {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  
  useEffect(() => {
    if (!diagramId) return;

    const channel = supabase.channel(`diagram:${diagramId}`);
    
    const userColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users: PresenceUser[] = [];
        
        Object.keys(presenceState).forEach((key) => {
          const presence = presenceState[key];
          if (presence && presence.length > 0) {
            const userData = presence[0];
            if ('id' in userData && 'email' in userData && 'color' in userData) {
              users.push(userData as PresenceUser);
            }
          }
        });
        
        setOnlineUsers(users.filter(u => u.id !== userId));
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: userId,
            email: userEmail,
            color: userColor,
          });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [diagramId, userId, userEmail]);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md">
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {onlineUsers.length} {onlineUsers.length === 1 ? 'user' : 'users'} online
      </span>
      <div className="flex -space-x-2">
        {onlineUsers.map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarFallback 
              style={{ backgroundColor: user.color }}
              className="text-xs text-white"
            >
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
};
