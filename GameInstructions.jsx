import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Trophy, Zap } from 'lucide-react';

export default function GameInstructions({ 
  title, 
  rules, 
  objectives, 
  tips, 
  onStart 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            {title} - How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Game Rules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Game Rules</h3>
            </div>
            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Objectives */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Learning Objectives</h3>
            </div>
            <ul className="space-y-2">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-800">Pro Tips</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-600">💡</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center pt-4">
            <Button 
              onClick={onStart} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              Start Playing! 🚀
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}