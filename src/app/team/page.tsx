'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TeamMemberList from '@/components/team/TeamMemberList';
import InviteMemberModal from '@/components/team/InviteMemberModal';

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowInviteModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Invite Members
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Role:</span>
              <select className="border rounded-md p-2 text-sm">
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <select className="border rounded-md p-2 text-sm">
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <TeamMemberList 
          searchQuery={searchQuery}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
