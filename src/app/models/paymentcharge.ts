import Stripe from 'stripe';

export interface Paymentcharge {
    id: string;
    amount: number;
    currency: string
}
