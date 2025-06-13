
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AssetsDetailDialog from "./AssetsDetailDialog";

interface AssetsBreakdownProps {
  totalAssets: number;
  activeBusinessAssets: number;
}

const AssetsBreakdown = ({ totalAssets, activeBusinessAssets }: AssetsBreakdownProps) => {
  const [open, setOpen] = React.useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Total Assets: {formatCurrency(totalAssets)}</div>
        <div>Active Business Assets: {formatCurrency(activeBusinessAssets)}</div>
        <Button onClick={() => setOpen(true)}>View Details</Button>
        <AssetsDetailDialog open={open} onOpenChange={setOpen} />
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;
