import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubscriptionInterface } from '../interfaces/subscription';
import { MealsTableInterface } from '../interfaces/meals-table';
import { ProductInterface } from '../interfaces/product';
import { MealsInterface } from '../interfaces/meals';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() {
	}

	private accessToken = new BehaviorSubject<string | null>(null)
	accessTokenSubject$ = this.accessToken.asObservable()
	// accessTokenValue$ = this.accessToken.getValue()

	private userRole = new BehaviorSubject<string>("")
	userRoleSubject$ = this.userRole.asObservable()
	userRoleValue$ = this.userRole.value
	// userRoleValue$ = this.userRole.getValue()


	private userEmail = new BehaviorSubject<string>("")
	userEmailSubject$ = this.userEmail.asObservable()
	// userEmailValue$ = this.userEmail.getValue()

	private subscriptionDetails = new BehaviorSubject<SubscriptionInterface>({} as SubscriptionInterface)
	subscriptionDetailsSubject$ = this.subscriptionDetails.asObservable()
	// subscriptionDetailsValue$ = this.subscriptionDetails.getValue()

	private productsSubject = new BehaviorSubject<ProductInterface[] | null>(null);
	products$ = this.productsSubject.asObservable();

	private userMealsSubject = new BehaviorSubject<MealsInterface | null>(null);
	userMealsSubject$ = this.userMealsSubject.asObservable();

	private mealsSubject = new BehaviorSubject<MealsTableInterface[] | null>(null);
	meals$ = this.mealsSubject.asObservable();


	setAccessToken(token: string){
		this.accessToken.next(token)
	}
	setUserRole(role: string){
		this.userRole.next(role)
	}
	setUserEmail(email: string){
		this.userEmail.next(email)
	}
	setSubscriptionDetails(details: SubscriptionInterface){
		this.subscriptionDetails.next(details)
	}
	setProducts(products: ProductInterface[]){
		// console.log('Otrzymane produkty:', products);
		const sortedProducts = [...products].sort((a,b) => a.name.localeCompare(b.name))
		this.productsSubject.next(sortedProducts)
		// console.log('Posortowane produkty:', sortedProducts);
	}
	setMeals(meals: MealsTableInterface[]){
		this.mealsSubject.next(meals)
	}
	setUserMeals(meals: MealsInterface){
		this.userMealsSubject.next(meals)
	}

	clearAccessToken(){
		this.accessToken.next(null)
		localStorage.removeItem("token%auth")
	}
	clearUserRole(){
		this.userRole.next("")
	}
	clearUserEmail(){
		this.userEmail.next("")
	}
	clearSubscriptionDetails(){
		this.subscriptionDetails.next({} as SubscriptionInterface)
	}

	logout(): {state: boolean, message: string} {
		this.clearAccessToken()
		this.clearUserRole()
		this.clearUserEmail()
		this.clearSubscriptionDetails()
		localStorage.removeItem("token%auth")
		localStorage.removeItem("token%subscription")
		sessionStorage.clear()
		return { state: true, message: "Wylogowano" }
	}
}
