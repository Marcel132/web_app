import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, Observable, tap, throwError } from 'rxjs';

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

  constructor(
    private http: HttpClient
  ) { }

  fetchProductsData(): void {
    const url = "https://localhost:5000/api/v01/products";
    this.http.get<Product[]>(url).pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(this.handleError)
    ).subscribe();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
