import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calculator, Atom, Cpu, ChevronRight } from "lucide-react";

export default function SubjectProgress({ studentData }) {
  const subjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      color: "text-blue-600",
      bg: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      progress: studentData?.subjects_progress?.math?.level ? (studentData.subjects_progress.math.level / 10) * 100 : 10,
      level: studentData?.subjects_progress?.math?.level || 1,
      points: studentData?.subjects_progress?.math?.points || 0,
      chapters: studentData?.subjects_progress?.math?.chapters_completed?.length || 0
    },
    {
      name: "Science",
      icon: Atom,
      color: "text-green-600",
      bg: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      progress: studentData?.subjects_progress?.science?.level ? (studentData.subjects_progress.science.level / 10) * 100 : 15,
      level: studentData?.subjects_progress?.science?.level || 1,
      points: studentData?.subjects_progress?.science?.points || 0,
      chapters: studentData?.subjects_progress?.science?.chapters_completed?.length || 0
    },
    {
      name: "Technology",
      icon: Cpu,
      color: "text-purple-600",
      bg: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      progress: studentData?.subjects_progress?.technology?.level ? (studentData.subjects_progress.technology.level / 10) * 100 : 5,
      level: studentData?.subjects_progress?.technology?.level || 1,
      points: studentData?.subjects_progress?.technology?.points || 0,
      chapters: studentData?.subjects_progress?.technology?.chapters_completed?.length || 0
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Subject Progress</CardTitle>
        <Link to={createPageUrl("GameBoards")}>
          <Button variant="ghost" size="sm">
            View Games
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${subject.bg} rounded-lg flex items-center justify-center`}>
                  <subject.icon className={`w-5 h-5 ${subject.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{subject.name}</h4>
                  <p className="text-sm text-gray-600">
                    Level {subject.level} • {subject.chapters} chapters completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{subject.points} pts</p>
                <p className="text-xs text-gray-600">{Math.round(subject.progress)}% complete</p>
              </div>
            </div>
            <Progress 
              value={subject.progress} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}