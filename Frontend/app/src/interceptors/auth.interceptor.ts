import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
			Authorization: `Bearer fake-token`,
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
