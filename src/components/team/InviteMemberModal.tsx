'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InviteMemberForm {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  weeklyCapacity: number;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteMemberModal({ onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<InviteMemberForm>({
    email: '',
    role: 'member',
    weeklyCapacity: 40,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send invitation');

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error inviting team member:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Invite Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full p-2 border rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="colleague@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="mt-1 block w-full p-2 border rounded-md bg-white"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' | 'viewer' })}
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.role === 'admin' && 'Can manage team, projects, and settings'}
              {formData.role === 'member' && 'Can track time and manage assigned projects'}
              {formData.role === 'viewer' && 'Can only view time entries and reports'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weekly Capacity
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="number"
                required
                min="0"
                max="168"
                className="block w-32 p-2 border rounded-md"
                value={formData.weeklyCapacity}
                onChange={(e) => setFormData({ ...formData, weeklyCapacity: Number(e.target.value) })}
              />
              <span className="ml-2 text-gray-500">hours per week</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              Send Invitation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
