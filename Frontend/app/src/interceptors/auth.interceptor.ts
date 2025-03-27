import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(TokenService)
	const route = inject(Router)

	let sessionStorageToken
	try {
		sessionStorageToken = tokenService.getToken("token%auth")
		// console.log(sessionStorageToken)
	} catch (error) {
		sessionStorageToken = null
		route.navigate(['/home'])
	}

	// console.log("Token Inter: " + sessionStorageToken)

  const modifiedReq = req.clone({
    setHeaders: {
			Authorization: `Bearer ${sessionStorageToken}`,
			'Cache-Control': 'no-cache'
		 },
  });

  return next(modifiedReq).pipe(
		tap((event) => {
			if(event instanceof HttpResponse) {
				console.log('Intercepting response:', event);
			}
		}),
		catchError((error)=> {
			console.error('Intercepting error:', error);
			throw error;
		})
	)
};
