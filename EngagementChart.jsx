import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from "lucide-react";

export default function EngagementChart({ sessions, timeframe }) {
  // Process sessions data for chart
  const processChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toDateString();
      
      const daySessions = sessions.filter(session => 
        new Date(session.created_date).toDateString() === dateStr
      );

      last7Days.push({
        day: dayName,
        sessions: daySessions.length,
        avgScore: daySessions.length > 0 
          ? Math.round(daySessions.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / daySessions.length)
          : 0,
        totalTime: Math.round(daySessions.reduce((sum, s) => sum + (s.time_spent || 0), 0))
      });
    }
    return last7Days;
  };

  const chartData = processChartData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Student Engagement Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          
          {/* Sessions Chart */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Daily Learning Sessions</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'sessions' ? 'Sessions' : 'Avg Score']}
                  labelFormatter={(day) => `Day: ${day}`}
                />
                <Bar dataKey="sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Chart */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Average Performance Score</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Avg Score']}
                  labelFormatter={(day) => `Day: ${day}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}