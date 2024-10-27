'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ClientList from '@/components/ClientList';
import NewClientForm from '@/components/NewClientForm';

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setShowSuccess(true);
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" className="mb-6">
          <AlertDescription>
            Client created successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientList refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>

      {showForm && (
        <NewClientForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
