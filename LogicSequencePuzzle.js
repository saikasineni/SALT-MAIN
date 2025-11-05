import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Hash } from 'lucide-react';

export default function LogicSequencePuzzlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Link to={createPageUrl("MiniGames")} className="inline-block mb-8">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game Gallery
          </Button>
        </Link>
        <Card>
          <CardContent className="p-10">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hash className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Logic Sequence Puzzle</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon!</p>
            <p className="text-gray-600 max-w-md mx-auto">
              Challenge your logical reasoning! This puzzle game will present you with incomplete number or symbol sequences that you must complete by figuring out the underlying pattern.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}