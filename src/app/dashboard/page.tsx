import { Metadata } from "next"
import WeeklyTimeEntry from '@/components/WeeklyTimeEntry';

export const metadata: Metadata = {
  title: "Dashboard - Timeline",
  description: "Welcome to your Timeline dashboard",
}

export default function DashboardPage() {
  return (
    <div className="">

        <WeeklyTimeEntry />

    </div>
  );
}
