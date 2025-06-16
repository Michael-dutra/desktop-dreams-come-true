
import React, { createContext, useContext, useState } from 'react';

export interface Asset {
  name: string;
  amount: string;
  value: number;
  color: string;
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
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
    { name: "Digital Asset", amount: "$15,000", value: 15000, color: "#ef4444" },
  ]);

  const [liabilities, setLiabilities] = useState<Liability[]>([
    { name: "Mortgage", amount: "$420,000", value: 420000, color: "#dc2626" },
    { name: "Credit Card", amount: "$27,500", value: 27500, color: "#f97316" },
  ]);

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
