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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Total Assets: {totalAssets}</div>
        <div>Active Business Assets: {activeBusinessAssets}</div>
        <Button onClick={() => setOpen(true)}>View Details</Button>
        <AssetsDetailDialog open={open} onOpenChange={setOpen} />
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;
