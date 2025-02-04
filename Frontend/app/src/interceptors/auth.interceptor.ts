import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Intercepting request:', req);

  const modifiedReq = req.clone({
    setHeaders: { Authorization: `Bearer fake-token` }
  });

  return next(modifiedReq);
};
