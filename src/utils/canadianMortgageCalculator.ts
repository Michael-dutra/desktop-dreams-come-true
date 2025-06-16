
export interface CanadianMortgageParams {
  principal: number; // P - Initial loan amount in CAD
  annualNominalRate: number; // i_nom - Annual nominal interest rate (as decimal, e.g., 0.045 for 4.5%)
  amortizationYears: number; // Y - Total years to repay
  compoundingFrequency?: number; // m - Default 2 for semi-annual
  paymentFrequency?: number; // n - Default 12 for monthly
}

export interface MortgageCalculationResult {
  monthlyPayment: number;
  effectiveAnnualRate: number;
  effectiveMonthlyRate: number;
  totalPayments: number;
  totalInterest: number;
}

export const calculateCanadianMortgage = ({
  principal,
  annualNominalRate,
  amortizationYears,
  compoundingFrequency = 2, // Semi-annual compounding
  paymentFrequency = 12 // Monthly payments
}: CanadianMortgageParams): MortgageCalculationResult => {
  // Step 1: Calculate effective annual rate
  // i_eff = (1 + i_nom/m)^m - 1
  const effectiveAnnualRate = Math.pow(1 + annualNominalRate / compoundingFrequency, compoundingFrequency) - 1;
  
  // Step 2: Calculate effective monthly rate
  // r = (1 + i_eff)^(1/n) - 1
  const effectiveMonthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / paymentFrequency) - 1;
  
  // Step 3: Calculate total number of payments
  // N = Y * n
  const totalPayments = amortizationYears * paymentFrequency;
  
  // Step 4: Calculate monthly payment using annuity formula
  // M = P * r / (1 - (1 + r)^(-N))
  let monthlyPayment: number;
  if (effectiveMonthlyRate === 0) {
    // Handle zero interest rate case
    monthlyPayment = principal / totalPayments;
  } else {
    monthlyPayment = (principal * effectiveMonthlyRate) / (1 - Math.pow(1 + effectiveMonthlyRate, -totalPayments));
  }
  
  // Calculate total interest
  const totalInterest = (monthlyPayment * totalPayments) - principal;
  
  return {
    monthlyPayment,
    effectiveAnnualRate,
    effectiveMonthlyRate,
    totalPayments,
    totalInterest
  };
};

export const calculatePayoffTime = (
  balance: number,
  monthlyPayment: number,
  annualNominalRate: number,
  extraPayment: number = 0
): number => {
  const totalPayment = monthlyPayment + extraPayment;
  
  // Convert to effective monthly rate for Canadian mortgages
  const effectiveAnnualRate = Math.pow(1 + annualNominalRate / 100 / 2, 2) - 1;
  const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;
  
  if (monthlyRate === 0) {
    return balance / totalPayment;
  }
  
  if (totalPayment <= balance * monthlyRate) {
    return 999; // Never pays off
  }
  
  const months = -Math.log(1 - (balance * monthlyRate) / totalPayment) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
};
