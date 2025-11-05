import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Link2 } from 'lucide-react';

export default function ScienceConceptMatcherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Link to={createPageUrl("MiniGames")} className="inline-block mb-8">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game Gallery
          </Button>
        </Link>
        <Card>
          <CardContent className="p-10">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Link2 className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Science Concept Matcher</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon!</p>
            <p className="text-gray-600 max-w-md mx-auto">
              Get ready to expand your scientific vocabulary! This game will challenge you to match key scientific terms with their correct definitions in a race against time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}