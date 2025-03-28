import { Injectable, Injector } from '@angular/core';
import { SubscriptionInterface } from '../interfaces/subscription.details';
import { TokenService } from './token.service';
import { apiUrl } from '../env/env.route';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

	private email!: string
	private role!: string
	private subscriptionDetails!: SubscriptionInterface

	constructor(
		private http: HttpClient,
		private stateService: StateService,
		private tokenService: TokenService,
	){
		this.setSubscriptionDetails()
		stateService.subscriptionDetailsSubject$.pipe(take(1)).subscribe(data => {
			this.subscriptionDetails = data;
			if(this.subscriptionDetails != null){
				this.processSubscription()
			}
		})
	}

	async setSubscriptionDetails() {
		this.stateService.accessTokenSubject$.subscribe((accessToken) => {
			if(accessToken){
				try {
					// Define email and role
					this.stateService.userEmailSubject$.subscribe(value => {
						if(value){
							this.email = value
						} else {
							console.log("EmailSub is not defined")
						}
					})
					this.stateService.userRoleSubject$.subscribe(value => {
						if(value){
							this.role = value
						} else {
							console.log("RoleSub is not defined")
						}
					})

					if(this.role != '' && this.role!= "Free"){
						const subscriptionToken = this.tokenService.getToken("token%subscription")
						if(subscriptionToken){
							const payload = this.tokenService.decodeToken(subscriptionToken)
							this.stateService.setSubscriptionDetails(this.mapToSubscriptionDetails(payload))
							return { state: true, message: "Set subscription by token"}
						} else {
							const url = apiUrl.subscription
							const body = { email: this.email, role: this.role}
							this.http.post<{subscriptionToken: string}>(url, body, {withCredentials: true})
							.subscribe(response => {
								if(response){
									this.tokenService.saveToken("token%subscription", response.subscriptionToken)
									const payload = this.tokenService.decodeToken(response.subscriptionToken)
									this.stateService.setSubscriptionDetails(payload as SubscriptionInterface)
									return {state: true, message: "Set subscription by http"}
								} else {
									console.log("HTTP Post response is null")
									return {state: false, message: "Http post is null"}
								}
							})
							return  { state: true, message: "Set  subscription in BS"}
						}
					} else {
						console.log("Your role is: " + this.role)
						return { state: true, message: "Your role is: " + this.role}
					}

				} catch (error) {
					console.log(error)
					return	{ state: false, message: "Error with application"}
				}
			} else {
				return  { state: true, message: "No access token in BS"}
			}
		})
	}

	private async processSubscription(){
		const purchaseDate = new Date(this.subscriptionDetails.purchaseDate)
		const currentDate = new Date();
		const expirationDate = new Date(this.subscriptionDetails.expirationDate);

		if(currentDate < expirationDate){
			// console.log("Subscription is active")
		} else if(currentDate >= expirationDate){
			// console.log("Subscription is expired")
			this.subscriptionDetails.status = "Inactive"
			this.stateService.setSubscriptionDetails(this.subscriptionDetails)
			this.stateService.subscriptionDetailsSubject$.pipe(take(1)).subscribe(response => {console.log("After func: " + response.status)})
			this.stateService.setUserRole("Free")

		}
	}

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

