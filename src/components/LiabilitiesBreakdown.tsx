
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LiabilitiesBreakdown = () => {
  const liabilities = [
    { name: "Mortgage", amount: "$420,000", color: "bg-red-500" },
    { name: "Car Loan", amount: "$18,000", color: "bg-orange-500" },
    { name: "Credit Cards", amount: "$7,500", color: "bg-yellow-500" },
  ];

  const monthlyPayments = [
    { name: "Monthly Payments", amount: "$7,500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            {liabilities.map((liability, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${liability.color}`}></div>
                  <span className="text-sm font-medium">{liability.name}</span>
                </div>
                <span className="text-sm font-semibold text-red-600">{liability.amount}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Payments</span>
              <span className="text-sm font-semibold">$7,500</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesBreakdown;
