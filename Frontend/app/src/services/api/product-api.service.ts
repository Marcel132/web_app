import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { apiUrl } from '../../env/env.route';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

	apiUrl = apiUrl;

  constructor(
		private http: HttpClient,
	) {
		console.log('[ProductApiService] Initialized');
	}

	getAllProducts(): Observable<ProductModel[]>{
		console.log('ProductApiService: getAllProducts');
		return this.http.get<ProductModel[]>(apiUrl.products)
	}

}
