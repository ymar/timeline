'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import timezones from '@/lib/timezones';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  type: 'Employee' | 'Contractor';
  roles: string[];
  weeklyCapacity: number;
  hourlyRate: number;
  timezone: string;
  photoUrl?: string;
  showWelcomePage: boolean;
}

const defaultProfile: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  type: 'Employee',
  roles: [],
  weeklyCapacity: 40,
  hourlyRate: 0,
  timezone: 'Europe/Amsterdam',
  showWelcomePage: true,
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [newRole, setNewRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile({
            ...defaultProfile,
            ...data,
            roles: data.roles || [],
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRole = () => {
    if (newRole && !profile.roles.includes(newRole)) {
      setProfile(prev => ({
        ...prev,
        roles: [...prev.roles, newRole],
      }));
      setNewRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove),
    }));
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={profile.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={profile.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
              />
              <p className="text-sm text-muted-foreground">
                You can update your email from your Harvest ID settings.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={profile.type}
                onValueChange={(value) => setProfile({ ...profile, type: value as 'Employee' | 'Contractor' })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Employee" id="employee" />
                  <Label htmlFor="employee">Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Contractor" id="contractor" />
                  <Label htmlFor="contractor">Contractor</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Roles & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="flex gap-2">
                <Input
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="Add a role (e.g., Designer, Senior)"
                />
                <Button type="button" onClick={handleAddRole}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.roles.map(role => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeklyCapacity">Weekly Capacity</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weeklyCapacity"
                  type="number"
                  required
                  min="0"
                  max="168"
                  className="w-32"
                  value={profile.weeklyCapacity}
                  onChange={e => setProfile({ ...profile, weeklyCapacity: Number(e.target.value) })}
                />
                <span className="text-muted-foreground">hours per week</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profile.timezone}
                onValueChange={(value) => setProfile({ ...profile, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showWelcome">Show Welcome Page</Label>
                <p className="text-sm text-muted-foreground">
                  Display the welcome page when you log in
                </p>
              </div>
              <Switch
                id="showWelcome"
                checked={profile.showWelcomePage}
                onCheckedChange={(checked) => setProfile({ ...profile, showWelcomePage: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
