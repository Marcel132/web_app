import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Intercepting request:', req);
  const modifiedReq = req.clone({
    setHeaders: { Authorization: `Bearer fake-token` }
  });

  return next(modifiedReq).pipe(
		tap((event) => { console.info('Intercepting response:', event) }),
		catchError((error)=> {
			console.error('Intercepting error:', error);
			throw error;
		})
	)
};
