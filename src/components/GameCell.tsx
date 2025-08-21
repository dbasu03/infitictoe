import React from 'react';
import { Player } from '@/hooks/useGameState';
import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCellProps {
  x: number;
  y: number;
  player?: Player;
  isWinning?: boolean;
  onClick: (x: number, y: number, e: React.MouseEvent) => void;
}

const CELL_SIZE = 60;

export function GameCell({ x, y, player, isWinning, onClick }: GameCellProps) {
  return (
    <button
      className={cn(
        "absolute flex items-center justify-center border border-game-grid-line bg-card/50 backdrop-blur-sm",
        "hover:bg-game-cell-hover transition-colors duration-200",
        "rounded-lg shadow-sm",
        isWinning && "animate-pulse-win shadow-soft",
        player && "cursor-default",
        !player && "hover:shadow-card cursor-pointer"
      )}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
      }}
      onClick={(e) => onClick(x, y, e)}
      disabled={!!player}
    >
      {player === 'X' && (
        <X 
          className="w-8 h-8 text-game-player-x animate-bounce-in" 
          strokeWidth={3}
        />
      )}
      {player === 'O' && (
        <Circle 
          className="w-8 h-8 text-game-player-o animate-bounce-in" 
          strokeWidth={3}
          fill="none"
        />
      )}
      
      {/* Grid coordinate display (only for cells near origin) */}
      {Math.abs(x) <= 2 && Math.abs(y) <= 2 && !player && (
        <span className="absolute bottom-1 right-1 text-xs text-muted-foreground opacity-30 font-mono">
          {x},{y}
        </span>
      )}
    </button>
  );
}