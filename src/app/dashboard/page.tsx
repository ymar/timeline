import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";
import { redirect } from "next/navigation";
import { getWeekTimeEntries } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { startOfWeek, endOfWeek, entries } = await getWeekTimeEntries(session.user.id as string);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <Link href="/time-entry">
          <Button>Add Time Entry</Button>
        </Link>
      </div>
      <p className="text-lg">
        Week of {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
      </p>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => (
          <Card key={day} className="min-h-[200px]">
            <CardHeader>
              <CardTitle className="text-sm">{day}</CardTitle>
              <p className="text-xs text-gray-500">
                {formatDate(new Date(startOfWeek.getTime() + index * 24 * 60 * 60 * 1000))}
              </p>
            </CardHeader>
            <CardContent>
              {entries[index].length > 0 ? (
                entries[index].map((entry: any) => (
                  <div key={entry._id} className="mb-2 text-sm">
                    <p className="font-semibold">{entry.project}</p>
                    <p className="text-gray-600">{entry.description}</p>
                    <p className="text-gray-500">{entry.duration} minutes</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No entries</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
