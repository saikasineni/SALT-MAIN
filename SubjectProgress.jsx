import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

export default function DailyStreak({ streak }) {
  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{streak} days</p>
            <p className="text-sm text-orange-100">Learning streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}