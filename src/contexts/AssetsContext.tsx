
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Asset {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface AssetsContextType {
  assets: Asset[];
  updateAsset: (id: string, value: number) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  deleteAsset: (id: string) => void;
  getTotalAssets: () => number;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

const initialAssets: Asset[] = [
  { id: '1', name: 'Primary Residence', value: 620000, color: '#3b82f6' },
  { id: '2', name: 'RRSP', value: 52000, color: '#10b981' },
  { id: '4', name: 'Non-Registered', value: 25000, color: '#ef4444' },
];

export const AssetsProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);

  const updateAsset = (id: string, value: number) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, value } : asset
    ));
  };

  const addAsset = (newAsset: Omit<Asset, 'id'>) => {
    const id = Date.now().toString();
    setAssets(prev => [...prev, { ...newAsset, id }]);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const getTotalAssets = () => {
    return assets.reduce((total, asset) => total + asset.value, 0);
  };

  return (
    <AssetsContext.Provider value={{
      assets,
      updateAsset,
      addAsset,
      deleteAsset,
      getTotalAssets
    }}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};
