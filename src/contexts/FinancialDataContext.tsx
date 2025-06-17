
import React, { createContext, useContext, useState } from 'react';

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

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([
    { 
      id: "1", 
      name: "Real Estate", 
      amount: "$620,000", 
      value: 620000, 
      color: "#3b82f6", 
      category: "real-estate",
      isRetirementEligible: false
    },
    { 
      id: "2", 
      name: "RRSP", 
      amount: "$52,000", 
      value: 52000, 
      color: "#10b981", 
      category: "retirement",
      isRetirementEligible: true
    },
    { 
      id: "3", 
      name: "TFSA", 
      amount: "$38,000", 
      value: 38000, 
      color: "#8b5cf6", 
      category: "retirement",
      isRetirementEligible: true
    },
    { 
      id: "4", 
      name: "Non-Registered", 
      amount: "$25,000", 
      value: 25000, 
      color: "#f59e0b", 
      category: "investment",
      isRetirementEligible: true
    },
    { 
      id: "5", 
      name: "Digital Asset", 
      amount: "$15,000", 
      value: 15000, 
      color: "#ef4444", 
      category: "investment",
      isRetirementEligible: false
    },
  ]);

  const [liabilities, setLiabilities] = useState<Liability[]>([
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

  const addAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addLiability = (liability: Liability) => {
    setLiabilities(prev => [...prev, liability]);
  };

  const updateLiability = (id: string, updates: Partial<Liability>) => {
    setLiabilities(prev => prev.map(liability => 
      liability.id === id ? { ...liability, ...updates } : liability
    ));
  };

  const removeLiability = (id: string) => {
    setLiabilities(prev => prev.filter(liability => liability.id !== id));
  };

  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
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
