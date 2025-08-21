import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import { Player } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  currentPlayer: Player;
  winner: Player | null;
  onReset: () => void;
}

export function GameHeader({ currentPlayer, winner, onReset }: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg shadow-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-x bg-clip-text text-transparent animate-float">
            ∞ Tic Tac Toe
          </h1>
          
          {!winner && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-muted/50">
              <span className="text-sm text-muted-foreground">Current:</span>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                currentPlayer === 'X' && "bg-gradient-x text-white",
                currentPlayer === 'O' && "bg-gradient-o text-white"
              )}>
                {currentPlayer}
              </div>
            </div>
          )}
          
          {winner && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-win animate-bounce-in">
              <Trophy className="w-5 h-5 text-accent-foreground" />
              <span className="font-semibold text-accent-foreground">
                Player {winner} Wins!
              </span>
            </div>
          )}
        </div>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="shadow-button hover:shadow-soft transition-shadow"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </Button>
      </div>
    </header>
  );
}