import { useState, useEffect, useCallback } from 'react';

export type Player = 'X' | 'O';
export type CellPosition = { x: number; y: number };
export type GameCell = { 
  position: CellPosition; 
  player: Player;
};

export interface GameState {
  cells: GameCell[];
  currentPlayer: Player;
  winner: Player | null;
  winningCells: CellPosition[];
  gridBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

const INITIAL_GRID_SIZE = 10;
const WIN_LENGTH = 5;
const STORAGE_KEY = 'infinite-tictactoe-state';

const initialState: GameState = {
  cells: [],
  currentPlayer: 'X',
  winner: null,
  winningCells: [],
  gridBounds: {
    minX: -INITIAL_GRID_SIZE,
    maxX: INITIAL_GRID_SIZE,
    minY: -INITIAL_GRID_SIZE,
    maxY: INITIAL_GRID_SIZE,
  }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const getCellAt = useCallback((x: number, y: number): GameCell | null => {
    return gameState.cells.find(cell => cell.position.x === x && cell.position.y === y) || null;
  }, [gameState.cells]);

  const checkWin = useCallback((cells: GameCell[], lastMove: CellPosition, player: Player): CellPosition[] => {
    const directions = [
      { dx: 1, dy: 0 },   // horizontal
      { dx: 0, dy: 1 },   // vertical
      { dx: 1, dy: 1 },   // diagonal \
      { dx: 1, dy: -1 },  // diagonal /
    ];

    for (const { dx, dy } of directions) {
      const line: CellPosition[] = [lastMove];
      
      // Check positive direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const pos = { x: lastMove.x + dx * i, y: lastMove.y + dy * i };
        const cell = cells.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (cell && cell.player === player) {
          line.push(pos);
        } else {
          break;
        }
      }
      
      // Check negative direction
      for (let i = 1; i < WIN_LENGTH; i++) {
        const pos = { x: lastMove.x - dx * i, y: lastMove.y - dy * i };
        const cell = cells.find(c => c.position.x === pos.x && c.position.y === pos.y);
        if (cell && cell.player === player) {
          line.unshift(pos);
        } else {
          break;
        }
      }
      
      if (line.length >= WIN_LENGTH) {
        return line.slice(0, WIN_LENGTH);
      }
    }
    
    return [];
  }, []);

  const expandGrid = useCallback((x: number, y: number, bounds: GameState['gridBounds']) => {
    const buffer = 3; // Expand grid with buffer for smooth infinite scrolling
    return {
      minX: Math.min(bounds.minX, x - buffer),
      maxX: Math.max(bounds.maxX, x + buffer),
      minY: Math.min(bounds.minY, y - buffer),
      maxY: Math.max(bounds.maxY, y + buffer),
    };
  }, []);

  const makeMove = useCallback((x: number, y: number) => {
    if (gameState.winner || getCellAt(x, y)) return;

    const newCell: GameCell = {
      position: { x, y },
      player: gameState.currentPlayer
    };

    const newCells = [...gameState.cells, newCell];
    const winningCells = checkWin(newCells, { x, y }, gameState.currentPlayer);
    const newBounds = expandGrid(x, y, gameState.gridBounds);

    setGameState({
      cells: newCells,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner: winningCells.length > 0 ? gameState.currentPlayer : null,
      winningCells,
      gridBounds: newBounds,
    });
  }, [gameState, getCellAt, checkWin, expandGrid]);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return {
    gameState,
    makeMove,
    resetGame,
    getCellAt,
  };
}