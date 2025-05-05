import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, shareReplay, finalize } from 'rxjs';

const pendingRequests = new Map<string, Observable<HttpEvent<any>>>();

export const requestDuplicationInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

	if (req.method === 'POST' && req.url.includes('/subscription')) {
    const key = `${req.method}:${req.urlWithParams}`;

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key)!;
    }

    const shared$ = next(req).pipe(
      shareReplay(1),
      finalize(() => pendingRequests.delete(key))
    );

    pendingRequests.set(key, shared$);

		console.log("Pending requests: ", pendingRequests)
    return shared$;
  }

  return next(req);
};
