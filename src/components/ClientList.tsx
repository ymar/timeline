'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';

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
    const response = await fetch('/api/clients');
    const data = await response.json();
    setClients(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      fetchClients();
    }
  };

  const handleUpdate = async (client: Client) => {
    await fetch('/api/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    setEditingClient(null);
    fetchClients();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Client List</h2>
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client._id}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            {editingClient?._id === client._id ? (
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="tel"
                  value={editingClient.phone}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Phone"
                />
                <textarea
                  value={editingClient.address}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, address: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Address"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(editingClient)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingClient(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-medium">{client.name}</h3>
                  <p className="text-gray-600">{client.email}</p>
                  <p className="text-gray-500">{client.phone}</p>
                  <p className="text-gray-500 mt-2">{client.address}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
