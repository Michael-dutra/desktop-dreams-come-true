
export const calculateFV = (presentValue: number, rate: number, years: number, annualContribution: number = 0) => {
  const futureValueOfPresentAmount = presentValue * Math.pow(1 + rate / 100, years);
  
  if (annualContribution === 0) {
    return futureValueOfPresentAmount;
  }
  
  const futureValueOfAnnuity = annualContribution * (Math.pow(1 + rate / 100, years) - 1) / (rate / 100);
  return futureValueOfPresentAmount + futureValueOfAnnuity;
};

export const generateStableChartData = (currentValue: number, futureValue: number, years: number, rate: number) => {
  const data = [];
  for (let year = 0; year <= years; year++) {
    const value = currentValue * Math.pow(1 + rate / 100, year);
    data.push({
      year: year,
      value: Math.round(value)
    });
  }
  return data;
};
