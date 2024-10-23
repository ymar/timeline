import WeeklyTimeEntry from '@/components/WeeklyTimeEntry';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1">
        <WeeklyTimeEntry />
      </div>
    </div>
  );
}
