import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
		private http: HttpClient,
	) { }


	// login(accessToken: any, refreshToken: any): void
	// {
	// 	localStorage.setItem('accesToken', accessToken);
	// 	sessionStorage.setItem('refreshToken', refreshToken);
	// }

	// logout(): void
	// {
	// 	localStorage.removeItem('accesToken');
	// 	sessionStorage.removeItem('refreshToken');
	// }

	checkRegisterData(login: string, password: string): { valid: boolean; message: string[]}
	{
		const errors: string[] = [];

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(login)) {
      errors.push('Nieprawidłowy format e-maila.');
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

	async register(data: any)
	{
		const url = 'https://localhost:5000/api/v01/users/register';
		const body = {
			login: data.login,
			password: data.password
		}

		try {
			const response = await firstValueFrom(this.http.post<{token: string}>(url, body).pipe(
				tap(response => {
					this.setToken(response.token)
				}),
				catchError((error: HttpErrorResponse) => {
					 	let errorMessage = "Błąd! Spróbuj ponownie za chwilę lub skontaktuj się z administratorem"
						if(error.status === 400){
							errorMessage = "Błędne dane!" + error.error?.message + " (Status 400)" || "Błędne dane (400)"
						}
						if(error.status === 409){
							errorMessage = "Konflikt!" + error.error?.message + "(Status 409)" || "Taki użytkownik już istnieje (409)"
						}
						return throwError(() => new Error(errorMessage))
				})
			))
			return response
		} catch( error: any){
			throw error
		}
	}


	private setToken(token: string): void
	{
		sessionStorage.setItem('authToken', token);
	}
	async getToken(): Promise<string | null>
	{
		return new Promise(resolve =>
		{
			const token = sessionStorage.getItem('authToken');
			resolve(token)
		})
	}


}
