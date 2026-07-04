export interface SubscriptionResponse {
  success: boolean;
  count: number;
  plans: Plan[];
}

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  formattedPrice: string;
  duration: number;
  durationUnit: string;
  formattedDuration: string;
  trialPeriod: number;
  description: string;
  features: string[];
  stripePriceId: string;
}

export interface SubcriptionRequest {
  subscriptionPlan: string;
  successUrl: string;
  cancelUrl: string;
}
export interface SubcritionResponse {
  success: boolean;
  sessionId: string;
  url: string;
}
