import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { apiUrl } from '../env/env.route';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';
import { firstValueFrom} from 'rxjs';
import { SubscriptionInterface } from '../interfaces/subscription';

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
			console.log("Payload: ", tokenPayload)

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

	// async setSubscriptionDetails() {
	// 	this.stateService.accessTokenSubject$.subscribe((accessToken) => {
	// 		if(accessToken){
	// 			try {
	// 				// Define email and role
	// 				this.stateService.userEmailSubject$.subscribe(value => {
	// 					if(value){
	// 						this.email = value
	// 					}
	// 				})
	// 				this.stateService.userRoleSubject$.subscribe(value => {
	// 					if(value){
	// 						this.role = value
	// 					}
	// 				})

	// 				if(this.role !== "Admin") {
	// 					if(this.role != '' && this.role!= "Free"){
	// 						const subscriptionToken = this.tokenService.getToken("token%subscription")
	// 						if(subscriptionToken){
	// 							const payload = this.tokenService.decodeToken(subscriptionToken)
	// 							this.stateService.setSubscriptionDetails(this.mapToSubscriptionDetails(payload))
	// 							return { state: true, message: "Set subscription by token"}
	// 						} else {
	// 							const url = apiUrl.subscription
	// 							const body = { email: this.email, role: this.role}
	// 							this.http.post<{subscriptionToken: string}>(url, body, {withCredentials: true})
	// 							.subscribe(response => {
	// 								if(response){
	// 									this.tokenService.saveToken("token%subscription", response.subscriptionToken)
	// 									const payload = this.tokenService.decodeToken(response.subscriptionToken)
	// 									this.stateService.setSubscriptionDetails(payload as SubscriptionInterface)
	// 									return {state: true, message: "Set subscription by http"}
	// 								} else {
	// 									console.log("HTTP Post response is null")
	// 									return {state: false, message: "Http post is null"}
	// 								}
	// 							})
	// 							return  { state: true, message: "Set  subscription in BS"}
	// 						}
	// 					} else {
	// 						return { state: true, message: "Your role is: " + this.role}
	// 					}
	// 				}
	// 				else {
	// 					return { state: true, message: "Your role is: " + this.role}
	// 				}

	// 			} catch (error) {
	// 				console.log(error)
	// 				return	{ state: false, message: "Error with application"}
	// 			}
	// 		} else {
	// 			return  { state: true, message: "No access token in BS"}
	// 		}
	// 	})
	// }

	// private async processSubscription(){
	// 	const currentDate = new Date();
	// 	const expirationDate = new Date(this.subscriptionDetails.expirationDate);

	// 	if(this.subscriptionDetails.expirationDate == null || this.subscriptionDetails.expirationDate == undefined){
	// 		console.log("Expiration date is null or undefined")
	// 	} else if(currentDate < expirationDate){
	// 		console.log("Subscription is active")

	// 	} else if(currentDate >= expirationDate){
	// 		console.log("Subscription is expired")
	// 		this.http.put<{state: boolean, message: string}>(apiUrl.subscription, {email: this.email, role: "Free"}, {withCredentials: true}).pipe(
	// 			take(1)
	// 		).subscribe((response: any) => {
	// 			if(response.state){
	// 				this.stateService.logout()
	// 			}
	// 		}
	// 		)
	// 	}
	// }

	private mapToSubscriptionDetails(payload: any): SubscriptionInterface {
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

