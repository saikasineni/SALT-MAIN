
import React, { useState, useEffect } from 'react';
import { Student, GameSession } from '@/entities/all';
import { User } from '@/entities/User';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Star, Trophy, Target } from 'lucide-react';

export default function Certificates() {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [gameSessions, setGameSessions] = useState([]);
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
      const student = students[0];
      setStudentData(student);

      if (student) {
        const sessions = await GameSession.filter({ student_id: student.id });
        setGameSessions(sessions);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const calculateStats = () => {
    const totalGames = gameSessions.length;
    const totalPoints = studentData?.total_points || 0;
    const avgAccuracy = totalGames > 0
      ? Math.round(gameSessions.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / totalGames)
      : 0;
    
    return { totalGames, totalPoints, avgAccuracy };
  };

  const downloadCertificate = () => {
    // In a real app, this would generate a PDF
    alert('Certificate download will be implemented with PDF generation library');
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your SALT Certificates
          </h1>
          <p className="text-gray-600">Celebrate your learning achievements!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
              <div className="text-sm text-gray-600">Games Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.avgAccuracy}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Display */}
        <Card className="bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4"></div>
          <CardContent className="p-8 md:p-12">
            {/* SALT Logo Area */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">SALT</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Certificate of Achievement
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
            </div>

            {/* Certificate Content */}
            <div className="text-center space-y-6">
              <p className="text-lg text-gray-700">This certificate is proudly presented to</p>
              
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {studentData?.student_name || currentUser?.full_name}
              </h3>

              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                For demonstrating outstanding dedication and achievement in STEM education 
                through the SALT learning platform
              </p>

              {/* Achievements Grid */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalPoints}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.totalGames}</div>
                  <div className="text-sm text-gray-600">Games Mastered</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats.avgAccuracy}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>

              {/* Date and Signature */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 flex justify-between items-end">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <div className="w-48 border-t-2 border-gray-800 mb-2"></div>
                  <p className="font-medium">SALT Education Team</p>
                  <p className="text-sm text-gray-600">Director of Education</p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-8 flex justify-center gap-3 flex-wrap">
                <Badge className="bg-yellow-500 text-white">🏆 STEM Champion</Badge>
                <Badge className="bg-blue-500 text-white">💻 Tech Explorer</Badge>
                <Badge className="bg-green-500 text-white">🔬 Science Master</Badge>
              </div>
            </div>
          </CardContent>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4"></div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={downloadCertificate} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
        </div>
      </div>
    </div>
  );
}
