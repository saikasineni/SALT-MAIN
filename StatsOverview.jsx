import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Star, Award } from "lucide-react";

export default function StatsOverview({ studentData, earnedBadges, totalBadges }) {
  const stats = [
    {
      title: "Badges Earned",
      value: earnedBadges,
      total: totalBadges,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      title: "Current Level",
      value: studentData?.level || 1,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Total Points",
      value: (studentData?.total_points || 0).toLocaleString(),
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Rank",
      value: "Advanced",
      subtitle: "Top 25%",
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className={`w-14 h-14 mx-auto mb-4 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.total ? `${stat.value}/${stat.total}` : stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.title}</div>
            {stat.subtitle && (
              <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}