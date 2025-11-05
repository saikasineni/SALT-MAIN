import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sigma } from 'lucide-react';

export default function MathGridChallengePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Link to={createPageUrl("MiniGames")} className="inline-block mb-8">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game Gallery
          </Button>
        </Link>
        <Card>
          <CardContent className="p-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sigma className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Math Grid Challenge</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon!</p>
            <p className="text-gray-600 max-w-md mx-auto">
              This interactive game will challenge you to solve equations to claim cells on a grid. Get ready to put your arithmetic and problem-solving skills to the test!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}