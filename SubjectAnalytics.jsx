import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator, Atom, Cpu, BookOpen } from "lucide-react";

export default function SubjectAnalytics({ sessions, students }) {
  const subjects = [
    { id: "math", name: "Mathematics", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100" },
    { id: "science", name: "Science", icon: Atom, color: "text-green-600", bg: "bg-green-100" },
    { id: "technology", name: "Technology", icon: Cpu, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  const getSubjectStats = (subjectId) => {
    const subjectSessions = sessions.filter(s => s.subject === subjectId);
    const totalSessions = subjectSessions.length;
    const avgScore = totalSessions > 0 
      ? Math.round(subjectSessions.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / totalSessions)
      : 0;
    const activeStudents = new Set(subjectSessions.map(s => s.student_id)).size;
    const totalTime = Math.round(subjectSessions.reduce((sum, s) => sum + (s.time_spent || 0), 0) / 60);

    return { totalSessions, avgScore, activeStudents, totalTime };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-700" />
          Subject Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject.id);
            return (
              <div key={subject.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${subject.bg} rounded-lg flex items-center justify-center`}>
                      <subject.icon className={`w-5 h-5 ${subject.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{subject.name}</h4>
                      <p className="text-sm text-gray-600">Performance Overview</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{stats.avgScore}%</p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalSessions}</p>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stats.activeStudents}</p>
                    <p className="text-xs text-gray-600">Active Students</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalTime}h</p>
                    <p className="text-xs text-gray-600">Total Time</p>
                  </div>
                </div>
                
                <Progress 
                  value={stats.avgScore} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}