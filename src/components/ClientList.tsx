'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  refreshTrigger: number;
}

const ClientList = ({ refreshTrigger }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleUpdate = async (client: Client) => {
    try {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client._id}>
              {editingClient?._id === client._id ? (
                <>
                  <TableCell colSpan={4}>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingClient.name}
                        onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editingClient.email}
                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={editingClient.phone}
                        onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Phone"
                      />
                      <textarea
                        value={editingClient.address}
                        onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Address"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdate(editingClient)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingClient(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{client.address || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingClient(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No clients found. Click "New Client" to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;
