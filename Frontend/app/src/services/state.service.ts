import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { SubscriptionModel } from '../models/subscription.mode';
import { UserMealsModel } from '../models/user-meals.model';
import { MealModel } from '../models/meal.model';

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

	private subscriptionDetails = new BehaviorSubject<SubscriptionModel>({} as SubscriptionModel)
	subscriptionDetailsSubject$ = this.subscriptionDetails.asObservable()
	// subscriptionDetailsValue$ = this.subscriptionDetails.getValue()

	private productsSubject = new BehaviorSubject<ProductModel[] | null>(null);
	products$ = this.productsSubject.asObservable();

	private userMealsSubject = new BehaviorSubject<UserMealsModel | null>(null);
	userMealsSubject$ = this.userMealsSubject.asObservable();

	private mealsSubject = new BehaviorSubject<MealModel[] | null>(null);
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
	setSubscriptionDetails(details: SubscriptionModel){
		this.subscriptionDetails.next(details)
	}
	setProducts(products: ProductModel[]){
		// console.log('Otrzymane produkty:', products);
		const sortedProducts = [...products].sort((a,b) => a.name.localeCompare(b.name))
		this.productsSubject.next(sortedProducts)
		// console.log('Posortowane produkty:', sortedProducts);
	}
	setMeals(meals: MealModel[]){
		this.mealsSubject.next(meals)
	}
	setUserMeals(meals: UserMealsModel){
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
		this.subscriptionDetails.next({} as SubscriptionModel)
	}

	logout(): {state: boolean, message: string} {
		this.clearAccessToken()
		this.clearUserRole()
		this.clearUserEmail()
		this.clearSubscriptionDetails()
		localStorage.removeItem("token%auth")
		sessionStorage.clear()
		return { state: true, message: "Wylogowano" }
	}
}
