import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, tap, throwError } from 'rxjs';

interface Product {
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

	constructor(
		private http: HttpClient
	) { }

	getProductsData(): Observable<Product[]> {
		const url = "https://localhost:5000/api/v01/products"
		return this.http.get<Product[]>(url)
	}
}
