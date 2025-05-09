import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../env/env.route';
import { catchError, tap } from 'rxjs';
import { ProductSaveModel } from '../models/product-save.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
		private http: HttpClient
	) { }



	saveProduct(data: ProductSaveModel) {
		const url = apiUrl.products
		console.log(data)
		return this.http.post<{status: boolean, message: string}>(url, data, {withCredentials: true})
			.pipe(
				tap(response => {
					console.log('Produkt zapisany:', response);
				}),
				catchError(error => {
					console.error('Błąd podczas zapisywania produktu:', error);
					throw error;
				})
			)

	}
}
