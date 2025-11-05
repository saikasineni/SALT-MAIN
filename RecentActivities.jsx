import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calculator, Atom, Cpu, Clock } from "lucide-react";

export default function RecentActivities({ sessions }) {
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "math":
        return Calculator;
      case "science":
        return Atom;
      case "technology":
        return Cpu;
      default:
        return Calculator;
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "math":
        return "text-blue-600";
      case "science":
        return "text-green-600";
      case "technology":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
  };

  const getSubjectBg = (subject) => {
    switch (subject) {
      case "math":
        return "bg-blue-100";
      case "science":
        return "bg-green-100";
      case "technology":
        return "bg-purple-100";
      default:
        return "bg-blue-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions?.length > 0 ? (
          sessions.slice(0, 5).map((session) => {
            const SubjectIcon = getSubjectIcon(session.subject);
            return (
              <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 ${getSubjectBg(session.subject)} rounded-lg flex items-center justify-center`}>
                  <SubjectIcon className={`w-4 h-4 ${getSubjectColor(session.subject)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{session.chapter}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {session.subject} • {session.time_spent}min
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={session.completion_rate >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {session.completion_rate}%
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    +{session.points_earned} pts
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-6">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activities</p>
            <p className="text-xs">Start playing to see your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}