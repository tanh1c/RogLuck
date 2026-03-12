import React from 'react';
import { useMetaStore, PERMANENT_UPGRADES } from '../../store/metaStore';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { ShoppingBag, X } from 'lucide-react';

interface MetaShopProps {
  onClose: () => void;
}

export const MetaShop: React.FC<MetaShopProps> = ({ onClose }) => {
  const { casinoCoins, purchaseUpgrade, getUpgradeLevel, getUpgradeCost, canAffordUpgrade } = useMetaStore();

  const handlePurchase = (id: string) => {
    if (canAffordUpgrade(id)) {
      purchaseUpgrade(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <PixelCard className="my-8 p-6 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-casino-gold" />
            <h2 className="text-2xl font-pixel text-casino-gold">Meta Shop</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Currency Display */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="text-lg font-pixel">
            Casino Coins: <span className="text-casino-gold text-xl">{casinoCoins}</span>
          </div>
        </div>

        {/* Upgrades Grid */}
        <div className="grid gap-4">
          {Object.values(PERMANENT_UPGRADES).map((upgrade) => {
            const level = getUpgradeLevel(upgrade.id);
            const cost = getUpgradeCost(upgrade.id);
            const isMaxed = level >= upgrade.maxLevel;
            const affordable = canAffordUpgrade(upgrade.id);

            return (
              <div
                key={upgrade.id}
                className={`p-4 rounded-lg border-2 ${
                  isMaxed ? 'border-casino-gold bg-casino-gold/10' : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-pixel text-casino-gold mb-1">
                      {upgrade.name} {isMaxed && 'MAX'}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{upgrade.description}</p>

                    {/* Level Display */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded ${
                            i < level ? 'bg-casino-gold' : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <PixelButton
                    onClick={() => handlePurchase(upgrade.id)}
                    variant={isMaxed ? 'secondary' : affordable ? 'primary' : 'secondary'}
                    disabled={isMaxed || !affordable}
                  >
                    {isMaxed ? 'MAXED' : `Buy (${cost})`}
                  </PixelButton>
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
};
