import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

export default function QuickStats({ studentData, recentSessions }) {
  const totalPoints = studentData?.total_points || 0;
  const level = studentData?.level || 1;
  const todaySessions = recentSessions?.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.created_date).toDateString();
    return today === sessionDate;
  }).length || 0;
  
  const avgScore = recentSessions?.length > 0 
    ? Math.round(recentSessions.reduce((sum, session) => sum + (session.completion_rate || 0), 0) / recentSessions.length)
    : 0;

  const stats = [
    {
      title: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Trophy,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      title: "Current Level",
      value: level,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Today's Games",
      value: todaySessions,
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}