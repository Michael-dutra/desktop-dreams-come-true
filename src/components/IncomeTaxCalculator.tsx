
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign } from "lucide-react";
import { useState } from "react";

export const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState<number>(80000);
  const [incomeType, setIncomeType] = useState("salary");
  const [province, setProvince] = useState("ON");

  // Simplified tax brackets for 2024 (federal + provincial)
  const taxBrackets = {
    ON: { // Ontario
      federal: [
        { min: 0, max: 55867, rate: 0.15 },
        { min: 55867, max: 111733, rate: 0.205 },
        { min: 111733, max: 173205, rate: 0.26 },
        { min: 173205, max: 246752, rate: 0.29 },
        { min: 246752, max: Infinity, rate: 0.33 }
      ],
      provincial: [
        { min: 0, max: 51446, rate: 0.0505 },
        { min: 51446, max: 102894, rate: 0.0915 },
        { min: 102894, max: 150000, rate: 0.1116 },
        { min: 150000, max: 220000, rate: 0.1216 },
        { min: 220000, max: Infinity, rate: 0.1316 }
      ]
    },
    BC: { // British Columbia
      federal: [
        { min: 0, max: 55867, rate: 0.15 },
        { min: 55867, max: 111733, rate: 0.205 },
        { min: 111733, max: 173205, rate: 0.26 },
        { min: 173205, max: 246752, rate: 0.29 },
        { min: 246752, max: Infinity, rate: 0.33 }
      ],
      provincial: [
        { min: 0, max: 47937, rate: 0.0506 },
        { min: 47937, max: 95875, rate: 0.077 },
        { min: 95875, max: 110076, rate: 0.105 },
        { min: 110076, max: 133664, rate: 0.1229 },
        { min: 133664, max: 181232, rate: 0.147 },
        { min: 181232, max: Infinity, rate: 0.168 }
      ]
    },
    AB: { // Alberta
      federal: [
        { min: 0, max: 55867, rate: 0.15 },
        { min: 55867, max: 111733, rate: 0.205 },
        { min: 111733, max: 173205, rate: 0.26 },
        { min: 173205, max: 246752, rate: 0.29 },
        { min: 246752, max: Infinity, rate: 0.33 }
      ],
      provincial: [
        { min: 0, max: Infinity, rate: 0.10 }
      ]
    }
  };

  const calculateTax = () => {
    const brackets = taxBrackets[province as keyof typeof taxBrackets];
    
    // Safety check - if province data doesn't exist, use Ontario as default
    if (!brackets) {
      console.log(`Tax data not available for province ${province}, using Ontario as fallback`);
      const fallbackBrackets = taxBrackets.ON;
      let federalTax = 0;
      let provincialTax = 0;

      // Calculate federal tax
      for (const bracket of fallbackBrackets.federal) {
        if (income > bracket.min) {
          const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
          federalTax += taxableInBracket * bracket.rate;
        }
      }

      // Calculate provincial tax
      for (const bracket of fallbackBrackets.provincial) {
        if (income > bracket.min) {
          const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
          provincialTax += taxableInBracket * bracket.rate;
        }
      }

      const totalTax = federalTax + provincialTax;
      const afterTaxIncome = income - totalTax;
      const effectiveRate = (totalTax / income) * 100;

      return {
        totalTax,
        afterTaxIncome,
        effectiveRate,
        federalTax,
        provincialTax
      };
    }

    let federalTax = 0;
    let provincialTax = 0;

    // Calculate federal tax
    for (const bracket of brackets.federal) {
      if (income > bracket.min) {
        const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
        federalTax += taxableInBracket * bracket.rate;
      }
    }

    // Calculate provincial tax
    for (const bracket of brackets.provincial) {
      if (income > bracket.min) {
        const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
        provincialTax += taxableInBracket * bracket.rate;
      }
    }

    const totalTax = federalTax + provincialTax;
    const afterTaxIncome = income - totalTax;
    const effectiveRate = (totalTax / income) * 100;

    // For eligible dividends, apply different treatment (simplified)
    if (incomeType === "eligible-dividends") {
      const grossedUpDividends = income * 1.38; // Gross-up factor
      const dividendTaxCredit = grossedUpDividends * 0.25; // Simplified credit
      const adjustedTax = Math.max(0, totalTax - dividendTaxCredit);
      
      return {
        totalTax: adjustedTax,
        afterTaxIncome: income - adjustedTax,
        effectiveRate: (adjustedTax / income) * 100,
        federalTax: federalTax * 0.75, // Approximation after credit
        provincialTax: provincialTax * 0.75
      };
    }

    // For ineligible dividends, apply different treatment (simplified)
    if (incomeType === "ineligible-dividends") {
      const grossedUpDividends = income * 1.15; // Lower gross-up factor for ineligible
      const dividendTaxCredit = grossedUpDividends * 0.11; // Lower credit
      const adjustedTax = Math.max(0, totalTax - dividendTaxCredit);
      
      return {
        totalTax: adjustedTax,
        afterTaxIncome: income - adjustedTax,
        effectiveRate: (adjustedTax / income) * 100,
        federalTax: federalTax * 0.9, // Smaller credit adjustment
        provincialTax: provincialTax * 0.9
      };
    }

    return {
      totalTax,
      afterTaxIncome,
      effectiveRate,
      federalTax,
      provincialTax
    };
  };

  const taxResults = calculateTax();

  const provinces = [
    { value: "ON", label: "Ontario" },
    { value: "BC", label: "British Columbia" },
    { value: "AB", label: "Alberta" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "MB", label: "Manitoba" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NB", label: "New Brunswick" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "YT", label: "Yukon" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NU", label: "Nunavut" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Income Tax Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Annual Income</label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                placeholder="Enter income"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Income Type</label>
              <Select value={incomeType} onValueChange={setIncomeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary/Employment</SelectItem>
                  <SelectItem value="eligible-dividends">Eligible Dividends</SelectItem>
                  <SelectItem value="ineligible-dividends">Ineligible Dividends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Province</label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((prov) => (
                    <SelectItem key={prov.value} value={prov.value}>
                      {prov.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Tax</p>
              <p className="text-xl font-bold text-red-600">
                ${taxResults.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">After-Tax Income</p>
              <p className="text-xl font-bold text-green-600">
                ${taxResults.afterTaxIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold text-blue-600">
                {taxResults.effectiveRate.toFixed(1)}%
              </p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly After-Tax</p>
              <p className="text-xl font-bold text-purple-600">
                ${(taxResults.afterTaxIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium">Tax Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm">Federal Tax</span>
                <span className="font-semibold">${taxResults.federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm">Provincial Tax</span>
                <span className="font-semibold">${taxResults.provincialTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              {(incomeType === "eligible-dividends" || incomeType === "ineligible-dividends") && (
                <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
                  * Dividend calculations include gross-up and tax credit approximations
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
