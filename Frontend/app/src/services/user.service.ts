import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, Observable, tap, throwError } from 'rxjs';
import { MealsTable } from '../interfaces/meals-table';
import { apiUrl } from '../env/env.route';

export interface Product {
  _id: string;
  id_prod: number;
  name: string;
  details: {
    kcal: number;
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private productsSubject = new BehaviorSubject<Product[] | null>(null);
  products$ = this.productsSubject.asObservable();

	private mealsSubject = new BehaviorSubject<MealsTable[] | null>(null);
	meals$ = this.mealsSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  fetchProductsData(): void {
    const url = apiUrl.products;
    this.http.get<Product[]>(url).pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(this.handleError)
    ).subscribe();
  }

	fetchMealsData(): void {
		const url = apiUrl.meals;
		this.http.get<MealsTable[]>(url).pipe(
			tap(meals => this.mealsSubject.next(meals)),
			catchError(this.handleError)
		).subscribe();
	}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

	async saveUserMeal(title: string, description: string, meals: MealsTable[]){
		const url = apiUrl.meals;
		const body = {
			title,
			description,
			meals
		}
		this.http.post(url, body, {withCredentials: true}).pipe(
			tap((response) => {
				console.log(response)
			}),
			catchError(this.handleError)
		).subscribe();
	}
}
