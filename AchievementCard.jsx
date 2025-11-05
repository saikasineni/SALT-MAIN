import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";

export default function AchievementCard({ badge, studentData }) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      badge.earned 
        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" 
        : "bg-gray-50 border-gray-200 opacity-75"
    }`}>
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          badge.earned 
            ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
            : "bg-gray-300"
        }`}>
          {badge.earned ? (
            <badge.icon className="w-8 h-8 text-white" />
          ) : (
            <Lock className="w-8 h-8 text-gray-500" />
          )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2">{badge.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
        
        <div className="flex justify-center">
          {badge.earned ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Earned
            </Badge>
          ) : (
            <Badge variant="outline" className="border-gray-300 text-gray-500">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}