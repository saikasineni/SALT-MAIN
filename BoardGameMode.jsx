import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Trophy, Star } from "lucide-react";

export default function SubjectCard({ subject, onClick }) {
  const progressPercentage = (subject.completedChapters / subject.chapters.length) * 100;
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${subject.gradient}`} />
      <CardContent className="p-6" onClick={onClick}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 ${subject.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <subject.icon className={`w-7 h-7 ${subject.color}`} />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gray-100">
              Level {subject.level}
            </Badge>
            {subject.points > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                {subject.points} pts
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {subject.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {subject.completedChapters}/{subject.chapters.length} chapters
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          
          <Button 
            className={`w-full bg-gradient-to-r ${subject.gradient} hover:shadow-lg transition-all duration-300`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
        
        {/* Chapter Preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Available Chapters:</p>
          <div className="flex flex-wrap gap-1">
            {subject.chapters.slice(0, 3).map((chapter, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {chapter}
              </Badge>
            ))}
            {subject.chapters.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{subject.chapters.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}