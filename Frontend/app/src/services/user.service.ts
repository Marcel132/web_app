import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, take, tap, throwError } from 'rxjs';
import { apiUrl } from '../env/env.route';
import { StateService } from './state.service';
import { ProductModel } from '../models/product.model';
import { UserMealsModel } from '../models/user-meals.model';
import { MealModel } from '../models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private http: HttpClient,
		private stateService: StateService
  ) { }

  fetchProductsData(): void {
    const url = apiUrl.products;
    this.http.get<ProductModel[]>(url).pipe(
			take(1),
      tap(products => this.stateService.setProducts(products)),
      catchError(this.handleError)
    ).subscribe();
  }

	fetchMealsData(): void {
		const url = apiUrl.meals;
		this.http.get<MealModel[]>(url).pipe(
			take(1),
			tap(meals => this.stateService.setMeals(meals)),
			catchError(this.handleError)
		).subscribe();
	}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

	async saveUserMeal(title: string, description: string, meals: MealModel[]): Promise<{ state: boolean, message: string} >{
		let email: string | undefined;
		await firstValueFrom(this.stateService.userEmailSubject$).then(data => {
			if (data) {
				email = data;
			}
		});

		const url = apiUrl.meals;
		const body = {
			email: email,
			details: [
				{
					title: title,
					description: description,
					date:  new Date().toISOString,
					meals: meals.map(meal => ({
						id_prod: meal.id_prod,
						name: meal.name,
						weight: meal.weight,
						productDetails: meal.productDetails
				}))
				}
			]
		}

		return firstValueFrom(
			this.http.post<{ state: boolean, message: string }>(url, body, { withCredentials: true }).pipe(
				tap(response => {}),
				catchError(this.handleError)
			)
		).then(response => {
			if (response.state) {
				return { state: true, message: response.message };
			} else {
				return { state: false, message: response.message };
			}
		}).catch(error => {
			console.error(error);
			return { state: false, message: 'An error occurred while saving the meal.' };
		});
		// this.http.post<{state: boolean, message: string}>(url, body, {withCredentials: true}).pipe(
		// 	tap((response) => {
		// 		// if(response && response.success){
		// 		// 	return {state: true, message: "Zapisano posiłek"}
		// 		// } else {
		// 		// 	return {state: false, message: "Błąd przy zapisaniu! Spróbuj ponownie później"}
		// 		// }
		// 	}),
		// 	catchError(this.handleError)
		// ).subscribe();
	}

	async deleteUserMeal(id: string): Promise<{ state: boolean, message: string}> {
		const email = await firstValueFrom(this.stateService.userEmailSubject$);

		if(!email) {
			return { state: false, message: "Nie można usunąć posiłku" };
		}

		const url = `${apiUrl.userMeals}?email=${email}&id=${id}`;

		try {
			const response = await firstValueFrom(
				this.http.delete<{ state: true, message: string }>(url, { withCredentials: true })
			)

			if(response.state) {
				return { state: true, message: response.message };
			}
			else {
				return { state: false, message: response.message };
			}
		}
		catch(error){
			console.error(error);
			return { state: false, message: "Nie można usunąć posiłku" };
		}
	}

	fetchUserMealsData(){
		let email
		this.stateService.userEmailSubject$.pipe(take(1)).subscribe( data => data ? email = data : null)
		let role
		this.stateService.userRoleSubject$.pipe(take(1)).subscribe( data => data ? role = data : null)

		const url = apiUrl.userMeals
		const body = {
			email,
			role
		}
		this.http.post<{state: boolean, response: UserMealsModel}>(url, body, {withCredentials: true})
		.pipe(
			tap( response => {
				if(response != null){
					this.stateService.setUserMeals(response.response)
				}
			}),
			catchError(this.handleError)
		).subscribe()
	}

	updateUserSettings(newValues: {}) {
		const raw = localStorage.getItem("user%settings");
		const current = raw ? JSON.parse(raw) : {};

		const updated = { ...current, ...newValues };
		localStorage.setItem("user%settings", JSON.stringify(updated));
	}
}
