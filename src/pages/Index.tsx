import { GameGrid } from '@/components/GameGrid';
import { GameHeader } from '@/components/GameHeader';
import { GameInstructions } from '@/components/GameInstructions';
import { useGameState } from '@/hooks/useGameState';

const Index = () => {
  const { gameState, makeMove, resetGame, getCellAt } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-background">
      <GameHeader
        currentPlayer={gameState.currentPlayer}
        winner={gameState.winner}
        onReset={resetGame}
      />
      
      <main className="relative">
        <div 
          className="w-full overflow-hidden"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <GameGrid
            gameState={gameState}
            onCellClick={makeMove}
            getCellAt={getCellAt}
          />
        </div>
      </main>
      
      <GameInstructions />
    </div>
  );
};

export default Index;
