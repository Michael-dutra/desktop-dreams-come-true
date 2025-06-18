
import { Asset } from "@/contexts/AssetsContext";

interface AssetMatch {
  type: string;
  amount: number;
  action: string;
}

export const processChatMessage = (message: string): AssetMatch | null => {
  const lowerMessage = message.toLowerCase();
  
  // Asset type patterns
  const assetPatterns = [
    { pattern: /tfsa|tax.free|tax free/i, type: 'TFSA', category: 'retirement' as const, isRetirementEligible: true, taxStatus: 'tax-free' as const },
    { pattern: /rrsp|registered retirement/i, type: 'RRSP', category: 'retirement' as const, isRetirementEligible: true, taxStatus: 'fully-taxable' as const },
    { pattern: /non.registered|investment account|trading account/i, type: 'Investment Account', category: 'investment' as const, isRetirementEligible: false, taxStatus: 'capital-gains' as const },
    { pattern: /house|home|primary residence|residence/i, type: 'Primary Residence', category: 'real-estate' as const, isRetirementEligible: false, taxStatus: 'capital-gains' as const },
    { pattern: /cottage|cabin|vacation home|second home/i, type: 'Cottage', category: 'real-estate' as const, isRetirementEligible: false, taxStatus: 'capital-gains' as const },
    { pattern: /stocks?|equities/i, type: 'Stock Portfolio', category: 'investment' as const, isRetirementEligible: false, taxStatus: 'capital-gains' as const },
    { pattern: /bonds?/i, type: 'Bond Portfolio', category: 'investment' as const, isRetirementEligible: false, taxStatus: 'capital-gains' as const },
  ];

  // Amount patterns - handle various formats
  const amountPatterns = [
    /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*k/i, // 50k, $50k
    /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*thousand/i, // 50 thousand
    /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i, // $50000, 50000
  ];

  // Action patterns
  const actionPatterns = [
    /have|has|contains?|worth|valued? at|is/i
  ];

  // Find asset type
  let assetInfo = null;
  for (const assetPattern of assetPatterns) {
    if (assetPattern.pattern.test(lowerMessage)) {
      assetInfo = assetPattern;
      break;
    }
  }

  if (!assetInfo) return null;

  // Find amount
  let amount = 0;
  for (const amountPattern of amountPatterns) {
    const match = lowerMessage.match(amountPattern);
    if (match) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      
      // Handle k suffix (multiply by 1000)
      if (lowerMessage.includes('k') || lowerMessage.includes('thousand')) {
        value *= 1000;
      }
      
      amount = value;
      break;
    }
  }

  if (amount === 0) return null;

  // Check for action
  const hasAction = actionPatterns.some(pattern => pattern.test(lowerMessage));
  if (!hasAction) return null;

  return {
    type: assetInfo.type,
    amount,
    action: 'add',
    category: assetInfo.category,
    isRetirementEligible: assetInfo.isRetirementEligible,
    taxStatus: assetInfo.taxStatus
  };
};

export const createAssetFromMatch = (match: AssetMatch & { category: string; isRetirementEligible: boolean; taxStatus: string }): Omit<Asset, 'id'> => {
  const colors = {
    'TFSA': '#10b981',
    'RRSP': '#3b82f6', 
    'Investment Account': '#8b5cf6',
    'Primary Residence': '#f59e0b',
    'Cottage': '#f97316',
    'Stock Portfolio': '#ef4444',
    'Bond Portfolio': '#06b6d4'
  };

  return {
    name: match.type,
    amount: `$${match.amount.toLocaleString()}`,
    value: match.amount,
    color: colors[match.type as keyof typeof colors] || '#6b7280',
    category: match.category as any,
    isRetirementEligible: match.isRetirementEligible,
    taxStatus: match.taxStatus as any
  };
};
