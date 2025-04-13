import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  if (!isBrowserEnvironment()) {
    return false;
  }

  try {
    const hasToken = authService.isAuthenticated();
    if (hasToken.state && hasToken.token) {
      const payload = tokenService.decodeToken(hasToken.token);
      if (isTokenValid(payload)) {
        return handleRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"], router);
      } else {
				console.warn("Token expired, redirecting to login.");
				
        return redirectToLogin(router);
      }
    }
  } catch (error) {
    console.warn("Error while getting a token: ", error);
    return redirectToLogin(router);
  }

  return false;
};

function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

function isTokenValid(payload: any): boolean {
  return payload.exp > Date.now() / 1000;
}

function handleRole(role: string, router: Router): boolean {
  if (role === "Admin") {
		console.log("Admin route");
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
}

function redirectToLogin(router: Router): boolean {
  router.navigate(['/home/forms/login']);
  return false;
}
