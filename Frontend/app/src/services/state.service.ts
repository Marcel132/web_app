import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubscriptionInterface } from '../interfaces/subscription.details';
import { MealsTable } from '../interfaces/meals-table';
import { Product } from '../interfaces/product';
import { Meals } from '../interfaces/meals';

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

	private productsSubject = new BehaviorSubject<Product[] | null>(null);
	products$ = this.productsSubject.asObservable();

	private userMealsSubject = new BehaviorSubject<Meals | null>(null);
	userMealsSubject$ = this.userMealsSubject.asObservable();

	private mealsSubject = new BehaviorSubject<MealsTable[] | null>(null);
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
	setProducts(products: Product[]){
		// console.log('Otrzymane produkty:', products);
		const sortedProducts = [...products].sort((a,b) => a.name.localeCompare(b.name))
		this.productsSubject.next(sortedProducts)
		// console.log('Posortowane produkty:', sortedProducts);
	}
	setMeals(meals: MealsTable[]){
		this.mealsSubject.next(meals)
	}
	setUserMeals(meals: Meals){
		this.userMealsSubject.next(meals)
	}

	clearAccessToken(){
		this.accessToken.next(null)
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
		sessionStorage.clear()
		return { state: true, message: "Wylogowano" }
	}
}
