
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  // Generate sample retirement data for demonstration
  const generateRetirementData = () => {
    const data = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i <= 25; i++) {
      const year = currentYear + i;
      const age = 40 + i;
      const assets = 330000 + (i * 15000);
      const income = i >= 25 ? 4500 : 0; // Retirement income starts at age 65
      
      data.push({
        year,
        age,
        assets: assets.toLocaleString(),
        income: income.toLocaleString(),
        withdrawal: i >= 25 ? '54000' : '0',
      });
    }
    
    return data;
  };

  const retirementData = generateRetirementData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Retirement Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800">Current Assets</h3>
              <p className="text-2xl font-bold text-purple-600">$330K</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800">Target Retirement Age</h3>
              <p className="text-2xl font-bold text-green-600">65</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">Monthly Income Needed</h3>
              <p className="text-2xl font-bold text-blue-600">$4,500</p>
            </div>
          </div>

          {/* Year by Year Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Year-by-Year Account Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Total Assets</TableHead>
                  <TableHead>Monthly Income</TableHead>
                  <TableHead>Annual Withdrawal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retirementData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>${row.assets}</TableCell>
                    <TableCell>${row.income}</TableCell>
                    <TableCell>${row.withdrawal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Retirement Assumptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Investment Growth</h4>
                <p className="text-sm text-gray-600">Assuming 6% annual return on investments</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Inflation Rate</h4>
                <p className="text-sm text-gray-600">3% annual inflation adjustment</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Life Expectancy</h4>
                <p className="text-sm text-gray-600">Planning for age 90</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Withdrawal Strategy</h4>
                <p className="text-sm text-gray-600">4% safe withdrawal rule</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
