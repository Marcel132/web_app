export interface SubscriptionModel {
	email: string;
	purchaseDate: Date;
	expirationDate: Date;
	paymentMethod: string;
	price: number;
	status: string;
	lastPaymentStatus: string;
	recurringPayment: boolean;
}
