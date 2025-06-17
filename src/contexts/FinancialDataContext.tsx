
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Asset {
  id: string;
  name: string;
  amount: string;
  value: number;
  color: string;
  category: 'retirement' | 'investment' | 'real-estate' | 'business' | 'other';
  isRetirementEligible: boolean;
}

export interface Liability {
  id: string;
  name: string;
  amount: string;
  value: number;
  color: string;
  category: 'mortgage' | 'loan' | 'credit' | 'business' | 'other';
}

interface FinancialDataContextType {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  liabilities: Liability[];
  setLiabilities: (liabilities: Liability[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, updates: Partial<Liability>) => void;
  removeLiability: (id: string) => void;
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
  getRetirementAssets: () => Asset[];
  getTotalRetirementSavings: () => number;
  getEstateAssets: () => Asset[];
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};

// Helper functions for localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with empty arrays, then load from localStorage
  const [assets, setAssetsState] = useState<Asset[]>([]);
  const [liabilities, setLiabilitiesState] = useState<Liability[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading financial data from localStorage...');
    const storedAssets = loadFromStorage('financial-assets', []);
    const storedLiabilities = loadFromStorage('financial-liabilities', [
      { 
        id: "1", 
        name: "Mortgage", 
        amount: "$420,000", 
        value: 420000, 
        color: "#dc2626", 
        category: "mortgage"
      },
      { 
        id: "2", 
        name: "Credit Card", 
        amount: "$27,500", 
        value: 27500, 
        color: "#f97316", 
        category: "credit"
      },
    ]);
    
    console.log('Loaded assets from storage:', storedAssets);
    console.log('Loaded liabilities from storage:', storedLiabilities);
    
    setAssetsState(storedAssets);
    setLiabilitiesState(storedLiabilities);
  }, []);

  // Custom setters that also save to localStorage
  const setAssets = (newAssets: Asset[]) => {
    console.log('Setting assets:', newAssets);
    setAssetsState(newAssets);
    saveToStorage('financial-assets', newAssets);
  };

  const setLiabilities = (newLiabilities: Liability[]) => {
    console.log('Setting liabilities:', newLiabilities);
    setLiabilitiesState(newLiabilities);
    saveToStorage('financial-liabilities', newLiabilities);
  };

  const addAsset = (asset: Asset) => {
    console.log('Adding asset:', asset);
    const newAssets = [...assets, asset];
    setAssets(newAssets);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    console.log('Updating asset:', id, updates);
    const newAssets = assets.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    );
    setAssets(newAssets);
  };

  const removeAsset = (id: string) => {
    console.log('Removing asset:', id);
    const newAssets = assets.filter(asset => asset.id !== id);
    setAssets(newAssets);
  };

  const addLiability = (liability: Liability) => {
    console.log('Adding liability:', liability);
    const newLiabilities = [...liabilities, liability];
    setLiabilities(newLiabilities);
  };

  const updateLiability = (id: string, updates: Partial<Liability>) => {
    console.log('Updating liability:', id, updates);
    const newLiabilities = liabilities.map(liability => 
      liability.id === id ? { ...liability, ...updates } : liability
    );
    setLiabilities(newLiabilities);
  };

  const removeLiability = (id: string) => {
    console.log('Removing liability:', id);
    const newLiabilities = liabilities.filter(liability => liability.id !== id);
    setLiabilities(newLiabilities);
  };

  const getTotalAssets = () => {
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);
    console.log('Total assets calculated:', total);
    return total;
  };

  const getTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => sum + liability.value, 0);
  };

  const getNetWorth = () => {
    return getTotalAssets() - getTotalLiabilities();
  };

  const getRetirementAssets = () => {
    return assets.filter(asset => asset.isRetirementEligible);
  };

  const getTotalRetirementSavings = () => {
    return getRetirementAssets().reduce((sum, asset) => sum + asset.value, 0);
  };

  const getEstateAssets = () => {
    return assets; // All assets are included in estate
  };

  return (
    <FinancialDataContext.Provider value={{
      assets,
      setAssets,
      liabilities,
      setLiabilities,
      addAsset,
      updateAsset,
      removeAsset,
      addLiability,
      updateLiability,
      removeLiability,
      getTotalAssets,
      getTotalLiabilities,
      getNetWorth,
      getRetirementAssets,
      getTotalRetirementSavings,
      getEstateAssets,
    }}>
      {children}
    </FinancialDataContext.Provider>
  );
};
