
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface LiabilitiesDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  liabilities: Array<{
    name: string;
    amount: string;
    value: number;
    color: string;
  }>;
}

export const LiabilitiesDetailDialog = ({ isOpen, onClose, liabilities }: LiabilitiesDetailDialogProps) => {
  // Mortgage state
  const [mortgageAmount, setMortgageAmount] = useState("420000");
  const [mortgageRate, setMortgageRate] = useState("3.25");
  const [mortgageFrequency, setMortgageFrequency] = useState("monthly");

  // Car loan state
  const [carBalance, setCarBalance] = useState("18000");
  const [carRate, setCarRate] = useState("4.5");
  const [carPayment, setCarPayment] = useState("350");
  const [carFrequency, setCarFrequency] = useState("monthly");

  // Credit card state
  const [cardBalance, setCardBalance] = useState("7500");
  const [cardRate, setCardRate] = useState("19.99");
  const [cardPayment, setCardPayment] = useState("250");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Liabilities Breakdown</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Mortgage Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Mortgage</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mortgage-amount">Current Amount</Label>
                <Input
                  id="mortgage-amount"
                  value={mortgageAmount}
                  onChange={(e) => setMortgageAmount(e.target.value)}
                  placeholder="420,000"
                />
              </div>
              <div>
                <Label htmlFor="mortgage-rate">Interest Rate (%)</Label>
                <Input
                  id="mortgage-rate"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(e.target.value)}
                  placeholder="3.25"
                />
              </div>
              <div>
                <Label htmlFor="mortgage-frequency">Payment Frequency</Label>
                <Select value={mortgageFrequency} onValueChange={setMortgageFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Car Loan Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Car Loan</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="car-balance">Balance</Label>
                <Input
                  id="car-balance"
                  value={carBalance}
                  onChange={(e) => setCarBalance(e.target.value)}
                  placeholder="18,000"
                />
              </div>
              <div>
                <Label htmlFor="car-rate">Interest Rate (%)</Label>
                <Input
                  id="car-rate"
                  value={carRate}
                  onChange={(e) => setCarRate(e.target.value)}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="car-payment">Payment</Label>
                <Input
                  id="car-payment"
                  value={carPayment}
                  onChange={(e) => setCarPayment(e.target.value)}
                  placeholder="350"
                />
              </div>
              <div>
                <Label htmlFor="car-frequency">Payment Frequency</Label>
                <Select value={carFrequency} onValueChange={setCarFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Credit Card Section */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-600">Credit Card</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="card-balance">Balance</Label>
                <Input
                  id="card-balance"
                  value={cardBalance}
                  onChange={(e) => setCardBalance(e.target.value)}
                  placeholder="7,500"
                />
              </div>
              <div>
                <Label htmlFor="card-rate">Interest Rate (%)</Label>
                <Input
                  id="card-rate"
                  value={cardRate}
                  onChange={(e) => setCardRate(e.target.value)}
                  placeholder="19.99"
                />
              </div>
              <div>
                <Label htmlFor="card-payment">Monthly Payment</Label>
                <Input
                  id="card-payment"
                  value={cardPayment}
                  onChange={(e) => setCardPayment(e.target.value)}
                  placeholder="250"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-600">$445,500</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly Payments</p>
                <p className="text-2xl font-bold">$7,500</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
