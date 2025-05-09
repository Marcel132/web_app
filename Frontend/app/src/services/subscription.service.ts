import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { apiUrl } from '../env/env.route';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';
import { firstValueFrom} from 'rxjs';
import { SubscriptionModel } from '../models/subscription.mode';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

	private email: string | null = null
	private role: string | null = null

	constructor(
		private http: HttpClient,
		private stateService: StateService,
		private tokenService: TokenService,
	){}

	async getSubscriptionDetails(): Promise<{ state: boolean, message: string | null, error: string | null}> {
		const url = apiUrl.subscription

		this.email = await firstValueFrom(this.stateService.userEmailSubject$)
		this.role = await firstValueFrom(this.stateService.userRoleSubject$)

		const body = {
			email: this.email,
			role: this.role
		}

		try {
			const response = await firstValueFrom(
				this.http.post<{subscriptionToken: string, state: boolean, isActive: boolean, paymentStatus: string, error: string | null}>(url, body, {withCredentials: true})
			)
			const tokenPayload = this.tokenService.decodeToken(response.subscriptionToken) || null

			if(tokenPayload){
				this.stateService.setSubscriptionDetails(this.mapToSubscriptionDetails(tokenPayload))
			}


			if(response.state && response.isActive){
				return { state: true, message: "Subscription details fetched", error: null}
			}
			else if(response.state && response.paymentStatus === "unpaid"){
				// this.stateService.setUserRole("Free")
				return { state: false, message: "Subscription is unpaid", error: response.error}
			}
			else if(response.state && !response.isActive){
				return { state: false, message: "Subscription is inactive", error: response.error}
			}
			else if(response === null) {
				this.stateService.logout()
				return { state: false, message: "Response is null", error: null };
			}
			else {
				return { state: false, message: "Error while getting subscription details", error: response.error}
			}
		} catch (error) {
			return { state: false, message: null, error: "Error while getting a subscription details"}
		}
	}

	private mapToSubscriptionDetails(payload: any): SubscriptionModel {
		return {
			email: payload.email,
			purchaseDate: new Date(payload.purchase_date),
			expirationDate: new Date(payload.expiration_date),
			paymentMethod: payload.payment_method,
			price: parseFloat(payload.price.replace(',', '.')),
			status: payload.status,
			lastPaymentStatus: payload.last_payment_status,
			recurringPayment: payload.recurring_payment
			? payload.recurring_payment.toLowerCase() === 'true'
			: false
		};
	}

}

