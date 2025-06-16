
// Retirement calculation utility functions

export const calculateFutureValue = (
  principal: number,
  rate: number,
  years: number,
  isAnnuity: boolean = false
): number => {
  if (isAnnuity) {
    // Future value of annuity formula: PMT * (((1 + r)^n - 1) / r)
    if (rate === 0) {
      return principal * years;
    }
    return principal * (Math.pow(1 + rate, years) - 1) / rate;
  } else {
    // Future value of lump sum: PV * (1 + r)^n
    return principal * Math.pow(1 + rate, years);
  }
};

export const calculateAnnuityPayment = (
  presentValue: number,
  rate: number,
  years: number
): number => {
  if (rate === 0) {
    return presentValue / years;
  }
  // Annuity payment formula: PV * (r / (1 - (1 + r)^(-n)))
  return presentValue * (rate / (1 - Math.pow(1 + rate, -years)));
};

export const calculateYearsToTarget = (
  currentAmount: number,
  annualContribution: number,
  rate: number,
  targetAmount: number
): number => {
  if (rate === 0) {
    return (targetAmount - currentAmount) / annualContribution;
  }
  
  // Using logarithmic formula to solve for time
  if (annualContribution === 0) {
    return Math.log(targetAmount / currentAmount) / Math.log(1 + rate);
  }
  
  // Complex formula for annuity with existing principal
  const numerator = Math.log(1 + (targetAmount * rate) / annualContribution);
  const denominator = Math.log(1 + rate);
  const futureValueContributions = annualContribution * ((Math.pow(1 + rate, numerator / denominator) - 1) / rate);
  
  // If current amount plus contributions can reach target
  if (currentAmount + futureValueContributions >= targetAmount) {
    return numerator / denominator;
  }
  
  // Fallback calculation
  return Math.log(targetAmount / currentAmount) / Math.log(1 + rate);
};
