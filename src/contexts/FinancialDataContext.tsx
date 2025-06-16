
import React, { createContext, useContext, useState } from 'react';

export interface Asset {
  id: string;
  name: string;
  amount: string;
  value: number;
  color: string;
  // Additional detailed properties for the popup
  purchasePrice?: number;
  mortgageBalance?: number;
  monthlyPayment?: number;
  interestRate?: number;
  remainingTerm?: number;
  growthRate?: number;
  category?: string;
  description?: string;
}

export interface Liability {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface FinancialDataContextType {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  liabilities: Liability[];
  setLiabilities: (liabilities: Liability[]) => void;
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
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
      purchasePrice: 450000,
      mortgageBalance: 420000,
      monthlyPayment: 2100,
      interestRate: 3.2,
      remainingTerm: 18,
      growthRate: 5,
      category: "Property",
      description: "Primary residence"
    },
    { 
      id: "2",
      name: "RRSP", 
      amount: "$52,000", 
      value: 52000, 
      color: "#10b981",
      growthRate: 7,
      category: "Retirement",
      description: "Registered retirement savings plan"
    },
    { 
      id: "3",
      name: "TFSA", 
      amount: "$38,000", 
      value: 38000, 
      color: "#8b5cf6",
      growthRate: 6,
      category: "Tax-Free",
      description: "Tax-free savings account"
    },
    { 
      id: "4",
      name: "Non-Registered", 
      amount: "$25,000", 
      value: 25000, 
      color: "#f59e0b",
      growthRate: 6,
      category: "Investment",
      description: "Non-registered investment account"
    },
    { 
      id: "5",
      name: "Digital Asset", 
      amount: "$15,000", 
      value: 15000, 
      color: "#ef4444",
      growthRate: 12,
      category: "Crypto",
      description: "Cryptocurrency holdings"
    },
  ]);

  const [liabilities, setLiabilities] = useState<Liability[]>([
    { name: "Mortgage", amount: "$420,000", value: 420000, color: "#dc2626" },
    { name: "Credit Card", amount: "$27,500", value: 27500, color: "#f97316" },
  ]);

  const addAsset = (newAsset: Omit<Asset, 'id'>) => {
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString(),
    };
    setAssets(prev => [...prev, asset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id 
        ? { 
            ...asset, 
            ...updates,
            amount: updates.value ? `$${updates.value.toLocaleString()}` : asset.amount
          }
        : asset
    ));
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
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

  return (
    <FinancialDataContext.Provider value={{
      assets,
      setAssets,
      addAsset,
      updateAsset,
      removeAsset,
      liabilities,
      setLiabilities,
      getTotalAssets,
      getTotalLiabilities,
      getNetWorth,
    }}>
      {children}
    </FinancialDataContext.Provider>
  );
};
