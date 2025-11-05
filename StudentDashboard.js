
import React, { useState, useEffect } from "react";
import { Student, GameSession, Achievement } from "@/entities/all";
import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Award,
  Play,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import QuickStats from "../components/dashboard/QuickStats";
import SubjectProgress from "../components/dashboard/SubjectProgress";
import RecentActivities from "../components/dashboard/RecentActivities";
import DailyStreak from "../components/dashboard/DailyStreak";

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Load or create student profile
      const students = await Student.filter({ created_by: user.email });
      let student = students[0];
      
      if (!student) {
        student = await Student.create({
          student_name: user.full_name,
          grade: "8",
          school: "Rural STEM Academy",
          preferred_language: "english"
        });
      }
      
      setStudentData(student);
      
      // Load recent game sessions
      const sessions = await GameSession.filter({ student_id: student.id }, "-created_date", 10);
      setRecentSessions(sessions);
      
      // Load achievements
      const allAchievements = await Achievement.list();
      setAchievements(allAchievements);
      
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser?.full_name?.split(' ')[0]}! 🚀
              </h1>
              <p className="text-lg text-gray-600">
                Ready to continue your STEM adventure with SALT?
              </p>
            </div>
            <DailyStreak streak={7} />
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats studentData={studentData} recentSessions={recentSessions} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Subject Progress */}
          <div className="lg:col-span-2 space-y-6">
            <SubjectProgress studentData={studentData} />
            
            {/* Quick Play Section */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to Play?</h3>
                    <p className="text-blue-100 mb-4">
                      Jump into your favorite STEM subjects
                    </p>
                    <Link to={createPageUrl("GameBoards")}>
                      <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                      <Target className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activities & Achievements */}
          <div className="space-y-6">
            <RecentActivities sessions={recentSessions} />
            
            {/* Latest Achievements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Recent Badges
                </CardTitle>
                <Link to={createPageUrl("Achievements")}>
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Start playing to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
