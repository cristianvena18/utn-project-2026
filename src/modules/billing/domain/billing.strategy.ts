export type BillingQuote = {
  billedAmount: number;
  strategy: string;
  coverageValid: boolean;
};

export interface BillingStrategy {
  readonly name: string;
  quote(baseAmount: number): BillingQuote;
}
