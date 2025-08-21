import React, { useRef, useState, useCallback } from 'react';
import { GameState, CellPosition } from '@/hooks/useGameState';
import { GameCell } from './GameCell';

interface GameGridProps {
  gameState: GameState;
  onCellClick: (x: number, y: number) => void;
  getCellAt: (x: number, y: number) => any;
}

const CELL_SIZE = 60; // Size in pixels
const GRID_PADDING = 5; // Grid cells to show beyond bounds

export function GameGrid({ gameState, onCellClick, getCellAt }: GameGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate visible grid bounds with padding
  const visibleBounds = {
    minX: gameState.gridBounds.minX - GRID_PADDING,
    maxX: gameState.gridBounds.maxX + GRID_PADDING,
    minY: gameState.gridBounds.minY - GRID_PADDING,
    maxY: gameState.gridBounds.maxY + GRID_PADDING,
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2, prev.scale * delta))
    }));
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
    }
  }, [transform]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      setTransform(prev => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleCellClick = useCallback((x: number, y: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onCellClick(x, y);
    }
  }, [onCellClick, isDragging]);

  const renderGridCells = () => {
    const cells = [];
    
    for (let y = visibleBounds.minY; y <= visibleBounds.maxY; y++) {
      for (let x = visibleBounds.minX; x <= visibleBounds.maxX; x++) {
        const cell = getCellAt(x, y);
        const isWinning = gameState.winningCells.some(pos => pos.x === x && pos.y === y);
        
        cells.push(
          <GameCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            player={cell?.player}
            isWinning={isWinning}
            onClick={handleCellClick}
          />
        );
      }
    }
    
    return cells;
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-gradient-background cursor-grab active:cursor-grabbing touch-none"
      ref={gridRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div
        className="absolute transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center',
        }}
      >
        <div
          className="relative"
          style={{
            width: (visibleBounds.maxX - visibleBounds.minX + 1) * CELL_SIZE,
            height: (visibleBounds.maxY - visibleBounds.minY + 1) * CELL_SIZE,
            left: visibleBounds.minX * CELL_SIZE,
            top: visibleBounds.minY * CELL_SIZE,
          }}
        >
          {renderGridCells()}
        </div>
      </div>
      
      {/* Center indicator */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-muted-foreground/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}