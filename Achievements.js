import React, { useState, useEffect } from "react";
import { Student, Achievement } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Target, Zap, Crown } from "lucide-react";

import AchievementCard from "../components/achievements/AchievementCard";
import StatsOverview from "../components/achievements/StatsOverview";

export default function Achievements() {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const students = await Student.filter({ created_by: user.email });
      let student = students[0];
      
      if (!student) {
        student = await Student.create({
          student_name: user.full_name,
          grade: "8",
          school: "Rural STEM Academy",
          preferred_language: "english",
          badges: ["first_steps", "math_rookie"]
        });
      }
      
      setStudentData(student);
      
      // Load achievements
      const allAchievements = await Achievement.list();
      setAchievements(allAchievements);
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const badgeCategories = [
    {
      name: "Learning Milestones",
      badges: [
        { id: "first_steps", name: "First Steps", description: "Complete your first lesson", icon: Star, earned: true },
        { id: "math_rookie", name: "Math Rookie", description: "Complete 5 math challenges", icon: Target, earned: true },
        { id: "science_explorer", name: "Science Explorer", description: "Discover 10 science facts", icon: Zap, earned: false },
        { id: "tech_wizard", name: "Tech Wizard", description: "Master basic programming", icon: Crown, earned: false }
      ]
    },
    {
      name: "Achievement Streaks",
      badges: [
        { id: "daily_learner", name: "Daily Learner", description: "7-day learning streak", icon: Trophy, earned: true },
        { id: "weekly_champion", name: "Weekly Champion", description: "Complete 20 lessons in a week", icon: Award, earned: false },
        { id: "perfectionist", name: "Perfectionist", description: "Score 100% on 5 quizzes", icon: Star, earned: false }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  const earnedBadges = badgeCategories.flatMap(cat => cat.badges.filter(badge => badge.earned));
  const totalBadges = badgeCategories.flatMap(cat => cat.badges).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Achievements 🏆
          </h1>
          <p className="text-lg text-gray-600">
            Track your learning progress and unlock amazing badges
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          studentData={studentData}
          earnedBadges={earnedBadges.length}
          totalBadges={totalBadges}
        />

        {/* Achievement Categories */}
        <div className="space-y-8">
          {badgeCategories.map((category) => (
            <div key={category.name}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-500" />
                {category.name}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.badges.map((badge) => (
                  <AchievementCard
                    key={badge.id}
                    badge={badge}
                    studentData={studentData}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Badge Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Overall Progress</span>
                <span className="font-medium">
                  {earnedBadges.length} of {totalBadges} badges earned
                </span>
              </div>
              <Progress 
                value={(earnedBadges.length / totalBadges) * 100} 
                className="h-3"
              />
              <p className="text-sm text-gray-600">
                Keep learning to unlock more achievements! 
                Next badge: Complete 10 science challenges
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}