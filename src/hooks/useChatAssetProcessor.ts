
import { useCallback } from 'react';
import { useAssets } from '@/contexts/AssetsContext';
import { parseAssetFromMessage, isAssetMessage } from '@/utils/naturalLanguageParser';
import { useToast } from '@/hooks/use-toast';

export const useChatAssetProcessor = () => {
  const { assets, addAsset, updateAsset } = useAssets();
  const { toast } = useToast();

  const processMessage = useCallback((message: string) => {
    if (!isAssetMessage(message)) {
      return false; // Not an asset-related message
    }

    const parsedAssets = parseAssetFromMessage(message);
    
    if (parsedAssets.length === 0) {
      return false; // No assets found
    }

    parsedAssets.forEach(parsedAsset => {
      // Check if asset already exists (by name)
      const existingAsset = assets.find(a => 
        a.name.toLowerCase() === parsedAsset.name.toLowerCase()
      );

      if (existingAsset) {
        // Update existing asset
        updateAsset(existingAsset.id, parsedAsset.amount);
        toast({
          title: "Asset Updated",
          description: `Updated ${parsedAsset.name} to $${parsedAsset.amount.toLocaleString()}`,
        });
      } else {
        // Add new asset
        addAsset({
          name: parsedAsset.name,
          value: parsedAsset.amount,
          color: parsedAsset.color,
        });
        toast({
          title: "Asset Added",
          description: `Added ${parsedAsset.name} with value $${parsedAsset.amount.toLocaleString()}`,
        });
      }
    });

    return true; // Message was processed
  }, [assets, addAsset, updateAsset, toast]);

  return { processMessage };
};
