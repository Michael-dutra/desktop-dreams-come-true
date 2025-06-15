import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Bot, Copy, Pen, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SectionAIDialog } from "./SectionAIDialog";

// Define the schema for the form
const formSchema = z.object({
  currentAge: z.number().min(18).max(100),
  retirementAge: z.number().min(55).max(75),
  currentSavings: z.number().min(0),
  annualContribution: z.number().min(0),
  investmentReturnRate: z.number().min(0).max(20),
  inflationRate: z.number().min(0).max(10),
  incomeReplacementRate: z.number().min(50).max(100),
  lifeExpectancy: z.number().min(75).max(110),
  taxRate: z.number().min(0).max(50),
  additionalIncome: z.number().min(0),
  additionalExpenses: z.number().min(0),
  riskTolerance: z.string(),
  isPensionIncome: z.boolean().default(false),
  pensionIncomeAmount: z.number().min(0).optional(),
  isSocialSecurityIncome: z.boolean().default(false),
  socialSecurityIncomeAmount: z.number().min(0).optional(),
});

type RetirementDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RetirementDetailDialog: React.FC<RetirementDetailDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [showAIDialog, setShowAIDialog] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 12000,
      investmentReturnRate: 7,
      inflationRate: 3,
      incomeReplacementRate: 80,
      lifeExpectancy: 90,
      taxRate: 25,
      additionalIncome: 0,
      additionalExpenses: 0,
      riskTolerance: "Moderate",
      isPensionIncome: false,
      pensionIncomeAmount: 0,
      isSocialSecurityIncome: false,
      socialSecurityIncomeAmount: 0,
    },
  });

  // Function to calculate retirement projections
  const calculateRetirement = (values: z.infer<typeof formSchema>) => {
    const {
      currentAge,
      retirementAge,
      currentSavings,
      annualContribution,
      investmentReturnRate,
      inflationRate,
      incomeReplacementRate,
      lifeExpectancy,
      taxRate,
      additionalIncome,
      additionalExpenses,
      isPensionIncome,
      pensionIncomeAmount,
      isSocialSecurityIncome,
      socialSecurityIncomeAmount,
    } = values;

    // Convert percentages to decimals
    const investmentReturnDecimal = investmentReturnRate / 100;
    const inflationDecimal = inflationRate / 100;
    const incomeReplacementDecimal = incomeReplacementRate / 100;
    const taxDecimal = taxRate / 100;

    // Calculate years until retirement and years in retirement
    const yearsUntilRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Future value of current savings
    let futureValueSavings =
      currentSavings * Math.pow(1 + investmentReturnDecimal, yearsUntilRetirement);

    // Future value of annual contributions
    let futureValueContributions = 0;
    if (investmentReturnDecimal > 0) {
      futureValueContributions =
        (annualContribution *
          (Math.pow(1 + investmentReturnDecimal, yearsUntilRetirement) - 1)) /
        investmentReturnDecimal;
    } else {
      futureValueContributions = annualContribution * yearsUntilRetirement;
    }

    // Total savings at retirement
    let totalSavingsAtRetirement = futureValueSavings + futureValueContributions;

    // Annual retirement income needed
    let annualRetirementIncomeNeeded =
      incomeReplacementDecimal * annualContribution;

    // Adjust for inflation
    annualRetirementIncomeNeeded *= Math.pow(1 + inflationDecimal, yearsUntilRetirement);

    // Subtract additional income and expenses
    annualRetirementIncomeNeeded += additionalExpenses - additionalIncome;

    // Subtract pension and social security income
    if (isPensionIncome) {
      annualRetirementIncomeNeeded -= pensionIncomeAmount || 0;
    }
    if (isSocialSecurityIncome) {
      annualRetirementIncomeNeeded -= socialSecurityIncomeAmount || 0;
    }

    // Adjust for taxes
    annualRetirementIncomeNeeded /= 1 - taxDecimal;

    // Calculate required retirement nest egg
    let requiredRetirementNestEgg = 0;
    if (investmentReturnDecimal > 0) {
      requiredRetirementNestEgg =
        (annualRetirementIncomeNeeded *
          (1 - Math.pow(1 + investmentReturnDecimal, -yearsInRetirement))) /
        investmentReturnDecimal;
    } else {
      requiredRetirementNestEgg = annualRetirementIncomeNeeded * yearsInRetirement;
    }

    // Determine if retirement is on track
    const onTrack = totalSavingsAtRetirement >= requiredRetirementNestEgg;

    // Calculate surplus or deficit
    const surplusDeficit = totalSavingsAtRetirement - requiredRetirementNestEgg;

    return {
      totalSavingsAtRetirement,
      requiredRetirementNestEgg,
      onTrack,
      surplusDeficit,
    };
  };

  const {
    totalSavingsAtRetirement,
    requiredRetirementNestEgg,
    onTrack,
    surplusDeficit,
  } = calculateRetirement(form.getValues());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const generateRetirementAIAnalysis = ({
    totalSavingsAtRetirement,
    requiredRetirementNestEgg,
    onTrack,
    surplusDeficit,
    currentAge,
    retirementAge,
    investmentReturnRate,
    inflationRate,
    lifeExpectancy,
  }: {
    totalSavingsAtRetirement: number;
    requiredRetirementNestEgg: number;
    onTrack: boolean;
    surplusDeficit: number;
    currentAge: number;
    retirementAge: number;
    investmentReturnRate: number;
    inflationRate: number;
    lifeExpectancy: number;
  }) => {
    const onTrackMessage = onTrack
      ? "Based on your current projections, you are on track to meet your retirement goals."
      : "Based on your current projections, you may not meet your retirement goals.";
    const surplusDeficitMessage =
      surplusDeficit >= 0
        ? `You are projected to have a surplus of ${formatCurrency(
            surplusDeficit
          )} at retirement.`
        : `You are projected to have a deficit of ${formatCurrency(
            Math.abs(surplusDeficit)
          )} at retirement.`;

    return `
Based on your inputs:

- Current Age: ${currentAge}
- Retirement Age: ${retirementAge}
- Investment Return Rate: ${investmentReturnRate}%
- Inflation Rate: ${inflationRate}%
- Life Expectancy: ${lifeExpectancy}

Your total savings at retirement are projected to be ${formatCurrency(
      totalSavingsAtRetirement
    )}.
Your required retirement nest egg is ${formatCurrency(
      requiredRetirementNestEgg
    )}.

${onTrackMessage}
${surplusDeficitMessage}

Consider adjusting your savings, investment strategy, or retirement age to improve your retirement outlook.
`.trim();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Retirement Details
            </DialogTitle>
            <DialogDescription>
              Enter your retirement details to calculate your retirement
              projections.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                console.log(values);
              })}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your current age"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="retirementAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retirement Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your retirement age"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your current savings"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Contribution</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your annual contribution"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investmentReturnRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Return Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your investment return rate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your inflation rate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incomeReplacementRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Income Replacement Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your income replacement rate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lifeExpectancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Life Expectancy</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your life expectancy"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your tax rate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Income</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your additional income"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Expenses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your additional expenses"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Conservative">
                            Conservative
                          </SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPensionIncome"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Pension Income</FormLabel>
                        <FormDescription>
                          Do you have pension income?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.getValues("isPensionIncome") && (
                  <FormField
                    control={form.control}
                    name="pensionIncomeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pension Income Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your pension income amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="isSocialSecurityIncome"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Social Security Income</FormLabel>
                        <FormDescription>
                          Do you have social security income?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.getValues("isSocialSecurityIncome") && (
                  <FormField
                    control={form.control}
                    name="socialSecurityIncomeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Income Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your social security income amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="submit">Calculate</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIDialog(true)}
                >
                  AI Analysis
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SectionAIDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        title="Retirement"
        content={generateRetirementAIAnalysis({
          totalSavingsAtRetirement: totalSavingsAtRetirement,
          requiredRetirementNestEgg: requiredRetirementNestEgg,
          onTrack: onTrack,
          surplusDeficit: surplusDeficit,
          currentAge: form.getValues("currentAge"),
          retirementAge: form.getValues("retirementAge"),
          investmentReturnRate: form.getValues("investmentReturnRate"),
          inflationRate: form.getValues("inflationRate"),
          lifeExpectancy: form.getValues("lifeExpectancy"),
        })}
      />
    </>
  );
};
