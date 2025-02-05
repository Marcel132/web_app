import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

	const authService = inject(AuthService);
	const router = inject(Router);

	if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'){
		try {
			const token = authService.isAuthenticated()
			if(token){
				return true
			} else {
				router.navigate(['/login'])
				return false
			}
		}
		catch(error){
			console.warn("Error while getting a token" + error)
			router.navigate(['/login'])
			return false
		}
	} else {

		return false
	}
};
