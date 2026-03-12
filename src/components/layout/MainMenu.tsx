import React from 'react';
import { Play, Save, ShoppingBag, BarChart3, Trophy } from 'lucide-react';
import { useSaveLoad } from '../../hooks/useSaveLoad';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onShop: () => void;
  onStats: () => void;
  onAchievements: () => void;
  onCharacterUnlocks: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onShop,
  onStats,
  onAchievements,
  onCharacterUnlocks,
}) => {
  const { hasSave } = useSaveLoad();

  return (
    <div className="flex flex-col gap-4 min-w-[250px]">
      <button
        onClick={onNewGame}
        className="flex items-center gap-3 p-4 bg-casino-gold text-casino-dark rounded-lg hover:bg-yellow-400 transition-colors font-pixel btn-pixel"
      >
        <Play className="w-6 h-6" />
        New Run
      </button>

      <button
        onClick={onContinue}
        disabled={!hasSave()}
        className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-pixel"
      >
        <Save className="w-6 h-6" />
        Continue
      </button>

      <button
        onClick={onShop}
        className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors btn-pixel"
      >
        <ShoppingBag className="w-6 h-6" />
        Meta Shop
      </button>

      <button
        onClick={onCharacterUnlocks}
        className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors btn-pixel"
      >
        <Play className="w-6 h-6" />
        Character Unlocks
      </button>

      <div className="flex gap-4">
        <button
          onClick={onStats}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors btn-pixel"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm">Stats</span>
        </button>

        <button
          onClick={onAchievements}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors btn-pixel"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Trophies</span>
        </button>
      </div>
    </div>
  );
};
