import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Clock } from "lucide-react";

export default function StudentProgress({ students, sessions }) {
  const getStudentStats = (student) => {
    const studentSessions = sessions.filter(s => s.student_id === student.id);
    const totalSessions = studentSessions.length;
    const avgScore = totalSessions > 0 
      ? Math.round(studentSessions.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / totalSessions)
      : 0;
    const totalTime = studentSessions.reduce((sum, s) => sum + (s.time_spent || 0), 0);
    
    return { totalSessions, avgScore, totalTime };
  };

  const topStudents = students
    .map(student => ({ ...student, ...getStudentStats(student) }))
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Top Performing Students
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topStudents.length > 0 ? (
          topStudents.map((student, index) => (
            <div key={student.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index < 3 ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.student_name}</p>
                    <p className="text-sm text-gray-600">Grade {student.grade}</p>
                  </div>
                </div>
                <Badge variant={student.avgScore >= 80 ? "default" : "secondary"}>
                  {student.avgScore}% avg
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Sessions</p>
                  <p className="font-medium">{student.totalSessions}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{Math.round(student.totalTime / 60)}h</p>
                </div>
              </div>
              
              <Progress 
                value={Math.min(student.avgScore, 100)} 
                className="h-2"
              />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No student data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}