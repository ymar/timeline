'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal, Mail, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'inactive';
  avatarUrl?: string;
  lastActive?: string;
  weeklyCapacity: number;
}

interface Props {
  searchQuery: string;
  refreshTrigger: number;
}

export default function TeamMemberList({ searchQuery, refreshTrigger }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchMembers();
  }, [refreshTrigger]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatLastActive = (date?: string) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="divide-y">
      {filteredMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{member.weeklyCapacity}h/week</span>
            </div>
            <div className="text-sm">
              Last active: {formatLastActive(member.lastActive)}
            </div>
            <div className="min-w-[100px]">
              <span className={`px-2 py-1 rounded-full text-xs
                ${member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                ${member.status === 'invited' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${member.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </span>
            </div>
            <div className="min-w-[100px]">
              <span className={`px-2 py-1 rounded-full text-xs
                ${member.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                ${member.role === 'member' ? 'bg-blue-100 text-blue-800' : ''}
                ${member.role === 'viewer' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Resend Invitation
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
