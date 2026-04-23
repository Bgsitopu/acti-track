import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, subDays } from 'date-fns';

export function WeeklyChart() {
  // Generate sample data for the chart that mimics the UI
  const data = Array.from({ length: 14 }).map((_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'MMM dd'),
    progress: Math.floor(Math.random() * 80) + 20,
    average: Math.floor(Math.random() * 50) + 30
  }));

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-lg font-semibold text-text-primary">Weekly Progress</h3>
           <p className="text-sm text-text-secondary">Your overall performance trend</p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProgress)"
            />
             <Area
              type="monotone"
              dataKey="average"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={0}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
