
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getPlayerData, savePlayerData, resetOfflineData } from '@/components/lib/offline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Star, BarChart, Play, User, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OfflineLobby() {
  const [playerData, setPlayerData] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const data = getPlayerData();
    setPlayerData(data);
    setPlayerName(data.name);
  }, []);

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSaveName = () => {
    const updatedData = { ...playerData, name: playerName };
    savePlayerData(updatedData);
    setPlayerData(updatedData);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all offline progress? This cannot be undone.')) {
      resetOfflineData();
      const data = getPlayerData('Player');
      setPlayerData(data);
      setPlayerName(data.name);
    }
  };

  if (!playerData) {
    return <div>Loading Offline Mode...</div>;
  }

  const stats = [
    { title: 'Total Points', value: playerData.total_points.toLocaleString(), icon: Star, color: 'text-purple-600' },
    { title: 'Current Level', value: playerData.level, icon: Trophy, color: 'text-yellow-600' },
    { title: 'Badges Earned', value: playerData.badges.length, icon: Badge, color: 'text-orange-600' },
    { title: 'Games Played', value: playerData.game_scores.length, icon: BarChart, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-3xl">
              <span>SALT Offline Mode</span>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6" />
              </div>
            </CardTitle>
            <p className="text-blue-100">Your progress is saved on this device. No internet needed to play.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-4">
              <User className="w-6 h-6" />
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    type="text"
                    value={playerName}
                    onChange={handleNameChange}
                    className="bg-white/90 text-gray-900"
                    placeholder="Enter your name"
                  />
                  <Button onClick={handleSaveName} variant="secondary">Save</Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{playerData.name}</h2>
                  <Button onClick={() => setIsEditing(true)} variant="ghost" className="hover:bg-white/20">Edit Name</Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.title} className="bg-white/10 p-4 rounded-lg text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} bg-white rounded-full p-1.5`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.title}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to={createPageUrl("MiniGames?mode=offline")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100 w-full md:w-auto px-12 py-6 text-lg">
                  <Play className="w-5 h-5 mr-2" /> Start Playing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Settings</span>
                    <Button onClick={handleReset} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reset All Offline Data
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600">
                    Warning: Resetting will permanently delete all your offline progress, including points, levels, and badges. This action cannot be undone.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
