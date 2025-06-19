
interface ParsedAsset {
  type: string;
  amount: number;
  name: string;
  color: string;
  category?: string;
}

// Asset type mappings
const assetTypeMap: Record<string, { name: string; color: string; category?: string }> = {
  tfsa: { name: 'TFSA', color: '#f59e0b', category: 'retirement' },
  rrsp: { name: 'RRSP', color: '#10b981', category: 'retirement' },
  'tax free savings account': { name: 'TFSA', color: '#f59e0b', category: 'retirement' },
  'registered retirement savings plan': { name: 'RRSP', color: '#10b981', category: 'retirement' },
  house: { name: 'Primary Residence', color: '#3b82f6', category: 'real-estate' },
  home: { name: 'Primary Residence', color: '#3b82f6', category: 'real-estate' },
  residence: { name: 'Primary Residence', color: '#3b82f6', category: 'real-estate' },
  property: { name: 'Real Estate', color: '#3b82f6', category: 'real-estate' },
  stocks: { name: 'Stock Portfolio', color: '#ef4444', category: 'investment' },
  investments: { name: 'Investment Portfolio', color: '#ef4444', category: 'investment' },
  'non-registered': { name: 'Non-Registered', color: '#ef4444', category: 'investment' },
  savings: { name: 'Savings Account', color: '#6b7280', category: 'other' },
  'checking account': { name: 'Checking Account', color: '#6b7280', category: 'other' },
  'savings account': { name: 'Savings Account', color: '#6b7280', category: 'other' },
  business: { name: 'Business Assets', color: '#8b5cf6', category: 'business' },
  company: { name: 'Business Assets', color: '#8b5cf6', category: 'business' },
};

// Amount parsing patterns
const amountPatterns = [
  // Match patterns like "50k", "$50k", "50000", "$50,000"
  /(?:\$?)(\d+(?:,\d{3})*(?:\.\d{2})?)[kK]/g,  // 50k, $50k
  /(?:\$?)(\d+(?:,\d{3})*(?:\.\d{2})?)/g,      // 50000, $50,000
];

// Asset detection patterns
const assetPatterns = [
  /(?:i have|i've got|my|got)\s+(?:\$?)(\d+(?:,\d{3})*(?:\.\d{2})?[kK]?)\s+(?:in|of)\s+(?:my\s+)?([a-zA-Z\s-]+)/gi,
  /(?:\$?)(\d+(?:,\d{3})*(?:\.\d{2})?[kK]?)\s+(?:in|of)\s+(?:my\s+)?([a-zA-Z\s-]+)/gi,
];

function parseAmount(amountStr: string): number {
  // Remove $ and commas
  const cleanAmount = amountStr.replace(/[$,]/g, '');
  
  // Handle 'k' suffix
  if (cleanAmount.toLowerCase().endsWith('k')) {
    return parseFloat(cleanAmount.slice(0, -1)) * 1000;
  }
  
  return parseFloat(cleanAmount);
}

function normalizeAssetType(assetType: string): string {
  return assetType.toLowerCase().trim();
}

export function parseAssetFromMessage(message: string): ParsedAsset[] {
  const assets: ParsedAsset[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Try different patterns to extract asset information
  for (const pattern of assetPatterns) {
    let match;
    while ((match = pattern.exec(lowerMessage)) !== null) {
      const amountStr = match[1];
      const assetTypeStr = match[2].trim();
      
      const amount = parseAmount(amountStr);
      const normalizedType = normalizeAssetType(assetTypeStr);
      
      // Find matching asset type
      const assetInfo = Object.entries(assetTypeMap).find(([key]) => 
        normalizedType.includes(key) || key.includes(normalizedType)
      );
      
      if (assetInfo && amount > 0) {
        const [, config] = assetInfo;
        assets.push({
          type: normalizedType,
          amount,
          name: config.name,
          color: config.color,
          category: config.category,
        });
      }
    }
  }
  
  return assets;
}

export function isAssetMessage(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return assetPatterns.some(pattern => pattern.test(lowerMessage)) ||
         /(?:i have|i've got|my|got).+(?:\$?\d+[kK]?).+(?:tfsa|rrsp|house|home|stocks|investments|savings)/i.test(lowerMessage);
}
