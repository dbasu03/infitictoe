import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, X, MousePointer, Move, ZoomIn } from 'lucide-react';

export function GameInstructions() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-soft"
        onClick={() => setIsOpen(true)}
      >
        <Info className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-soft animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            How to Play
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MousePointer className="w-4 h-4 mt-0.5 text-game-player-x" />
            <span>Click any cell to place your X or O</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Move className="w-4 h-4 mt-0.5 text-game-player-o" />
            <span>Drag to pan around the infinite grid</span>
          </div>
          
          <div className="flex items-start gap-2">
            <ZoomIn className="w-4 h-4 mt-0.5 text-accent" />
            <span>Scroll/pinch to zoom in and out</span>
          </div>
          
          <div className="pt-2 border-t">
            <p className="font-medium text-foreground">Goal: Get 5 in a row!</p>
            <p>Horizontal, vertical, or diagonal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}