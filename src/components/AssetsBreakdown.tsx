
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AssetsBreakdown = () => {
  const assets = [
    { name: "Real Estate", amount: "$620,000", color: "bg-blue-500" },
    { name: "RRSP", amount: "$52,000", color: "bg-green-500" },
    { name: "TFSA", amount: "$38,000", color: "bg-purple-500" },
    { name: "Non-Registered", amount: "$25,000", color: "bg-orange-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${asset.color}`}></div>
                <span className="text-sm font-medium">{asset.name}</span>
              </div>
              <span className="text-sm font-semibold">{asset.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;
