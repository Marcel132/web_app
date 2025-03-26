import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { apiUrl } from '../env/env.route';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private http: HttpClient,
		private tokenService: TokenService
	) { }

	checkEmailValidation(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false
    }
		return true
	}

	checkFormsDataValidation(login: string, password: string): { valid: boolean; message: string[]}
	{
		const errors: string[] = [];

		if(!this.checkEmailValidation(login)){
			errors.push("Nieprawidłowy format adresu email")
		}

    // Sprawdzanie hasła
    else if (password.length < 8) {
      errors.push('Hasło musi mieć co najmniej 8 znaków. ');
    }
    else if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną wielką literę.');
    }
    else if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną małą literę.');
    }
    else if (!/[0-9]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną cyfrę.');
    }
    else if (!/[@$!%*?&]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jeden znak specjalny (@, $, !, %, *, ?, &).');
    }
		return { valid: errors.length === 0, message: errors };
	}

	async login(data: any){
		const url = apiUrl.api_login
		const body = {
			email: data.email,
			password: data.password
		}

		try {
			const response = await firstValueFrom(this.http.post<{accessToken: string}>(url, body, {withCredentials: true }).pipe(
				tap(response => {
					this.tokenService.setAccessToken(response.accessToken)
					this.tokenService.setTokenStorage("token%auth", response.accessToken)
					this.tokenService.setUserEmail()
					this.tokenService.setUserRole()
					this.tokenService.setSubscriptionDetails()
				}),
				catchError((error: HttpErrorResponse) => {
					let errorMessage = "Błąd! Spróbuj ponownie za chwilę lub skontaktuj się z administratorem"
					if(error.status === 400){
						errorMessage = "Błędne dane! " + error.error?.message + " (Status 400)" || "Błędne dane (400)"
					}
					else if(error.status === 404){
						errorMessage = error.error.message + " (Status 404)" || "Takie użytkownik nie istnieje (404)"
					}
					else if(error.status === 500){
						errorMessage = "Błąd serwera! (Status 500)"
					}
					return throwError(() => new Error(errorMessage))
				})
			))
			return response
		} catch (error) {
			throw error
		}
	}

	async register(data: any)
	{
		const url = apiUrl.api_register;
		const body = {
			email: data.email,
			password: data.password
		}

		try {
			const response = await firstValueFrom(this.http.post<{accessToken: string}>(url, body, {withCredentials: true }).pipe(
				tap(response => {
					this.tokenService.setAccessToken(response.accessToken)
					this.tokenService.setTokenStorage("token%auth", response.accessToken)
					// console.log(this.tokenService.getTokenStorage("token%auth"))
					this.tokenService.setUserEmail()
					// console.log(this.tokenService.getUserEmail())
					this.tokenService.setUserRole()
					// console.log(this.tokenService.getUserRole())
					this.tokenService.setSubscriptionDetails()
					// console.log(this.tokenService.getSubscriptionDetails())
				}),
				catchError((error: HttpErrorResponse) => {
					 	let errorMessage = "Błąd! Spróbuj ponownie za chwilę lub skontaktuj się z administratorem"
						if(error.status === 400){
							errorMessage = "Błędne dane! " + error.error?.message + " (Status 400)" || "Błędne dane (400)"
						}
						else if(error.status === 409){
							errorMessage =  error.error?.message + " (Status 409)" || "Taki użytkownik już istnieje (409)"
						}
						else if(error.status === 500){
							errorMessage = "Błąd serwera! (Status 500)"
						}
						return throwError(() => new Error(errorMessage))
				})
			))
			return response
		} catch( error: any){
			throw error
		}
	}

	isAuthenticated(): boolean{
		let token = this.tokenService.getAccessToken()
		console.log(token !== null || token !== "undefined" || token !== "")
		return token !== null

	}

}
